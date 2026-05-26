import requests
import os

DEEPGRAM_URL = "https://api.deepgram.com/v1/listen"


def transcribe_audio(file_path):

    api_key = os.getenv("DEEPGRAM_API_KEY")

    headers = {"Authorization": f"Token {api_key}", "Content-Type": "audio/wav"}

    with open(file_path, "rb") as audio:

        response = requests.post(DEEPGRAM_URL, headers=headers, data=audio)

    result = response.json()

    try:

        transcript = result["results"]["channels"][0]["alternatives"][0][
            "transcript"
        ]

        return transcript

    except:

        return ""
