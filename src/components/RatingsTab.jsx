import { Star } from 'lucide-react';

export default function RatingsTab() {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 md:p-10">

      <p className="text-zinc-400 mb-8">Set a local star rating to preview UI interactions.</p>

      <div className="flex items-center gap-3 text-4xl text-amber-400">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="fill-current cursor-pointer hover:scale-110 transition" />
        ))}
      </div>
      <p className="mt-4 text-2xl font-semibold">5/5</p>
    </div>
  );
}