from fastapi import (
    APIRouter,
    WebSocket,
    WebSocketDisconnect,
)

from app.deepgram_service import (
    start_deepgram,
)

router = APIRouter()


@router.websocket("/listen")
async def websocket_endpoint(
    websocket: WebSocket,
):

    await websocket.accept()

    print("Frontend Connected")

    dg_connection = await start_deepgram(websocket)

    try:

        while True:

            data = await websocket.receive_bytes()

            await dg_connection.send(data)

    except WebSocketDisconnect:

        print("Frontend Disconnected")

        await dg_connection.finish()
