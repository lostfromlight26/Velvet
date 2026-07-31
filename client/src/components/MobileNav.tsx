import { useLocation, useNavigate } from "react-router-dom";
import { Home, Search, Heart, ListMusic, Settings, Library } from "lucide-react";

export default function MobileNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: "Home", icon: Home, path: "/" },
    { label: "Search", icon: Search, path: "/search" },
    { label: "Library", icon: Library, path: "/library" },
    { label: "Liked", icon: Heart, path: "/liked" },
    { label: "Playlists", icon: ListMusic, path: "/playlists" },
    { label: "Settings", icon: Settings, path: "/settings" },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="
        fixed
        bottom-0
        left-0
        right-0
        z-40
        flex
        md:hidden
        items-center
        justify-around
        border-t
        border-white/10
        bg-black/80
        px-2
        py-2
        backdrop-blur-2xl
        shadow-2xl
      "
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.path === "/"
            ? location.pathname === "/"
            : location.pathname.startsWith(item.path);

        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            aria-label={item.label}
            className={`
              flex
              flex-col
              items-center
              justify-center
              gap-1
              rounded-2xl
              px-3
              py-1.5
              transition-all
              ${
                isActive
                  ? "text-violet-400 font-bold bg-violet-500/10 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                  : "text-zinc-400 hover:text-white"
              }
            `}
          >
            <Icon size={18} />
            <span className="text-[10px]">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
