import json as json_lib
import re
from fastapi import APIRouter, HTTPException

from ..prompts import get_system_prompt
from ..schemas import TipOfDayRequest, TipsRequest
from ..services.ai import get_completion

router = APIRouter(prefix="/api", tags=["tips"])

AGE_LABELS = {
    "baby": "babies aged 0–1 year",
    "toddler": "toddlers aged 1–3 years",
    "prek": "pre-school children aged 3–5 years",
    "school": "school-age children aged 6 and above",
}


@router.post("/tips")
async def generate_tips(req: TipsRequest):
    age_label = AGE_LABELS.get(req.age_group, "children of all ages")
    profile = req.profile.model_dump() if req.profile else None

    user_message = (
        f"Generate 4 practical, specific parenting tips for parents of {age_label}. "
        "Return ONLY a JSON array — no extra text, no markdown. Format:\n"
        '[{"emoji":"🧘","title":"Short title","body":"2-3 sentence practical tip."}]'
    )

    raw = await get_completion([
        {"role": "system", "content": get_system_prompt(profile)},
        {"role": "user", "content": user_message},
    ])

    match = re.search(r'\[.*\]', raw, re.DOTALL)
    if match:
        try:
            return {"tips": json_lib.loads(match.group())}
        except Exception:
            pass
    return {"tips": []}


@router.post("/tip-of-day")
async def tip_of_day(req: TipOfDayRequest):
    from datetime import date
    today = date.today().isoformat()
    profile = req.profile.model_dump() if req.profile else None

    user_message = (
        f"Today is {today}. Generate exactly ONE practical, specific parenting tip for today. "
        "Return ONLY a JSON object — no extra text, no markdown fences. Format:\n"
        '{"emoji":"🧘","title":"Short title (5 words max)","body":"2-3 sentence actionable tip."}'
    )

    raw = await get_completion([
        {"role": "system", "content": get_system_prompt(profile)},
        {"role": "user", "content": user_message},
    ])
    raw = raw.strip()

    if raw.startswith("```"):
        raw = re.sub(r"^```[a-z]*\n?", "", raw)
        raw = re.sub(r"\n?```$", "", raw)
    try:
        return json_lib.loads(raw)
    except Exception:
        raise HTTPException(status_code=500, detail="AI returned invalid JSON")
