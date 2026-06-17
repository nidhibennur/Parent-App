import bcrypt as _bcrypt
from datetime import datetime, timedelta
from fastapi import APIRouter, HTTPException, Depends
from jose import jwt
from bson import ObjectId

from ..config import JWT_SECRET, JWT_ALGORITHM, JWT_EXPIRE_DAYS
from ..database import db
from ..dependencies import get_current_user
from ..schemas import RegisterRequest, LoginRequest, ProfileUpdate

router = APIRouter(prefix="/api/auth", tags=["auth"])


def hash_password(password: str) -> str:
    return _bcrypt.hashpw(password.encode(), _bcrypt.gensalt()).decode()


def verify_password(plain: str, hashed: str) -> bool:
    return _bcrypt.checkpw(plain.encode(), hashed.encode())


def create_token(user_id: str) -> str:
    exp = datetime.utcnow() + timedelta(days=JWT_EXPIRE_DAYS)
    return jwt.encode({"sub": user_id, "exp": exp}, JWT_SECRET, algorithm=JWT_ALGORITHM)


@router.post("/register")
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


@router.post("/login")
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


@router.get("/me")
async def me(user=Depends(get_current_user)):
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return {
        "id": str(user["_id"]),
        "email": user.get("email"),
        "onboarded": bool(user.get("onboarded")),
        **{k: user.get(k) for k in ["name", "role", "firstTime", "children", "challenges", "style"]},
    }


@router.put("/profile")
async def update_profile(updates: ProfileUpdate, user=Depends(get_current_user)):
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")

    update_data = {k: v for k, v in updates.model_dump().items() if v is not None}
    update_data["onboarded"] = True
    await db.users.update_one({"_id": user["_id"]}, {"$set": update_data})
    return {"ok": True}
