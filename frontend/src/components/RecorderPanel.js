"use client";

import axios from "axios";

import RecordRTC from "recordrtc";

import { useRef, useState } from "react";

import { useTranscript } from "@/context/TranscriptContext";

export default function RecorderPanel() {
  const [isRecording, setIsRecording] = useState(false);

  const [audioURL, setAudioURL] = useState("");

  const recorderRef = useRef(null);

  const socketRef = useRef(null);

  const streamRef = useRef(null);

  const { transcript, setTranscript } = useTranscript();

  async function startRecording() {
    try {
      const RecordRTC = (await import("recordrtc")).default;

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      streamRef.current = stream;

      const socket = new WebSocket("ws://127.0.0.1:8000/listen");

      socketRef.current = socket;

      socket.onmessage = (event) => {
        setTranscript(event.data);
      };

      const recorder = new RecordRTC(stream, {
        type: "audio",
        mimeType: "audio/webm",

        timeSlice: 1000,

        ondataavailable: async (blob) => {
          if (socket.readyState === 1) {
            socket.send(blob);
          }
        },
      });

      recorderRef.current = recorder;

      recorder.startRecording();

      setIsRecording(true);
    } catch (error) {
      console.error(error);

      alert("Microphone permission denied");
    }
  }

  async function stopRecording() {
    recorderRef.current.stopRecording(() => {
      const audioBlob = recorderRef.current.getBlob();

      const audioUrl = URL.createObjectURL(audioBlob);

      setAudioURL(audioUrl);

      socketRef.current?.close();

      streamRef.current?.getTracks().forEach((track) => track.stop());
    });

    setIsRecording(false);
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-semibold mb-6">Recorder</h2>

      <div className="flex gap-4">
        <button
          onClick={startRecording}
          disabled={isRecording}
          className="
            bg-green-500
            hover:bg-green-600
            text-white
            px-6
            py-3
            rounded-xl
            disabled:bg-gray-400
          "
        >
          Start Recording
        </button>

        <button
          onClick={stopRecording}
          disabled={!isRecording}
          className="
            bg-red-500
            hover:bg-red-600
            text-white
            px-6
            py-3
            rounded-xl
            disabled:bg-gray-400
          "
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

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Live Transcript</h2>

        <div
          className="
          bg-gray-100
          rounded-xl
          p-4
          min-h-[150px]
        "
        >
          {transcript || (
            <p className="text-gray-400">Live transcript appears here...</p>
          )}
        </div>
      </div>
    </div>
  );
}
