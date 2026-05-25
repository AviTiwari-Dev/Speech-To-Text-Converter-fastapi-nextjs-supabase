"use client";

import axios from "axios";

import { useRef, useState } from "react";

import { useTranscript } from "@/context/TranscriptContext";

export default function RecorderPanel() {
  const [isRecording, setIsRecording] = useState(false);

  const [audioURL, setAudioURL] = useState("");

  const mediaRecorderRef = useRef(null);

  const audioChunksRef = useRef([]);

  const { setTranscript } = useTranscript();

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;

      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });

        const audioUrl = URL.createObjectURL(audioBlob);

        setAudioURL(audioUrl);

        const formData = new FormData();

        formData.append("file", audioBlob, "recording.webm");

        try {
          const response = await axios.post(
            "http://127.0.0.1:8000/transcribe",
            formData,
          );

          setTranscript(response.data.transcript);
        } catch (error) {
          console.error("Upload failed:", error);
        }
      };

      mediaRecorder.start();

      setIsRecording(true);
    } catch (error) {
      console.error(error);

      alert("Microphone permission denied");
    }
  }

  function stopRecording() {
    mediaRecorderRef.current.stop();

    setIsRecording(false);
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-semibold mb-6">Recorder</h2>

      <div className="flex gap-4">
        <button
          onClick={startRecording}
          disabled={isRecording}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl disabled:bg-gray-400"
        >
          Start Recording
        </button>

        <button
          onClick={stopRecording}
          disabled={!isRecording}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl disabled:bg-gray-400"
        >
          Stop Recording
        </button>
      </div>

      <div className="mt-6">
        <p className="text-lg">
          Status:
          <span
            className={`ml-2 font-semibold ${
              isRecording ? "text-green-600" : "text-gray-500"
            }`}
          >
            {isRecording ? "Recording..." : "Idle"}
          </span>
        </p>
      </div>

      {audioURL && (
        <div className="mt-6">
          <audio controls src={audioURL} className="w-full" />
        </div>
      )}
    </div>
  );
}
