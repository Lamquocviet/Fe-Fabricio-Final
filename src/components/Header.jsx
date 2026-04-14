// components/layout/Header.jsx
import { Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

const pages = [
  "Home", "Games", "Posts", "Submit Game"
];
const Header = ({ onOpenSidebar }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#1a1a2e]  backdrop-blur-xl">
      <div className="flex h-18 w-full items-center justify-around px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-orange-400 font-bold text-white shadow-lg shadow-red-500/30">
            G
          </div>
          <span className="text-2xl font-bold text-white">GameStore</span>
        </div>

        {/* Search */}
        <div className="hidden w-full max-w-md px-8 lg:block">
          <div className="flex  items-center gap-3  rounded-full border border-white/10 bg-white/[0.03] p-6 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500/20">
            <Search className="h-5 w-5 text-zinc-400 size-4" />

            <input
              type="text"
              placeholder="Search games, tags, creators..."
              className="h-10 w-full bg-transparent px-3 text-white outline-none pl-6"
            />
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-4 lg:flex">
          {pages.map((item, i) => (
            <Button
              key={item}
              className={`h-11 min-w-[120px] px-6 shrink-0 whitespace-nowrap rounded-full text-base font-semibold transition-all duration-300 ${
                i === 0
                  ? "bg-gradient-to-r from-red-500 to-orange-400 text-white shadow-lg shadow-red-500/25"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {item}
            </Button>
          ))}
        </div>
        <button className="text-zinc-400 transition hover:text-white ">
          Login
        </button>
        {/* Mobile */}
        <Button
          onClick={onOpenSidebar}
          className="rounded-xl p-2 text-white lg:hidden"
        >
          <Menu />
        </Button>
      </div>
    </header>
  );
};

export default Header;
