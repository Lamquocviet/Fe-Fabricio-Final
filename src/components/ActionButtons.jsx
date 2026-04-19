export default function ActionButtons() {
  return (
    <div className="space-y-4 mt-12">
      <button className="w-full bg-red-600 hover:bg-red-700 transition-all py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-3">
        Buy Now 
      </button>

      <button className="w-full border capitalize border-zinc-700 hover:bg-zinc-900 transition-all py-5 rounded-2xl font-medium text-lg">
        Add to favorites
      </button>

      <button className="w-full border border-zinc-700 hover:bg-zinc-900 transition-all py-5 rounded-2xl font-medium text-lg">
        Play Demo
      </button>
    </div>
  );
}