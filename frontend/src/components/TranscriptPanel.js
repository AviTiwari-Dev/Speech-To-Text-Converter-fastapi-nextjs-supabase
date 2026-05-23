"use client";

import { useTranscript } from "@/context/TranscriptContext";

export default function TranscriptPanel() {
  const { transcript } = useTranscript();

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 min-h-[300px]">
      <h2 className="text-2xl font-semibold mb-6">Transcript</h2>

      <div className="bg-gray-100 rounded-xl p-4 min-h-[220px]">
        {transcript ? (
          <p className="text-gray-800 leading-7">{transcript}</p>
        ) : (
          <p className="text-gray-400">Your transcript will appear here...</p>
        )}
      </div>
    </div>
  );
}
