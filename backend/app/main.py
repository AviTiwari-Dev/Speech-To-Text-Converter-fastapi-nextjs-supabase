from fastapi import FastAPI

from fastapi.middleware.cors import (
    CORSMiddleware,
)
from app.routes.upload import (
    router as upload_router,
)

from app.websocket import router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
app.include_router(
    upload_router,
)


@app.get("/")
def home():

    return {"message": "Backend Running"}
