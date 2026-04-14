import { User, LayoutGrid, PenLine, Star, Upload } from "lucide-react";

const tags = [
  "Racing",
  "Arcade",
  "Cyberpunk",
  "RPG",
  "Adventure",
  "Story",
  "Puzzle",
  "Cozy",
];
const navItems = [
  { icon: User, label: "Profile" },
  { icon: LayoutGrid, label: "Dashboard" },
  { icon: PenLine, label: "Admin" },
  { icon: Star, label: "Spotlight" },
  { icon: Upload, label: "Upload Game" },
];

const Sidebar = () => {
  return (
    <div className="w-56 h-screen bg-[#1a1a2e] rounded-2xl p-5 flex flex-col text-sm">
      {/* DISCOVER */}
      <div className="flex flex-col flex-1">
        <p className="text-xl font-medium tracking-widest text-gray-500 mb-2">
          DISCOVER
        </p>
        <nav className="flex flex-col justify-around flex-1">
          {navItems.map(({ icon: Icon, label }, i) => (
            <button
              key={label}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-left w-full transition-colors
                ${
                  i === 0
                    ? "text-white font-medium [&>svg]:text-purple-400"
                    : "text-gray-400 hover:bg-white/10 hover:text-white [&>svg]:text-gray-600 hover:[&>svg]:text-purple-400"
                }`}
            >
              <Icon size={20} />
              {label}
            </button>
          ))}
        </nav>
      </div>

      <hr className="border-white/10 my-2" />

      {/* POPULAR TAGS */}
      <div className="flex flex-col flex-1 gap-y-4">
        <p className="text-xl font-medium tracking-widest text-gray-500">
          POPULAR TAGS
        </p>

        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="h-6 w-fit inline-flex items-center rounded-full border border-gray-600 px-4 py-2.5 text-[12px] cursor-pointer text-gray-300 transition-colors hover:border-purple-400 hover:text-purple-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <hr className="border-white/10 my-2" />

      {/* COMMUNITY PULSE  */}
      <div className="flex flex-col flex-1">
        <p className="text-xl font-medium tracking-widest text-gray-500 mb-5">
          COMMUNITY PULSE
        </p>
        <div className="flex flex-col flex-1 justify-center gap-4">
          <div className="bg-[#252538] rounded-xl p-4">
            <p className="mb-1 flex items-center justify-center gap-2 text-xs text-zinc-400">
              <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              Live players
            </p>
            <p className="text-2xl font-bold text-white">125K</p>
          </div>
          <div className="bg-[#252538] rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">New posts today</p>
            <p className="text-2xl font-bold text-white">36</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
