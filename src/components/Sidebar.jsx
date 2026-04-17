import { Link, NavLink } from "react-router-dom";
import { X } from "lucide-react";

const mainNavItems = [
  { label: "Home", path: "/" },
  { label: "Games", path: "/games" },
  { label: "Posts", path: "/posts" },
  { label: "Submit Game", path: "/submit-game" },
  { label: "Login", path: "/login" },
];

const discoverItems = [
  { label: "Profile", path: "/profile" },
  { label: "Dashboard", path: "/dashboard" },
  { label: "Admin", path: "/admin" },
  { label: "Spotlight", path: "/spotlight" },
  { label: "Upload Game", path: "/submit-game" },
];

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

const navClass = ({ isActive }) =>
  [
    "flex w-full items-center rounded-full px-4 py-3 text-left text-[15px] transition",
    isActive
      ? "bg-white/6 text-zinc-100"
      : "text-zinc-400 hover:bg-white/4 hover:text-white",
  ].join(" ");

const SidebarContent = ({ onClose }) => (
  <div className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] px-6 py-7 shadow-[0_10px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl">
    <div className="mb-4 flex items-center justify-between lg:hidden">
      <p className="text-sm font-semibold uppercase tracking-[0.12em] text-zinc-400">
        Menu
      </p>
      <button
        onClick={onClose}
        className="rounded-full p-2 text-zinc-300 hover:bg-white/10 hover:text-white">
        <X className="h-5 w-5" />
      </button>
    </div>

    <section className="lg:hidden">
      <p className="mb-5 text-[13px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
        Navigation
      </p>

      <nav className="space-y-2.5">
        {mainNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            onClick={onClose}
            className={navClass}>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </section>

    <section className="mt-10 lg:mt-0">
      <p className="mb-5 text-[13px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
        Discover
      </p>

      <nav className="space-y-2.5">
        {discoverItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={navClass}>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </section>

    <section className="mt-10">
      <p className="mb-5 text-[13px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
        Popular Tags
      </p>

      <div className="flex flex-wrap gap-3">
        {tags.map((tag) => (
          <Link
            key={tag}
            to={`/games?tag=${encodeURIComponent(tag)}`}
            onClick={onClose}
            className="rounded-full border border-white/10 bg-white/3 px-4 py-2 text-[14px] text-zinc-300 transition hover:border-white/20 hover:bg-white/6 hover:text-white">
            {tag}
          </Link>
        ))}
      </div>
    </section>

    <section className="mt-12">
      <p className="mb-5 text-[13px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
        Community Pulse
      </p>

      <div className="space-y-4">
        <div className="rounded-3xl border border-white/10 bg-white/3 px-7 py-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
          <p className="text-[15px] text-zinc-400">Live players</p>
          <p className="mt-5 text-[20px] font-bold text-white">125K</p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/3 px-7 py-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
          <p className="text-[15px] text-zinc-400">New posts today</p>
          <p className="mt-5 text-[20px] font-bold text-white">36</p>
        </div>
      </div>
    </section>
  </div>
);

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      <aside className="ms-5 me-5 hidden w-[285px] shrink-0 lg:block">
        <div className="sticky top-24">
          <SidebarContent />
        </div>
      </aside>

      <div
        className={[
          "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition lg:hidden",
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        ].join(" ")}
        onClick={onClose}>
        <aside
          className={[
            "h-full w-[85vw] max-w-[340px] overflow-y-auto bg-[#050505] p-4 transition-transform",
            isOpen ? "translate-x-0" : "-translate-x-full",
          ].join(" ")}
          onClick={(e) => e.stopPropagation()}>
          <SidebarContent onClose={onClose} />
        </aside>
      </div>
    </>
  );
};

export default Sidebar;
