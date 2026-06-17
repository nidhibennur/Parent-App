import json as json_lib
import re
from fastapi import APIRouter, HTTPException

from ..prompts import get_system_prompt
from ..schemas import TopicContentRequest, TopicQARequest
from ..services.ai import get_completion, stream_completion

router = APIRouter(prefix="/api", tags=["learning"])


@router.post("/topic-content")
async def topic_content(req: TopicContentRequest):
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

    raw = await get_completion([
        {"role": "system", "content": "You are a helpful child development expert. Always respond with valid JSON only."},
        {"role": "user", "content": prompt},
    ], timeout=60)
    raw = raw.strip()

    if raw.startswith("```"):
        raw = re.sub(r"^```[a-z]*\n?", "", raw)
        raw = re.sub(r"\n?```$", "", raw)
    try:
        return json_lib.loads(raw)
    except Exception:
        raise HTTPException(status_code=500, detail="AI returned invalid JSON")


@router.post("/topic-qa")
async def topic_qa(req: TopicQARequest):
    profile = req.profile.model_dump() if req.profile else None
    user_message = (
        f"The parent is reading about: \"{req.topic_title}\" ({req.topic_summary}). "
        f"Their question is: {req.question}"
    )

    messages = [
        {"role": "system", "content": get_system_prompt(profile)},
        {"role": "user", "content": user_message},
    ]
    return await stream_completion(messages)
