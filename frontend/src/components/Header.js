import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-black text-white shadow-md">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Speech To Text</h1>

        <nav className="flex gap-6">
          <Link href="/" className="hover:text-gray-300">
            Home
          </Link>

          <Link href="/history" className="hover:text-gray-300">
            History
          </Link>
        </nav>
      </div>
    </header>
  );
}
