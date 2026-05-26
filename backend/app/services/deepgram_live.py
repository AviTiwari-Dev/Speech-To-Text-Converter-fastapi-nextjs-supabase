import os
import json
import asyncio
import websockets

DEEPGRAM_WS_URL = "wss://api.deepgram.com/v1/listen"


async def start_deepgram(websocket):

    deepgram_socket = await websockets.connect(
        DEEPGRAM_WS_URL,
        additional_headers={
            "Authorization": f"Token {os.getenv('DEEPGRAM_API_KEY')}"
        },
    )

    async def receive_from_frontend():

        try:

            while True:

                data = await websocket.receive_bytes()

                await deepgram_socket.send(data)

        except:

            await deepgram_socket.close()

    async def send_to_frontend():

        try:

            async for message in deepgram_socket:

                data = json.loads(message)

                if "channel" in data:

                    transcript = data["channel"]["alternatives"][0][
                        "transcript"
                    ]

                    if transcript:

                        await websocket.send_text(transcript)

        except:

            pass

    await asyncio.gather(receive_from_frontend(), send_to_frontend())
