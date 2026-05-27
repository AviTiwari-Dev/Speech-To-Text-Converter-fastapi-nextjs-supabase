"use client";

import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-white border-b px-4 md:px-6 flex items-center relative">
      {/* Desktop Title */}

      <h1 className="hidden md:block text-2xl font-bold">
        Speech To Text Convertor
      </h1>

      {/* Mobile Title */}

      <h1 className="block md:hidden text-lg font-bold absolute left-1/2 -translate-x-1/2">
        STT Convertor
      </h1>

      {/* Right Side */}

      <div className="ml-auto">
        {!user ? (
          <button
            onClick={() => (window.location.href = "/login")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl font-semibold transition"
          >
            Login
          </button>
        ) : (
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl font-semibold transition"
          >
            Sign Out
          </button>
        )}
      </div>
    </header>
  );
}
