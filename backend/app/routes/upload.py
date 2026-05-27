from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Form,
)

from app.supabase_client import (
    supabase,
)

router = APIRouter()


@router.post("/upload-audio")
async def upload_audio(
    file: UploadFile = File(...),
    user_id: str = Form(...),
    chat_id: str = Form(...),
    message_id: str = Form(...),
    transcript: str = Form(...),
):
    """
    -------------------------
    FILE PATH
    -------------------------
    """

    file_path = f"{user_id}/" f"{chat_id}/" f"{message_id}.webm"

    """
    -------------------------
    READ FILE
    -------------------------
    """

    file_bytes = await file.read()

    """
    -------------------------
    UPLOAD AUDIO
    -------------------------
    """

    supabase.storage.from_("audio-files").upload(
        file_path,
        file_bytes,
        {
            "content-type": "audio/webm",
        },
    )

    """
    -------------------------
    SIGNED URL
    -------------------------
    """

    signed = supabase.storage.from_("audio-files").create_signed_url(
        file_path,
        60 * 60 * 24 * 365,
    )

    audio_url = signed["signedURL"]

    """
    -------------------------
    SAVE MESSAGE
    -------------------------
    """

    try:

        result = (
            supabase.table("messages")
            .insert(
                {
                    "id": int(message_id),
                    "text": transcript,
                    "audio": audio_url,
                    "audio_path": file_path,
                    "live": False,
                    "chat_id": int(chat_id),
                    "user_id": user_id,
                }
            )
            .execute()
        )

        print(
            "MESSAGE SAVED:",
            result,
        )

    except Exception as e:

        print(
            "SAVE ERROR:",
            str(e),
        )

    """
    -------------------------
    RESPONSE
    -------------------------
    """

    return {
        "audio_url": audio_url,
        "audio_path": file_path,
    }
