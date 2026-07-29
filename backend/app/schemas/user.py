from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr
from app.models.user import UserRole


class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: UserRole = UserRole.STUDENT


class UserCreate(UserBase):
    password: str
    grade: Optional[int] = 10
    language_preference: Optional[str] = "en"  # "en" or "ml"


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    role: str
    user_id: int
    full_name: str


class StudentProfileOut(BaseModel):
    id: int
    grade: int
    board_id: Optional[int]
    language_preference: str
    learning_speed: str

    class Config:
        from_attributes = True


class UserOut(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    student_profile: Optional[StudentProfileOut] = None

    class Config:
        from_attributes = True


class SettingsUpdate(BaseModel):
    language_preference: Optional[str] = None
    learning_speed: Optional[str] = None
    full_name: Optional[str] = None
