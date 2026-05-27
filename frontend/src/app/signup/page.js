"use client";

import Link from "next/link";

export default function SignupPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-sm border p-8">
        <h1 className="text-3xl font-bold mb-2">Create Account</h1>

        <p className="text-gray-500 mb-8">Start using Speech To Text</p>

        <form className="space-y-5">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full border rounded-2xl px-4 py-3 outline-none"
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full border rounded-2xl px-4 py-3 outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border rounded-2xl px-4 py-3 outline-none"
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-2xl font-semibold"
          >
            Create Account
          </button>
        </form>

        <p className="text-center text-gray-500 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-600 font-semibold">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
