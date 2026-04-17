import { Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, NavLink } from "react-router-dom";

const pages = [
  { label: "Home", path: "/" },
  { label: "Games", path: "/games" },
  { label: "Posts", path: "/posts" },
  { label: "Submit Game", path: "/submit-game" },
];

const Header = ({ onOpenSidebar }) => {
  return (
    <header className="sticky top-0 z-50 mb-5 w-full border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <div className="flex h-16 w-full items-center gap-4 px-4 lg:h-21.5 lg:px-8">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-br from-[#ff6a5c] to-[#ff5a3d] text-lg font-bold text-white shadow-[0_0_30px_rgba(255,98,77,0.35)] lg:h-12 lg:w-12 lg:text-xl">
            G
          </div>
          <span className="truncate text-[1.8rem] font-bold tracking-tight text-white lg:text-[2rem]">
            GameStore
          </span>
        </Link>

        <div className="hidden min-w-0 flex-1 lg:block">
          <div className="mx-auto flex h-14 w-full max-w-[980px] items-center rounded-full border border-white/10 bg-white/3 px-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition focus-within:border-white/20">
            <Search className="h-4 w-4 shrink-0 text-zinc-400" />
            <input
              type="text"
              placeholder="Search games, tags, creators..."
              className="ml-4 w-full bg-transparent text-[1.05rem] text-white placeholder:text-zinc-500 outline-none"
            />
          </div>
        </div>

        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          <nav className="flex items-center gap-1">
            {pages.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  [
                    "rounded-full px-5 py-3 text-[1.05rem] font-medium transition",
                    isActive
                      ? "bg-white/10 text-white shadow-[0_0_30px_rgba(255,98,77,0.12)]"
                      : "text-zinc-400 hover:bg-white/5 hover:text-white",
                  ].join(" ")
                }>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <Link
            to="/login"
            className="ml-2 px-3 text-[1.05rem] font-medium text-zinc-300 transition hover:text-white">
            Login
          </Link>

          <Link
            to="/profile"
            className="ml-1 flex items-center gap-3 rounded-[20px] bg-linear-to-r from-[#ff6a5c] to-[#ff5a3d] px-4 py-3 text-white shadow-[0_0_30px_rgba(255,98,77,0.25)] transition hover:brightness-105">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
              alt="nova"
              className="h-10 w-10 rounded-full object-cover ring-2 ring-white/20"
            />
            <span className="text-[1.05rem] font-semibold">nova</span>
          </Link>
        </div>

        <Button
          onClick={onOpenSidebar}
          variant="ghost"
          size="icon"
          className="ml-auto text-white hover:bg-white/10 lg:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
