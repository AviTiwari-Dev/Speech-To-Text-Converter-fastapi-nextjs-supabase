"use client";

import { useChat } from "@/context/ChatContext";

export default function Sidebar({ showSidebar, setShowSidebar }) {
  const { chats, activeChat, setActiveChat, createChat, deleteChat } =
    useChat();

  return (
    <aside
      className={`bg-white border-r overflow-y-auto transition-all md:w-80 w-full ${
        showSidebar ? "flex" : "hidden md:flex"
      } flex-col`}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-2xl font-bold">Chats</h2>

        <button
          onClick={createChat}
          className="w-11 h-11 rounded-full bg-indigo-600 text-white text-2xl flex items-center justify-center"
        >
          +
        </button>
      </div>

      <div className="flex-1 p-3 space-y-3">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`p-4 rounded-2xl cursor-pointer border flex items-center justify-between ${
              activeChat?.id === chat.id
                ? "bg-indigo-100 border-indigo-300"
                : "bg-white"
            }`}
            onClick={() => {
              setActiveChat(chat);

              if (window.innerWidth < 768) {
                setShowSidebar(false);
              }
            }}
          >
            <div>
              <h3 className="font-semibold">{chat.title}</h3>

              <p className="text-sm text-gray-500">
                {chat.messages.length} messages
              </p>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();

                deleteChat(chat.id);
              }}
              className="text-red-500 text-lg"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
}
