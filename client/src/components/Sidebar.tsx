import {
  Home,
  Search,
  Library,
  ListMusic,
  Settings,
} from "lucide-react";

import { NavLink } from "react-router-dom";

function Sidebar() {
  const menuItems = [
    {
      icon: Home,
      label: "Home",
      path: "/",
    },
    {
      icon: Search,
      label: "Search",
      path: "/search",
    },
    {
      icon: Library,
      label: "Library",
      path: "/library",
    },
    {
      icon: ListMusic,
      label: "Playlists",
      path: "/playlists",
    },
    {
      icon: Settings,
      label: "Settings",
      path: "/settings",
    },
  ];

  return (
    <aside
      className="
        hidden
        md:flex
        w-72
        flex-col
        border-r
        border-white/10
        bg-white/5
        backdrop-blur-3xl
      "
    >
      <div className="px-8 py-8">
        <h1 className="text-5xl font-bold tracking-tight">
          Velvet
        </h1>
      </div>

      <nav className="mt-6 flex flex-col gap-3 px-4">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.label}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `
                  flex
                  items-center
                  gap-4
                  rounded-2xl
                  px-5
                  py-4
                  transition-all
                  duration-300

                  ${
                    isActive
                      ? "bg-violet-500/20 text-violet-300 shadow-[0_0_30px_rgba(168,85,247,.25)]"
                      : "text-zinc-400 hover:bg-white/5 hover:text-white"
                  }
                `
              }
            >
              <Icon size={22} />

              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="flex-1" />

      <div className="border-t border-white/10 p-5">
        <button
          className="
            w-full
            rounded-2xl
            border
            border-white/10
            bg-white/5
            py-3
            text-zinc-300
            transition

            hover:border-violet-500/50
            hover:text-white
          "
        >
          + New Playlist
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;