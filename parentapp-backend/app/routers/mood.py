from fastapi import APIRouter, HTTPException, Depends

from ..database import db
from ..dependencies import get_current_user
from ..prompts import get_system_prompt
from ..schemas import MoodLogEntry, MoodRequest
from ..services.ai import stream_completion

router = APIRouter(prefix="/api", tags=["mood"])


@router.post("/mood-advice")
async def mood_advice(req: MoodRequest):
    profile = req.profile.model_dump() if req.profile else None
    name = (profile or {}).get("name", "")
    name_clause = f" ({name})" if name else ""

    user_message = (
        f"A parent{name_clause} just checked in and is feeling: {req.mood_label}. "
        "Give a warm, honest, specific response — acknowledge how they feel, "
        "give one concrete thing they can do right now, end with a brief reassuring note. "
        "3-4 sentences, no bullet points."
    )

    messages = [
        {"role": "system", "content": get_system_prompt(profile)},
        {"role": "user", "content": user_message},
    ]
    return await stream_completion(messages)


@router.post("/mood-log")
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
    cursor = db.mood_logs.find({"userId": user["_id"]}).sort("date", -1).skip(30)
    old_ids = [doc["_id"] async for doc in cursor]
    if old_ids:
        await db.mood_logs.delete_many({"_id": {"$in": old_ids}})
    return {"ok": True}


@router.get("/mood-log")
async def get_mood_log(user=Depends(get_current_user)):
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    cursor = db.mood_logs.find({"userId": user["_id"]}).sort("date", -1).limit(30)
    return [{"moodId": doc["moodId"], "date": doc["date"]} async for doc in cursor]
