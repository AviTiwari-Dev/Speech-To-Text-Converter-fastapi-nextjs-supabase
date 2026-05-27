export default function AudioSection() {
  return (
    <section
      className="
      bg-white
      rounded-3xl
      shadow-sm
      border
      p-5
    "
    >
      <h2
        className="
        text-xl
        font-semibold
        mb-4
      "
      >
        Audio
      </h2>

      <div
        className="
        h-16
        flex
        items-center
        justify-center
        rounded-2xl
        bg-gray-100
        text-gray-400
      "
      >
        No audio recorded yet
      </div>
    </section>
  );
}
