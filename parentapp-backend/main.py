from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Optional, List
from motor.motor_asyncio import AsyncIOMotorClient
import certifi
from jose import JWTError, jwt
import bcrypt as _bcrypt
from datetime import datetime, timedelta
from bson import ObjectId
import httpx
import os
import re
import json as json_lib
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── MongoDB ───────────────────────────────────────────────────────────────────
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
mongo_client = AsyncIOMotorClient(MONGODB_URI, tlsCAFile=certifi.where())
db = mongo_client.parentapp

# ── Auth helpers ──────────────────────────────────────────────────────────────
JWT_SECRET = os.getenv("JWT_SECRET", "change-this-in-production")
JWT_ALGORITHM = "HS256"
JWT_EXPIRE_DAYS = 30
security = HTTPBearer(auto_error=False)


def hash_password(password: str) -> str:
    return _bcrypt.hashpw(password.encode(), _bcrypt.gensalt()).decode()


def verify_password(plain: str, hashed: str) -> bool:
    return _bcrypt.checkpw(plain.encode(), hashed.encode())


def create_token(user_id: str) -> str:
    exp = datetime.utcnow() + timedelta(days=JWT_EXPIRE_DAYS)
    return jwt.encode({"sub": user_id, "exp": exp}, JWT_SECRET, algorithm=JWT_ALGORITHM)


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not credentials:
        return None
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        return user
    except Exception:
        return None


# ── Profile context builder ───────────────────────────────────────────────────
AGE_RANGE_LABELS = {
    "newborn": "Newborn 0-3m",
    "baby": "Baby 3-12m",
    "toddler": "Toddler 1-3yr",
    "preschool": "Preschool 3-5yr",
    "school": "School-age 6-11yr",
    "teen": "Teen 12+yr",
}

STYLE_MAP = {
    "brief": "Brief and direct — concise answers, no fluff",
    "warm": "Warm and reassuring — emotional acknowledgement first, then practical advice",
    "detailed": "Detailed and thorough — comprehensive explanations with full context",
    "structured": "Step-by-step structured — always use numbered steps and clear format",
}

ROLE_MAP = {
    "mom": "Mom", "dad": "Dad",
    "guardian": "Guardian", "caregiver": "Caregiver", "other": "Parent",
}


def build_profile_context(profile: dict) -> str:
    if not profile or not profile.get("name"):
        return ""

    name = profile.get("name", "")
    role_label = ROLE_MAP.get(profile.get("role", ""), "Parent")
    first_time = "first-time parent" if profile.get("firstTime") else "experienced parent"

    children = profile.get("children") or []
    if children:
        children_text = ", ".join(
            f"{c.get('nickname', 'Child')} ({AGE_RANGE_LABELS.get(c.get('ageRange', ''), 'unknown age')})"
            for c in children
        )
    else:
        children_text = "no children specified yet"

    challenges = profile.get("challenges") or []
    challenges_text = ", ".join(challenges) if challenges else "general parenting"
    style_text = STYLE_MAP.get(profile.get("style", ""), "balanced approach")

    return f"""

## Parent profile — personalise ALL responses to this context
- Name: {name}, {role_label}, {first_time}
- Children: {children_text}
- Current focus/challenges: {challenges_text}
- Preferred response style: {style_text}

IMPORTANT: Address {name} by name occasionally (naturally, not every message). Always tailor advice to the exact ages of their children. Prioritise content around their challenges: {challenges_text}. Match their preferred style exactly."""


