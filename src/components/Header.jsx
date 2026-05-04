import { Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import useAuth from "@/contexts/AuthContext";
import useRequireAuth from "@/hooks/useRequireAuth";

const pages = [
  { label: "Home", path: "/" },
  { label: "Games", path: "/games" },
  { label: "Posts", path: "/posts" },
  { label: "Submit Game", path: "/uploadgame", requiresAuth: true },
];

const Header = ({ onOpenSidebar }) => {
  const navigate = useNavigate();
  const { user, handleLogout } = useAuth();
  const { requireAuth } = useRequireAuth();

  const defaultAvatar =
    "https://static.vecteezy.com/system/resources/thumbnails/065/277/981/small_2x/impressive-celebrated-minimalist-geometric-portrait-flat-color-clean-lines-with-scalable-design-png.png";

  const rawAvatarSrc = user?.avatarUrl || user?.avatar;

  const avatarVersion =
    user?.avatarVersion || user?.avatarUpdatedAt || user?.updatedAt || "";

  const avatarSrc = rawAvatarSrc
    ? `${rawAvatarSrc}?v=${avatarVersion}`
    : defaultAvatar;

  const handleNavClick = (event, item) => {
    if (item.requiresAuth && !requireAuth()) {
      event.preventDefault();
    }
  };

  const handleSignOut = async () => {
    navigate("/", { replace: true });

    await handleLogout();

    toast.success("Đăng xuất thành công!");
  };

  return (
    <header className="sticky top-0 z-50 mb-5 w-full border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <div className="flex h-16 w-full items-center gap-4 px-4 lg:h-21.5 lg:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-br from-[#ff6a5c] to-[#ff5a3d] text-lg font-bold text-white shadow-[0_0_30px_rgba(255,98,77,0.35)] lg:h-12 lg:w-12 lg:text-xl">
            F
          </div>

          <span className="truncate text-[1.8rem] font-bold tracking-tight text-white lg:text-[2rem]">
            FabricIO
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
                onClick={(event) => handleNavClick(event, item)}
                className={({ isActive }) =>
                  [
                    "rounded-full px-5 py-3 text-[1.05rem] font-medium transition",
                    isActive
                      ? "bg-white/10 text-white shadow-[0_0_30px_rgba(255,98,77,0.12)]"
                      : "text-zinc-400 hover:bg-white/5 hover:text-white",
                  ].join(" ")
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {!user ? (
            <Link
              to="/signin"
              className="ml-2 px-3 text-[1.05rem] font-medium text-zinc-300 transition hover:text-white"
            >
              Sign In
            </Link>
          ) : (
            <>
              <button
                type="button"
                onClick={handleSignOut}
                className="ml-2 px-3 text-[1.05rem] font-medium text-zinc-300 transition hover:text-white"
              >
                Sign Out
              </button>

              <Link
                to="/profile"
                className="ml-1 flex items-center gap-3 rounded-[20px] bg-linear-to-r from-[#ff6a5c] to-[#ff5a3d] px-4 py-3 text-white shadow-[0_0_30px_rgba(255,98,77,0.25)] transition hover:brightness-105"
              >
                <img
                  src={avatarSrc}
                  alt={user?.username || "user"}
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-white/20"
                />

                <span className="text-[1.05rem] font-semibold">
                  {user?.username || "User"}
                </span>
              </Link>
            </>
          )}
        </div>

        <Button
          onClick={onOpenSidebar}
          variant="ghost"
          size="icon"
          className="ml-auto text-white hover:bg-white/10 lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
