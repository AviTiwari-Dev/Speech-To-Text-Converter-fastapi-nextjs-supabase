from fastapi import FastAPI
from fastapi import UploadFile
from fastapi import File

from fastapi.middleware.cors import CORSMiddleware

from dotenv import load_dotenv

from app.services.deepgram_service import transcribe_audio
from app.services.deepgram_live import start_deepgram
from fastapi import WebSocket

import os

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True)


@app.get("/")
def home():

    return {"message": "Speech API Running"}


@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):

    MAX_FILE_SIZE = 10 * 1024 * 1024

    content = await file.read()

    if len(content) > MAX_FILE_SIZE:

        return {"status": "error", "message": "File too large"}

    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        buffer.write(content)

    transcript = transcribe_audio(file_path)

    return {"status": "success", "transcript": transcript}


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):

    await websocket.accept()

    while True:

        data = await websocket.receive_text()

        await websocket.send_text(f"Live Transcript: {data}")


@app.websocket("/listen")
async def websocket_endpoint(websocket: WebSocket):

    await websocket.accept()

    await start_deepgram(websocket)
