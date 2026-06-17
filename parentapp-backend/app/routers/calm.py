from fastapi import APIRouter

from ..prompts import get_system_prompt
from ..schemas import CalmPromptRequest
from ..services.ai import get_completion

router = APIRouter(prefix="/api", tags=["calm"])


@router.post("/calm-prompt")
async def calm_prompt(req: CalmPromptRequest):
    profile = req.profile.model_dump() if req.profile else None

    text = await get_completion([
        {"role": "system", "content": get_system_prompt(profile)},
        {"role": "user", "content": (
            "Give me exactly one short grounding sentence (max 12 words) "
            "to help a stressed parent calm down right now. "
            "Return only the sentence, no punctuation at the start, no quotes."
        )},
    ], timeout=20)

    return {"prompt": text.strip().strip('"').strip("'")}
