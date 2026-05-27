"use client";

import { useState } from "react";

import Header from "@/components/Header";

import Sidebar from "@/components/Sidebar";

import TranscriptSection from "@/components/TranscriptSection";

export default function HomePage() {
  const [showSidebar, setShowSidebar] = useState(true);

  return (
    <main className="h-screen flex flex-col bg-gray-100">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

        <div className="flex-1 p-3 md:p-6 overflow-hidden flex">
          <TranscriptSection
            showSidebar={showSidebar}
            setShowSidebar={setShowSidebar}
          />
        </div>
      </div>
    </main>
  );
}
