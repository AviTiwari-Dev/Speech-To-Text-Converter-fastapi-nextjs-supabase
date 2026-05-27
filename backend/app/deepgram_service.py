from deepgram import (
    DeepgramClient,
    LiveTranscriptionEvents,
    LiveOptions,
)

from app.config import (
    DEEPGRAM_API_KEY,
)

deepgram = DeepgramClient(DEEPGRAM_API_KEY)


async def start_deepgram(
    websocket,
):

    dg_connection = deepgram.listen.asynclive.v("1")

    async def on_message(
        self,
        result,
        **kwargs,
    ):

        sentence = result.channel.alternatives[0].transcript

        if sentence and result.is_final:

            print("Transcript:", sentence)

            await websocket.send_text(sentence)

    dg_connection.on(
        LiveTranscriptionEvents.Transcript,
        on_message,
    )

    options = LiveOptions(
        model="nova-2",
        language="en-US",
        punctuate=True,
        interim_results=True,
        smart_format=True,
        encoding="linear16",
        channels=1,
        sample_rate=16000,
    )

    print("Starting Deepgram...")

    await dg_connection.start(options)

    return dg_connection
