"use client";

import { useEffect, useRef, useState } from "react";

import { getTempUserId } from "@/utils/tempUser";

import { useChat } from "@/context/ChatContext";

import { useAuth } from "@/context/AuthContext";

export default function TranscriptSection({ showSidebar, setShowSidebar }) {
  const { chats, activeChat, setChats } = useChat();

  const { user } = useAuth();

  const audioContextRef = useRef(null);

  const processorRef = useRef(null);

  const sourceRef = useRef(null);

  const scrollRef = useRef(null);

  const mediaRecorderRef = useRef(null);

  const websocketRef = useRef(null);

  const streamRef = useRef(null);

  const messageIdRef = useRef(null);

  const transcriptRef = useRef("");
  const [recording, setRecording] = useState(false);

  const currentChat =
    chats.find((chat) => chat.id === activeChat?.id) || activeChat;

  useEffect(() => {
    scrollRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [currentChat]);

  async function startRecording() {
    /*
    -------------------------
    OPTIONAL LOGIN CHECK
    -------------------------
    */

    if (!user) {
      alert("Please login first");
      return;
    }

    if (!currentChat || recording) {
      return;
    }

    try {
      /*
      -------------------------
      CONNECT WS
      -------------------------
      */

      const ws = new WebSocket("ws://localhost:8000/listen");

      websocketRef.current = ws;

      ws.onopen = async () => {
        /*
        -------------------------
        MICROPHONE
        -------------------------
        */

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        streamRef.current = stream;

        /*
        -------------------------
        CREATE MESSAGE
        -------------------------
        */

        const messageId = Date.now();

        messageIdRef.current = messageId;

        const newMessage = {
          id: messageId,

          text: "",

          audio: null,

          audio_path: null,

          live: true,
        };

        setChats((prevChats) =>
          prevChats.map((chat) => {
            if (chat.id !== currentChat.id) {
              return chat;
            }

            return {
              ...chat,

              messages: [...chat.messages, newMessage],
            };
          }),
        );

        /*
        -------------------------
        MEDIA RECORDER
        -------------------------
        */

        const mediaRecorder = new MediaRecorder(stream);

        mediaRecorderRef.current = mediaRecorder;

        const audioChunks = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunks.push(event.data);
          }
        };

        /*
        -------------------------
        STOP RECORDING
        -------------------------
        */

        mediaRecorder.onstop = async () => {
          try {
            /*
              -------------------------
              CREATE AUDIO BLOB
              -------------------------
              */

            const audioBlob = new Blob(audioChunks, {
              type: "audio/webm",
            });

            /*
              -------------------------
              GET FINAL TRANSCRIPT
              -------------------------
              */

            /*
              -------------------------
              FORM DATA
              -------------------------
              */

            const formData = new FormData();

            formData.append("file", audioBlob, "audio.webm");

            formData.append("user_id", getTempUserId());

            formData.append("chat_id", currentChat.id);

            formData.append("message_id", messageId);

            formData.append("transcript", transcriptRef.current);

            /*
              -------------------------
              UPLOAD TO BACKEND
              -------------------------
              */

            const response = await fetch("http://localhost:8000/upload-audio", {
              method: "POST",

              body: formData,
            });

            const data = await response.json();

            console.log(data);

            /*
              -------------------------
              UPDATE UI
              -------------------------
              */

            setChats((prevChats) =>
              prevChats.map((chat) => {
                if (chat.id !== currentChat.id) {
                  return chat;
                }

                return {
                  ...chat,

                  messages: chat.messages.map((msg) =>
                    msg.id === messageId
                      ? {
                          ...msg,

                          audio: data.audio_url,

                          audio_path: data.audio_path,

                          live: false,
                        }
                      : msg,
                  ),
                };
              }),
            );
          } catch (error) {
            console.error(error);
          }
        };

        mediaRecorder.start();

        /*
        -------------------------
        AUDIO PROCESSING
        -------------------------
        */

        const audioContext = new AudioContext({
          sampleRate: 16000,
        });

        audioContextRef.current = audioContext;

        const source = audioContext.createMediaStreamSource(stream);

        sourceRef.current = source;

        const processor = audioContext.createScriptProcessor(4096, 1, 1);

        processorRef.current = processor;

        source.connect(processor);

        processor.connect(audioContext.destination);

        processor.onaudioprocess = (event) => {
          const inputData = event.inputBuffer.getChannelData(0);

          const pcmData = convertFloat32ToInt16(inputData);

          if (ws.readyState === 1) {
            ws.send(pcmData);
          }
        };

        setRecording(true);
      };

      /*
      -------------------------
      RECEIVE TRANSCRIPT
      -------------------------
      */

      ws.onmessage = (event) => {
        setChats((prevChats) =>
          prevChats.map((chat) => {
            if (chat.id !== currentChat.id) {
              return chat;
            }

            return {
              ...chat,

              messages: chat.messages.map((msg) => {
                if (msg.id !== messageIdRef.current) {
                  return msg;
                }

                const updatedText = (msg.text || "") + " " + event.data;

                transcriptRef.current = updatedText;

                return {
                  ...msg,

                  text: updatedText,
                };
              }),
            };
          }),
        );
      };
    } catch (error) {
      console.error(error);
    }
  }

  function convertFloat32ToInt16(buffer) {
    let l = buffer.length;

    const buf = new Int16Array(l);

    while (l--) {
      buf[l] = Math.min(1, buffer[l]) * 0x7fff;
    }

    return buf.buffer;
  }

  function stopRecording() {
    websocketRef.current?.close();

    mediaRecorderRef.current?.stop();

    processorRef.current?.disconnect();

    sourceRef.current?.disconnect();

    audioContextRef.current?.close();

    streamRef.current?.getTracks().forEach((track) => track.stop());

    setRecording(false);
  }

  if (!currentChat) {
    return (
      <section
        className={`
          flex-1
          bg-gray-50
          rounded-3xl
          shadow-sm
          border
          overflow-hidden
          ${showSidebar ? "hidden md:flex" : "flex"}
          items-center
          justify-center
        `}
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-400">No Chats Yet</h2>

          <p className="text-gray-500 mt-3">
            Create a new chat to start recording.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`
        bg-gray-50
        rounded-3xl
        shadow-sm
        border
        flex-1
        overflow-hidden
        flex
        flex-col
        ${showSidebar ? "hidden md:flex" : "flex"}
      `}
    >
      <div className="p-5 border-b bg-white flex items-center">
        <button
          onClick={() => setShowSidebar(true)}
          className="md:hidden text-2xl mr-4"
        >
          ←
        </button>

        <h2 className="text-2xl font-bold">{currentChat.title}</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-8">
        {currentChat.messages.map((message) => (
          <div key={message.id} className="flex flex-col gap-3">
            <div className="self-start max-w-[75%] bg-white rounded-3xl px-5 py-4 border shadow-sm">
              <div className="text-[16px] leading-8 whitespace-pre-wrap">
                {message.text}

                {message.live && (
                  <span className="inline-block ml-2 animate-pulse text-indigo-500">
                    ●
                  </span>
                )}
              </div>
            </div>

            {(message.live || message.audio) && (
              <div className="self-end bg-indigo-600 rounded-2xl p-3 shadow-sm">
                {message.live ? (
                  <div className="flex items-center gap-3 text-white">
                    <span>Recording...</span>

                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
                      🎤
                    </div>
                  </div>
                ) : (
                  <audio controls className="h-10 w-[240px]">
                    <source src={message.audio} type="audio/webm" />
                  </audio>
                )}
              </div>
            )}
          </div>
        ))}

        <div ref={scrollRef} />
      </div>

      <div className="p-5 border-t bg-white">
        <button
          disabled={!user}
          onClick={recording ? stopRecording : startRecording}
          className={`w-full py-4 rounded-2xl text-lg font-semibold transition text-white ${
            !user
              ? "bg-gray-400 cursor-not-allowed"
              : recording
                ? "bg-red-500 hover:bg-red-600"
                : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {!user
            ? "Login To Record"
            : recording
              ? "Stop Recording"
              : "Start Recording"}
        </button>
      </div>
    </section>
  );
}
