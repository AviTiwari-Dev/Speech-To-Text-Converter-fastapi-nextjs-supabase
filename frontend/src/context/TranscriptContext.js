"use client";

import { createContext, useContext, useState } from "react";

const TranscriptContext = createContext();

export function TranscriptProvider({ children }) {
  const [transcript, setTranscript] = useState("");

  return (
    <TranscriptContext.Provider
      value={{
        transcript,
        setTranscript,
      }}
    >
      {children}
    </TranscriptContext.Provider>
  );
}

export function useTranscript() {
  return useContext(TranscriptContext);
}
