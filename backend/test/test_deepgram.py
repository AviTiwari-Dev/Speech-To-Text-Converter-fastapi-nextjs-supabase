from deepgram import (
    DeepgramClient,
    PrerecordedOptions,
)

from dotenv import load_dotenv

import os

load_dotenv()

DEEPGRAM_API_KEY = os.getenv("DEEPGRAM_API_KEY")

deepgram = DeepgramClient(DEEPGRAM_API_KEY)

AUDIO_FILE = "test/sample.weba"


def main():

    with open(
        AUDIO_FILE,
        "rb",
    ) as file:

        buffer_data = file.read()

    payload = {"buffer": buffer_data}

    options = PrerecordedOptions(
        model="nova-2",
        smart_format=True,
        punctuate=True,
        language="en-US",
    )

    print("Sending audio to Deepgram...")

    response = deepgram.listen.prerecorded.v("1").transcribe_file(
        payload,
        options,
    )

    transcript = response.results.channels[0].alternatives[0].transcript

    print("\n")

    print("TRANSCRIPT:")

    print(transcript)


if __name__ == "__main__":
    main()
