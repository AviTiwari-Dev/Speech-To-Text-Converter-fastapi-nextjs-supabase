export default function UserDropdown() {
  return (
    <div className="absolute right-0 top-14 w-60 bg-white rounded-2xl shadow-xl border z-50 overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg">Aman Verma</h2>

        <p className="text-sm text-gray-500">aman@example.com</p>
      </div>

      <div className="flex flex-col">
        <button className="px-4 py-3 hover:bg-gray-100 text-left">
          Profile
        </button>

        <button className="px-4 py-3 hover:bg-gray-100 text-left">
          Settings
        </button>

        <button className="px-4 py-3 hover:bg-red-50 text-red-500 text-left">
          Sign Out
        </button>
      </div>
    </div>
  );
}