# ── System prompt ─────────────────────────────────────────────────────────────
BASE_SYSTEM_PROMPT = """You are Parent App — a warm, knowledgeable parenting support assistant built specifically to help parents navigate the real, messy, and sometimes overwhelming experience of raising children.

## Your role
You support parents through every stage: newborn, infant, toddler, preschool, school-age, and teen. You help with:
- Immediate crises: tantrums, non-stop crying, sleep battles, feeding refusal, meltdowns
- Emotional support: parental overwhelm, guilt, burnout, frustration, anxiety
- Behaviour: hitting, biting, defiance, aggression, lying, separation anxiety
- Development: milestones, speech, social skills, learning, screen time
- Routines: sleep schedules, bedtime, feeding, potty training, homework struggles
- Relationships: sibling rivalry, bonding, co-parenting, blended families
- General parenting questions: discipline approaches, age-appropriate activities, nutrition, safety

## How to respond
1. Acknowledge first — briefly validate how the parent is feeling before jumping into advice.
2. Be specific and actionable — give concrete steps they can take right now.
3. Be age-aware — tailor your response precisely to the child's developmental stage.
4. Be concise — 3 to 5 sentences for simple questions, short structured response for complex ones.
5. Stay non-judgmental — parents are doing their best under real pressure.

## Tone
Warm, calm, and practical — like a trusted friend who happens to have deep parenting expertise. Not clinical. Not preachy. Not robotic.

## When to refer to professionals
Gently recommend a paediatrician, child psychologist, or specialist when:
- A child shows signs of developmental delay or sudden regression
- Behaviour is severe, persistent, or has changed dramatically
- The parent describes their own mental health struggles
- Any medical symptoms are involved

## Emergency protocol
If anyone is in immediate physical danger — direct them to call emergency services first.

## What you never do
- Never diagnose a child with any medical or psychological condition
- Never recommend specific medications or treatments
- Never give a generic answer when age or context clearly matters
- Never make a parent feel judged or ashamed for struggling"""


def get_system_prompt(profile: dict = None) -> str:
    return BASE_SYSTEM_PROMPT + (build_profile_context(profile) if profile else "")


# ── Pydantic models ───────────────────────────────────────────────────────────
class Message(BaseModel):
    role: str
    content: str


class ProfileData(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    firstTime: Optional[bool] = None
    children: Optional[List[dict]] = None
    challenges: Optional[List[str]] = None
    style: Optional[str] = None


class ChatRequest(BaseModel):
    messages: List[Message]
    profile: Optional[ProfileData] = None


class ChatTitleRequest(BaseModel):
    message: str
    reply: Optional[str] = None


class MoodRequest(BaseModel):
    mood_id: str
    mood_label: str
    profile: Optional[ProfileData] = None


class TipsRequest(BaseModel):
    age_group: str
    profile: Optional[ProfileData] = None


class TipOfDayRequest(BaseModel):
    profile: Optional[ProfileData] = None


class TopicQARequest(BaseModel):
    topic_title: str
    topic_summary: str
    question: str
    profile: Optional[ProfileData] = None


class TopicContentRequest(BaseModel):
    topic_id: str
    topic_title: str
    topic_summary: str
    profile: Optional[ProfileData] = None


class MoodLogEntry(BaseModel):
    moodId: str
    date: str  # ISO string


class MilestoneState(BaseModel):
    checked: dict


class RegisterRequest(BaseModel):
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    firstTime: Optional[bool] = None
    children: Optional[List[dict]] = None
    challenges: Optional[List[str]] = None
    style: Optional[str] = None


# ── Health ────────────────────────────────────────────────────────────────────
@app.get("/api/health")
def health():
    return {"status": "ok"}


# ── Chat history CRUD ─────────────────────────────────────────────────────────
class ChatDoc(BaseModel):
    id: str
    title: str
    topic: Optional[str] = None
    messages: List[dict]
    updatedAt: int
    createdAt: int


@app.get("/api/chats")
async def get_chats(user=Depends(get_current_user)):
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    cursor = db.chats.find({"userId": user["_id"]}).sort("updatedAt", -1).limit(50)
    chats = []
    async for c in cursor:
        chats.append({
            "id": c["id"], "title": c["title"], "topic": c.get("topic"),
            "messages": c["messages"], "updatedAt": c["updatedAt"], "createdAt": c["createdAt"],
        })
    return chats


@app.post("/api/chats")
async def upsert_chat(chat: ChatDoc, user=Depends(get_current_user)):
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    await db.chats.update_one(
        {"id": chat.id, "userId": user["_id"]},
        {"$set": {**chat.model_dump(), "userId": user["_id"]}},
        upsert=True,
    )
    return {"ok": True}


@app.delete("/api/chats/{chat_id}")
async def delete_chat(chat_id: str, user=Depends(get_current_user)):
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    await db.chats.delete_one({"id": chat_id, "userId": user["_id"]})
    return {"ok": True}


# ── Auth endpoints ────────────────────────────────────────────────────────────
@app.post("/api/auth/register")
async def register(req: RegisterRequest):
    existing = await db.users.find_one({"email": req.email.lower()})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    result = await db.users.insert_one({
        "email": req.email.lower(),
        "password_hash": hash_password(req.password),
        "name": None,
        "role": None,
        "firstTime": None,
        "children": [],
        "challenges": [],
        "style": None,
        "onboarded": False,
        "createdAt": datetime.utcnow(),
    })
    return {"token": create_token(str(result.inserted_id)), "id": str(result.inserted_id), "onboarded": False}


@app.post("/api/auth/login")
async def login(req: LoginRequest):
    user = await db.users.find_one({"email": req.email.lower()})
    if not user or not verify_password(req.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    profile = {k: user.get(k) for k in ["name", "role", "firstTime", "children", "challenges", "style"]}
    return {
        "token": create_token(str(user["_id"])),
        "id": str(user["_id"]),
        "onboarded": bool(user.get("onboarded")),
        "profile": profile,
        "email": user["email"],
    }


@app.get("/api/auth/me")
async def me(user=Depends(get_current_user)):
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return {
        "id": str(user["_id"]),
        "email": user.get("email"),
        "onboarded": bool(user.get("onboarded")),
        **{k: user.get(k) for k in ["name", "role", "firstTime", "children", "challenges", "style"]},
    }


@app.put("/api/auth/profile")
async def update_profile(updates: ProfileUpdate, user=Depends(get_current_user)):
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")

    update_data = {k: v for k, v in updates.model_dump().items() if v is not None}
    update_data["onboarded"] = True
    await db.users.update_one({"_id": user["_id"]}, {"$set": update_data})
    return {"ok": True}


# ── Chat ──────────────────────────────────────────────────────────────────────
@app.post("/api/chat")
async def chat(req: ChatRequest):
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="API key not configured")

    profile = req.profile.model_dump() if req.profile else None
    payload = {
        "model": "openai/gpt-oss-120b:free",
        "stream": True,
        "messages": [
            {"role": "system", "content": get_system_prompt(profile)},
            *[m.model_dump() for m in req.messages],
        ],
    }

    async def generate():
        async with httpx.AsyncClient(timeout=60) as client:
            async with client.stream(
                "POST",
                "https://openrouter.ai/api/v1/chat/completions",
                headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
                json=payload,
            ) as response:
                async for line in response.aiter_lines():
                    if line:
                        yield f"{line}\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream")


