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

const navItems = ["Profile", "Dashboard", "Admin", "Spotlight", "Upload Game"];

const Sidebar = () => {
  return (
    <aside className="w-71.25 shrink-0 pt-3">
      <div className="sticky top-0 rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] px-6 py-7 shadow-[0_10px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl">
        {/* DISCOVER */}
        <section>
          <p className="mb-5 text-[13px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
            Discover
          </p>

          <nav className="space-y-2.5">
            {navItems.map((label, i) => (
              <button
                key={label}
                className={[
                  "flex w-full items-center rounded-full px-4 py-3 text-left text-[15px] transition",
                  i === 0
                    ? "bg-white/[0.06] text-zinc-100"
                    : "text-zinc-400 hover:bg-white/[0.04] hover:text-white",
                ].join(" ")}>
                {label}
              </button>
            ))}
          </nav>
        </section>

        {/* POPULAR TAGS */}
        <section className="mt-10">
          <p className="mb-5 text-[13px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
            Popular Tags
          </p>

          <div className="flex flex-wrap gap-3">
            {tags.map((tag) => (
              <button
                key={tag}
                className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[14px] text-zinc-300 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white">
                {tag}
              </button>
            ))}
          </div>
        </section>

        {/* COMMUNITY PULSE */}
        <section className="mt-12">
          <p className="mb-5 text-[13px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
            Community Pulse
          </p>

          <div className="space-y-4">
            <div className="rounded-[24px] border border-white/10 bg-white/[0.03] px-7 py-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
              <p className="text-[15px] text-zinc-400">Live players</p>
              <p className="mt-5 text-[20px] font-bold text-white">125K</p>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-white/[0.03] px-7 py-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
              <p className="text-[15px] text-zinc-400">New posts today</p>
              <p className="mt-5 text-[20px] font-bold text-white">36</p>
            </div>
          </div>
        </section>
      </div>
    </aside>
  );
};

export default Sidebar;
