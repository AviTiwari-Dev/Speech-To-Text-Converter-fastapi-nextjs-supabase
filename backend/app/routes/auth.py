from fastapi import APIRouter

from pydantic import BaseModel

from app.supabase_client import supabase

router = APIRouter()


class AuthRequest(BaseModel):

    email: str
    password: str


"""
-------------------------
SIGNUP
-------------------------
"""


@router.post("/signup")
async def signup(data: AuthRequest):

    try:

        response = supabase.auth.sign_up(
            {
                "email": data.email,
                "password": data.password,
            }
        )

        return {
            "user": response.user,
            "session": response.session,
        }

    except Exception as e:

        return {
            "error": str(e),
        }


"""
-------------------------
LOGIN
-------------------------
"""


@router.post("/login")
async def login(data: AuthRequest):

    try:

        response = supabase.auth.sign_in_with_password(
            {
                "email": data.email,
                "password": data.password,
            }
        )

        return {
            "user": response.user,
            "session": response.session,
        }

    except Exception as e:

        return {
            "error": str(e),
        }
