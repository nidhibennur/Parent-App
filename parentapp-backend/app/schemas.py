from pydantic import BaseModel
from typing import Optional, List


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


class ChatDoc(BaseModel):
    id: str
    title: str
    topic: Optional[str] = None
    messages: List[dict]
    updatedAt: int
    createdAt: int


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


class MoodLogEntry(BaseModel):
    moodId: str
    date: str


class MilestoneState(BaseModel):
    checked: dict


class TipsRequest(BaseModel):
    age_group: str
    profile: Optional[ProfileData] = None


class TipOfDayRequest(BaseModel):
    profile: Optional[ProfileData] = None


class CalmPromptRequest(BaseModel):
    profile: Optional[ProfileData] = None


class TopicContentRequest(BaseModel):
    topic_id: str
    topic_title: str
    topic_summary: str
    profile: Optional[ProfileData] = None


class TopicQARequest(BaseModel):
    topic_title: str
    topic_summary: str
    question: str
    profile: Optional[ProfileData] = None
