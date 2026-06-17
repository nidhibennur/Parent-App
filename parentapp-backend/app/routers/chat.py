from fastapi import APIRouter, HTTPException, Depends

from ..database import db
from ..dependencies import get_current_user
from ..prompts import get_system_prompt
from ..schemas import ChatDoc, ChatRequest, ChatTitleRequest
from ..services.ai import get_completion, stream_completion

router = APIRouter(prefix="/api", tags=["chat"])


@router.get("/chats")
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


@router.post("/chats")
async def upsert_chat(chat: ChatDoc, user=Depends(get_current_user)):
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    await db.chats.update_one(
        {"id": chat.id, "userId": user["_id"]},
        {"$set": {**chat.model_dump(), "userId": user["_id"]}},
        upsert=True,
    )
    return {"ok": True}


@router.delete("/chats/{chat_id}")
async def delete_chat(chat_id: str, user=Depends(get_current_user)):
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    await db.chats.delete_one({"id": chat_id, "userId": user["_id"]})
    return {"ok": True}


@router.post("/chat")
async def chat(req: ChatRequest):
    profile = req.profile.model_dump() if req.profile else None
    messages = [
        {"role": "system", "content": get_system_prompt(profile)},
        *[m.model_dump() for m in req.messages],
    ]
    return await stream_completion(messages)


@router.post("/chat-title")
async def chat_title(req: ChatTitleRequest):
    context = f"Parent's message: {req.message[:300]}"
    if req.reply:
        context += f"\nAI reply (first 200 chars): {req.reply[:200]}"

    messages = [
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
        {"role": "user", "content": context},
    ]
    title = await get_completion(messages, timeout=20)
    return {"title": title.strip().strip('"').strip("'")}