# ── Chat title ───────────────────────────────────────────────────────────────
@app.post("/api/chat-title")
async def chat_title(req: ChatTitleRequest):
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="API key not configured")

    context = f"Parent's message: {req.message[:300]}"
    if req.reply:
        context += f"\nAI reply (first 200 chars): {req.reply[:200]}"

    async with httpx.AsyncClient(timeout=20) as client:
        resp = await client.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
            json={
                "model": "openai/gpt-oss-120b:free",
                "stream": False,
                "messages": [
                    {
                        "role": "system",
                        "content": (
                            "You create short, descriptive chat titles for a parenting support app. "
                            "Given a parent's message and the AI's reply, write a title that describes the TOPIC being discussed — "
                            "not a rephrasing or capitalisation of the question itself. "
                            "Examples: 'Toddler Sleep Regression Help', 'Managing Mealtime Tantrums', 'Baby Milestone Concerns'. "
                            "Return ONLY the title — 3 to 5 words, title case, no punctuation, no quotes."
                        ),
                    },
                    {
                        "role": "user",
                        "content": context,
                    },
                ],
            },
        )
    resp.raise_for_status()
    title = resp.json()["choices"][0]["message"]["content"].strip().strip('"').strip("'")
    return {"title": title}


# ── Mood advice ───────────────────────────────────────────────────────────────
@app.post("/api/mood-advice")
async def mood_advice(req: MoodRequest):
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="API key not configured")

    profile = req.profile.model_dump() if req.profile else None
    name = (profile or {}).get("name", "")
    name_clause = f" ({name})" if name else ""

    user_message = (
        f"A parent{name_clause} just checked in and is feeling: {req.mood_label}. "
        "Give a warm, honest, specific response — acknowledge how they feel, "
        "give one concrete thing they can do right now, end with a brief reassuring note. "
        "3-4 sentences, no bullet points."
    )

    payload = {
        "model": "openai/gpt-oss-120b:free",
        "stream": True,
        "messages": [
            {"role": "system", "content": get_system_prompt(profile)},
            {"role": "user", "content": user_message},
        ],
    }

    async def generate():
        async with httpx.AsyncClient(timeout=60) as client:
            async with client.stream(
                "POST",
                "https://openrouter.ai/api/v1/chat/completions",
                headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
                json=payload,
            ) as response:
                async for line in response.aiter_lines():
                    if line:
                        yield f"{line}\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream")


