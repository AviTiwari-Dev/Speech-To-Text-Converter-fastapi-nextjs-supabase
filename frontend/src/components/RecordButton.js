"use client";

import { useEffect, useRef, useState } from "react";

import RecordRTC from "recordrtc";

import { useChat } from "@/context/ChatContext";

const fakeWords = [
  "hello",
  "this",
  "is",
  "a",
  "live",
  "streaming",
  "transcript",
  "generated",
  "while",
  "recording",
  "audio",
  "message",
];

export default function TranscriptSection() {
  const { activeChat, addMessage } = useChat();

  const scrollRef = useRef(null);

  const recorderRef = useRef(null);

  const streamRef = useRef(null);

  const intervalRef = useRef(null);

  const currentTextRef = useRef("");

  const messageIdRef = useRef(null);

  const [recording, setRecording] = useState(false);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [activeChat]);

  async function startRecording() {
    if (!activeChat) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      streamRef.current = stream;

      const recorder = new RecordRTC(stream, {
        type: "audio",
        mimeType: "audio/wav",
      });

      recorder.startRecording();

      recorderRef.current = recorder;

      const messageId = Date.now();

      messageIdRef.current = messageId;

      const newMessage = {
        id: messageId,
        text: "",
        audio: null,
        live: true,
      };

      addMessage(newMessage);

      currentTextRef.current = "";

      intervalRef.current = setInterval(() => {
        const randomWord =
          fakeWords[Math.floor(Math.random() * fakeWords.length)];

        currentTextRef.current += randomWord + " ";

        activeChat.messages = activeChat.messages.map((msg) =>
          msg.id === messageId
            ? {
                ...msg,
                text: currentTextRef.current,
              }
            : msg,
        );
      }, 700);

      setRecording(true);
    } catch (error) {
      console.error(error);
    }
  }

  function stopRecording() {
    clearInterval(intervalRef.current);

    recorderRef.current?.stopRecording(() => {
      const blob = recorderRef.current.getBlob();

      const audioUrl = URL.createObjectURL(blob);

      activeChat.messages = activeChat.messages.map((msg) =>
        msg.id === messageIdRef.current
          ? {
              ...msg,
              audio: audioUrl,
              live: false,
            }
          : msg,
      );

      streamRef.current?.getTracks().forEach((track) => track.stop());
    });

    setRecording(false);
  }

  if (!activeChat) {
    return (
      <section
        className="
          flex-1
          bg-gray-50
          rounded-3xl
          border
          flex
          items-center
          justify-center
        "
      >
        <div className="text-center">
          <h2
            className="
              text-3xl
              font-bold
              text-gray-400
            "
          >
            No Chats Yet
          </h2>

          <p
            className="
              text-gray-500
              mt-3
            "
          >
            Create a new chat to start recording.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      className="
        bg-gray-50
        rounded-3xl
        shadow-sm
        border
        flex-1
        overflow-hidden
        flex
        flex-col
      "
    >
      <div
        className="
          p-5
          border-b
          bg-white
        "
      >
        <h2
          className="
            text-2xl
            font-bold
          "
        >
          {activeChat.title}
        </h2>
      </div>

      <div
        className="
          flex-1
          overflow-y-auto
          p-5
          space-y-8
        "
      >
        {activeChat.messages.map((message) => (
          <div
            key={message.id}
            className="
                flex
                flex-col
                gap-3
              "
          >
            {/* Transcript */}

            <div
              className="
                  self-start
                  max-w-[75%]
                  bg-white
                  rounded-3xl
                  px-5
                  py-4
                  border
                  shadow-sm
                "
            >
              <div
                className="
                    text-[16px]
                    leading-8
                    whitespace-pre-wrap
                  "
              >
                {message.text}

                {message.live && (
                  <span
                    className="
                        inline-block
                        ml-2
                        animate-pulse
                        text-indigo-500
                      "
                  >
                    ●
                  </span>
                )}
              </div>
            </div>

            {/* Audio */}

            <div
              className="
                  self-end
                  bg-indigo-600
                  rounded-2xl
                  p-3
                  shadow-sm
                "
            >
              {message.audio ? (
                <audio
                  controls
                  className="
                      h-10
                      w-[240px]
                    "
                >
                  <source src={message.audio} type="audio/wav" />
                </audio>
              ) : (
                <div
                  className="
                      flex
                      items-center
                      gap-3
                      text-white
                    "
                >
                  <span>Recording...</span>

                  <div
                    className="
                        w-10
                        h-10
                        rounded-full
                        bg-white/20
                        flex
                        items-center
                        justify-center
                        animate-pulse
                      "
                  >
                    🎤
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        <div ref={scrollRef} />
      </div>

      {/* Record Button */}

      <div
        className="
          p-5
          border-t
          bg-white
        "
      >
        <button
          onClick={recording ? stopRecording : startRecording}
          className={`
            w-full
            py-4
            rounded-2xl
            text-lg
            font-semibold
            transition
            text-white

            ${
              recording
                ? "bg-red-500 hover:bg-red-600"
                : "bg-indigo-600 hover:bg-indigo-700"
            }
          `}
        >
          {recording ? "Stop Recording" : "Start Recording"}
        </button>
      </div>
    </section>
  );
}
