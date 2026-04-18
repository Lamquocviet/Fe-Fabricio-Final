export default function DescriptionTab({ game }) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 md:p-10">
      <h2 className="text-3xl font-bold mb-6 !text-white">Game Overview</h2>
      <p className="text-zinc-300 leading-relaxed text-lg">
        Cozy Circuit combines cute builder vibes with thoughtful puzzle chains. 
        Each level asks you to restore power, decorate districts, and help a 
        soft-spoken robot cast thrive.
      </p>

      {/* Có thể thêm nhiều đoạn mô tả hơn */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-3 text-white">Key Features</h3>
          <ul className="space-y-3 text-zinc-400">
            <li>• Turn-based strategic gameplay</li>
            <li>• Beautiful hand-drawn art style</li>
            <li>• Deep character progression</li>
            <li>• Multiple endings</li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-3 text-white">About the Game</h3>
          <p className="text-zinc-400">
            Skyfarer Tactics is a fantasy strategy game where every decision matters.
            Build your team, master elemental tactics, and uncover the secrets of the sky realms.
          </p>
        </div>
      </div>
    </div>
  );
}