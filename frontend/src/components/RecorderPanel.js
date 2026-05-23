"use client";

import { useState } from "react";

export default function RecorderPanel() {
  const [isRecording, setIsRecording] = useState(false);

  function startRecording() {
    setIsRecording(true);
  }

  function stopRecording() {
    setIsRecording(false);
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-semibold mb-6">Recorder</h2>

      <div className="flex gap-4">
        <button
          onClick={startRecording}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl"
        >
          Start Recording
        </button>

        <button
          onClick={stopRecording}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl"
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
    </div>
  );
}
