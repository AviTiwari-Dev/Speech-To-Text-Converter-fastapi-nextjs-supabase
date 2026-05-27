"use client";
import { getTempUserId } from "@/utils/tempUser";
import { createContext, useContext, useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [chats, setChats] = useState([]);

  const [activeChat, setActiveChat] = useState(null);

  /*
  -------------------------
  LOAD CHATS
  -------------------------
  */

  useEffect(() => {
    loadChats();
  }, []);

  async function loadChats() {
    /*
    -------------------------
    FETCH CHATS
    -------------------------
    */

    const { data: chatsData } = await supabase
      .from("chats")
      .select("*")
      .eq("user_id", getTempUserId())
      .order("id", {
        ascending: false,
      });

    /*
    -------------------------
    FETCH MESSAGES
    -------------------------
    */

    const { data: messagesData } = await supabase
      .from("messages")
      .select("*")
      .eq("user_id", getTempUserId());

    /*
    -------------------------
    MERGE
    -------------------------
    */

    const formattedChats = chatsData.map((chat) => ({
      ...chat,

      messages: messagesData.filter((msg) => msg.chat_id === chat.id),
    }));

    setChats(formattedChats);

    if (formattedChats.length > 0) {
      setActiveChat(formattedChats[0]);
    }
  }

  /*
  -------------------------
  CREATE CHAT
  -------------------------
  */

  async function createChat() {
    const newChat = {
      id: Date.now(),

      title: `Chat ${chats.length + 1}`,

      user_id: getTempUserId(),

      messages: [],
    };

    /*
  -------------------------
  SAVE CHAT TO SUPABASE
  -------------------------
  */

    await supabase.from("chats").insert([
      {
        id: newChat.id,

        title: newChat.title,

        user_id: newChat.user_id,
      },
    ]);

    /*
  -------------------------
  UPDATE UI
  -------------------------
  */

    setChats((prev) => [newChat, ...prev]);

    setActiveChat(newChat);
  }

  /*
  -------------------------
  DELETE CHAT
  -------------------------
  */

  async function deleteChat(chatId) {
    await supabase.from("chats").delete().eq("id", chatId);

    const updatedChats = chats.filter((chat) => chat.id !== chatId);

    setChats(updatedChats);

    if (activeChat?.id === chatId) {
      setActiveChat(updatedChats[0] || null);
    }
  }

  /*
  -------------------------
  ADD MESSAGE
  -------------------------
  */

  async function addMessage(message) {
    setChats((prevChats) =>
      prevChats.map((chat) => {
        if (chat.id !== activeChat?.id) {
          return chat;
        }

        return {
          ...chat,

          messages: [...chat.messages, message],
        };
      }),
    );

    await supabase.from("messages").insert([
      {
        ...message,

        chat_id: activeChat.id,

        user_id: getTempUserId(),
      },
    ]);
  }

  return (
    <ChatContext.Provider
      value={{
        chats,
        setChats,

        activeChat,
        setActiveChat,

        createChat,
        deleteChat,
        addMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  return useContext(ChatContext);
}
