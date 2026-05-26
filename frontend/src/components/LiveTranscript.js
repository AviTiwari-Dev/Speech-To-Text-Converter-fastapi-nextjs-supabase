"use client";

import { useEffect, useState } from "react";

export default function LiveTranscript() {
  const [transcript, setTranscript] = useState("");

  useEffect(() => {
    const socket = new WebSocket("ws://127.0.0.1:8000/ws");

    socket.onopen = () => {
      console.log("WebSocket Connected");

      socket.send("Hello from frontend");
    };

    socket.onmessage = (event) => {
      setTranscript(event.data);
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
      <h2 className="text-2xl font-semibold mb-4">Live Transcript</h2>

      <p className="text-gray-700">{transcript}</p>
    </div>
  );
}
