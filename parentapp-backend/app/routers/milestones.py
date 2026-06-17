from datetime import datetime
from fastapi import APIRouter, HTTPException, Depends

from ..database import db
from ..dependencies import get_current_user
from ..schemas import MilestoneState

router = APIRouter(prefix="/api", tags=["milestones"])


@router.get("/milestones")
async def get_milestones(user=Depends(get_current_user)):
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    doc = await db.milestones.find_one({"userId": user["_id"]})
    return {"checked": doc.get("checked", {}) if doc else {}}


@router.put("/milestones")
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
