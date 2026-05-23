import Header from "@/components/Header";

export default function HistoryPage() {
  const transcripts = [
    {
      id: 1,
      text: "This is my first transcript.",
    },
    {
      id: 2,
      text: "Speech to text application demo.",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-100">
      <Header />

      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-8">Transcript History</h1>

        <div className="space-y-4">
          {transcripts.map((item) => (
            <div key={item.id} className="bg-white p-5 rounded-2xl shadow">
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