# ── AI-generated tips ─────────────────────────────────────────────────────────
@app.post("/api/tips")
async def generate_tips(req: TipsRequest):
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="API key not configured")

    age_label = {
        "baby": "babies aged 0–1 year",
        "toddler": "toddlers aged 1–3 years",
        "prek": "pre-school children aged 3–5 years",
        "school": "school-age children aged 6 and above",
    }.get(req.age_group, "children of all ages")

    profile = req.profile.model_dump() if req.profile else None
    user_message = (
        f"Generate 4 practical, specific parenting tips for parents of {age_label}. "
        "Return ONLY a JSON array — no extra text, no markdown. Format:\n"
        '[{"emoji":"🧘","title":"Short title","body":"2-3 sentence practical tip."}]'
    )

    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
            json={
                "model": "openai/gpt-oss-120b:free",
                "messages": [
                    {"role": "system", "content": get_system_prompt(profile)},
                    {"role": "user", "content": user_message},
                ],
            },
        )

    data = response.json()
    raw = data["choices"][0]["message"]["content"]
    match = re.search(r'\[.*\]', raw, re.DOTALL)
    if match:
        try:
            return {"tips": json_lib.loads(match.group())}
        except Exception:
            pass
    return {"tips": []}


@app.post("/api/tip-of-day")
async def tip_of_day(req: TipOfDayRequest):
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="API key not configured")

    from datetime import date
    today = date.today().isoformat()
    profile = req.profile.model_dump() if req.profile else None

    user_message = (
        f"Today is {today}. Generate exactly ONE practical, specific parenting tip for today. "
        "Return ONLY a JSON object — no extra text, no markdown fences. Format:\n"
        '{"emoji":"🧘","title":"Short title (5 words max)","body":"2-3 sentence actionable tip."}'
    )

    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
            json={
                "model": "openai/gpt-oss-120b:free",
                "messages": [
                    {"role": "system", "content": get_system_prompt(profile)},
                    {"role": "user", "content": user_message},
                ],
            },
        )

    raw = response.json()["choices"][0]["message"]["content"].strip()
    if raw.startswith("```"):
        raw = re.sub(r"^```[a-z]*\n?", "", raw)
        raw = re.sub(r"\n?```$", "", raw)
    try:
        return json_lib.loads(raw)
    except Exception:
        raise HTTPException(status_code=500, detail="AI returned invalid JSON")


# ── Mood log ─────────────────────────────────────────────────────────────────
@app.post("/api/mood-log")
async def add_mood_log(entry: MoodLogEntry, user=Depends(get_current_user)):
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    await db.mood_logs.insert_one({
        "userId": user["_id"],
        "userName": user.get("name"),
        "userEmail": user.get("email"),
        "moodId": entry.moodId,
        "date": entry.date,
    })
    # Trim to last 30 entries per user
    cursor = db.mood_logs.find({"userId": user["_id"]}).sort("date", -1).skip(30)
    old_ids = [doc["_id"] async for doc in cursor]
    if old_ids:
        await db.mood_logs.delete_many({"_id": {"$in": old_ids}})
    return {"ok": True}


@app.get("/api/mood-log")
async def get_mood_log(user=Depends(get_current_user)):
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    cursor = db.mood_logs.find({"userId": user["_id"]}).sort("date", -1).limit(30)
    return [{"moodId": doc["moodId"], "date": doc["date"]} async for doc in cursor]


# ── Milestones ────────────────────────────────────────────────────────────────
@app.get("/api/milestones")
async def get_milestones(user=Depends(get_current_user)):
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    doc = await db.milestones.find_one({"userId": user["_id"]})
    return {"checked": doc.get("checked", {}) if doc else {}}


