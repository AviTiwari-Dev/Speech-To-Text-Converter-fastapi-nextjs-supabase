import Header from "@/components/Header";
import RecorderPanel from "@/components/RecorderPanel";
import TranscriptPanel from "@/components/TranscriptPanel";
import LiveTranscript from "@/components/LiveTranscript";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <Header />

      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecorderPanel />

        <TranscriptPanel />
        <LiveTranscript />
      </div>
    </main>
  );
}