@app.put("/api/milestones")
async def save_milestones(state: MilestoneState, user=Depends(get_current_user)):
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    await db.milestones.update_one(
        {"userId": user["_id"]},
        {"$set": {
            "checked": state.checked,
            "userName": user.get("name"),
            "userEmail": user.get("email"),
            "updatedAt": datetime.utcnow(),
        }},
        upsert=True,
    )
    return {"ok": True}


# ── Calm prompt ──────────────────────────────────────────────────────────────
class CalmPromptRequest(BaseModel):
    profile: Optional[ProfileData] = None


@app.post("/api/calm-prompt")
async def calm_prompt(req: CalmPromptRequest):
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="API key not configured")

    profile = req.profile.model_dump() if req.profile else None

    async with httpx.AsyncClient(timeout=20) as client:
        response = await client.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
            json={
                "model": "openai/gpt-oss-120b:free",
                "messages": [
                    {"role": "system", "content": get_system_prompt(profile)},
                    {"role": "user", "content": (
                        "Give me exactly one short grounding sentence (max 12 words) "
                        "to help a stressed parent calm down right now. "
                        "Return only the sentence, no punctuation at the start, no quotes."
                    )},
                ],
            },
        )

    data = response.json()
    text = data["choices"][0]["message"]["content"].strip().strip('"').strip("'")
    return {"prompt": text}


# ── Topic content (AI-generated) ─────────────────────────────────────────────
@app.post("/api/topic-content")
async def topic_content(req: TopicContentRequest):
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="API key not configured")

    profile = req.profile.model_dump() if req.profile else None
    prompt = (
        f"You are a child development expert writing a parenting guide section.\n"
        f"Topic: \"{req.topic_title}\"\n"
        f"Summary: {req.topic_summary}\n\n"
        f"Return ONLY a valid JSON object with these exact keys:\n"
        f"- overview: a 2-3 sentence plain-text intro (no markdown)\n"
        f"- steps: array of 4-5 short action strings (no markdown, plain text)\n"
        f"- dos: array of 3-4 short do-strings (plain text, start with a verb)\n"
        f"- donts: array of 3-4 short don't-strings (plain text, start with a verb)\n"
        f"- keyTakeaway: one short sentence summarising the most important insight\n\n"
        f"Do not wrap in markdown fences. Output raw JSON only."
    )
    if profile:
        prompt += f"\n\nParent profile: {json_lib.dumps(profile)}"

    payload = {
        "model": "openai/gpt-oss-120b:free",
        "stream": False,
        "messages": [
            {"role": "system", "content": "You are a helpful child development expert. Always respond with valid JSON only."},
            {"role": "user", "content": prompt},
        ],
    }

    async with httpx.AsyncClient(timeout=60) as client:
        resp = await client.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
            json=payload,
        )
        resp.raise_for_status()
        raw = resp.json()["choices"][0]["message"]["content"].strip()
        if raw.startswith("```"):
            raw = re.sub(r"^```[a-z]*\n?", "", raw)
            raw = re.sub(r"\n?```$", "", raw)
        try:
            return json_lib.loads(raw)
        except Exception:
            raise HTTPException(status_code=500, detail="AI returned invalid JSON")


# ── Topic Q&A ─────────────────────────────────────────────────────────────────
@app.post("/api/topic-qa")
async def topic_qa(req: TopicQARequest):
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="API key not configured")

    profile = req.profile.model_dump() if req.profile else None
    user_message = (
        f"The parent is reading about: \"{req.topic_title}\" ({req.topic_summary}). "
        f"Their question is: {req.question}"
    )

    payload = {
        "model": "openai/gpt-oss-120b:free",
        "stream": True,
        "messages": [
            {"role": "system", "content": get_system_prompt(profile)},
            {"role": "user", "content": user_message},
        ],
    }

    async def generate():
        async with httpx.AsyncClient(timeout=60) as client:
            async with client.stream(
                "POST",
                "https://openrouter.ai/api/v1/chat/completions",
                headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
                json=payload,
            ) as response:
                async for line in response.aiter_lines():
                    if line:
                        yield f"{line}\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream")
