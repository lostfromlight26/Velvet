import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Search,
  Bell,
  Settings,
  User,
  X,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  LogOut,
} from "lucide-react";

import Magnet from "./ui/Magnet";
import { useSearchHistoryStore } from "../store/searchHistoryStore";
import { useToastStore } from "../store/toastStore";

export default function TopBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [query, setQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(2);

  const { addSearch } = useSearchHistoryStore();
  const { showToast } = useToastStore();

  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const isSearchRoute = location.pathname === "/search";

  useEffect(() => {
    if (isSearchRoute) {
      setQuery(searchParams.get("q") || "");
    }
  }, [location.search, isSearchRoute, searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    addSearch(query.trim());
    if (location.pathname !== "/search") {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      setSearchParams({ q: query.trim() });
    }
  };

  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (location.pathname === "/search") {
      debounceTimeoutRef.current = setTimeout(() => {
        if (val.trim()) {
          setSearchParams({ q: val.trim() });
        } else {
          setSearchParams({});
        }
      }, 250);
    }
  };

  const handleClear = () => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    setQuery("");
    if (location.pathname === "/search") {
      setSearchParams({});
    }
  };

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target as Node)
      ) {
        setShowNotifications(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-black/50 px-8 py-3.5 backdrop-blur-2xl transition-all">
      {/* Left: Navigation Controls & Home */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => navigate(-1)}
            title="Go Back"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900/80 text-zinc-300 transition hover:bg-white/10 hover:text-white border border-white/5"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => navigate(1)}
            title="Go Forward"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900/80 text-zinc-300 transition hover:bg-white/10 hover:text-white border border-white/5"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <Magnet strength={0.2}>
          <button
            onClick={() => navigate("/")}
            title="Home"
            className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
              location.pathname === "/"
                ? "bg-violet-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                : "bg-zinc-900/80 text-zinc-300 hover:bg-white/10 hover:text-white border border-white/5"
            }`}
          >
            <Home size={19} />
          </button>
        </Magnet>

        {/* Search Bar Input */}
        <form onSubmit={handleSearchSubmit} className="relative ml-2 w-72 sm:w-80 md:w-96">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="What do you want to play?"
            value={query}
            onChange={handleInputChange}
            onFocus={() => {
              if (!isSearchRoute) navigate("/search");
            }}
            className="
              w-full
              rounded-full
              border
              border-white/10
              bg-zinc-900/80
              py-2.5
              pl-10
              pr-10
              text-xs
              font-medium
              text-white
              placeholder-zinc-400
              shadow-inner
              backdrop-blur-md
              transition-all
              focus:border-violet-500/60
              focus:bg-zinc-800/90
              focus:outline-none
              focus:ring-2
              focus:ring-violet-500/30
            "
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </form>
      </div>

      {/* Right: Notifications, Settings & User Profile Avatar */}
      <div className="flex items-center gap-3">
        {/* Notifications Button */}
        <div ref={notificationRef} className="relative">
          <Magnet strength={0.25}>
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setUnreadNotifications(0);
              }}
              title="Notifications"
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/5 bg-zinc-900/80 text-zinc-300 transition hover:bg-white/10 hover:text-white"
            >
              <Bell size={19} />
              {unreadNotifications > 0 && (
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-violet-500 text-[10px] font-bold text-white shadow-[0_0_10px_rgba(168,85,247,0.8)]">
                  {unreadNotifications}
                </span>
              )}
            </button>
          </Magnet>

          {showNotifications && (
            <div className="absolute right-0 top-12 z-50 w-80 rounded-3xl border border-white/10 bg-zinc-900/95 p-4 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  <Sparkles size={16} className="text-violet-400" />
                  What's New
                </h4>
                <span className="text-[10px] uppercase font-bold text-violet-400 bg-violet-500/20 px-2 py-0.5 rounded-full">
                  Updates
                </span>
              </div>
              <div className="mt-3 space-y-3">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                  <p className="text-xs font-semibold text-white">✨ Task 4 UI Redesign Active</p>
                  <p className="text-[11px] text-zinc-400 mt-1">
                    Velvet desktop redesign with Spotify-inspired UX & React Bits components.
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                  <p className="text-xs font-semibold text-white">🎶 Equalizer & Waveform</p>
                  <p className="text-[11px] text-zinc-400 mt-1">
                    Playing tracks now display animated equalizer waves.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Settings Shortcut Button */}
        <Magnet strength={0.25}>
          <button
            onClick={() => navigate("/settings")}
            title="Settings"
            className={`flex h-10 w-10 items-center justify-center rounded-full border border-white/5 transition-all ${
              location.pathname === "/settings"
                ? "bg-violet-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                : "bg-zinc-900/80 text-zinc-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Settings size={19} />
          </button>
        </Magnet>

        {/* User Profile Avatar with Magnet Effect */}
        <div ref={profileRef} className="relative">
          <Magnet strength={0.3}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 rounded-full border border-violet-500/30 bg-gradient-to-r from-violet-500/20 to-purple-600/20 p-1 pr-3 transition hover:border-violet-500/60 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]"
            >
              <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-violet-500 font-bold text-white shadow-md">
                <User size={16} />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-zinc-900" />
              </div>
              <span className="text-xs font-bold text-zinc-200">Velvet User</span>
            </button>
          </Magnet>

          {showProfileMenu && (
            <div className="absolute right-0 top-12 z-50 w-56 rounded-3xl border border-white/10 bg-zinc-900/95 p-2 shadow-2xl backdrop-blur-xl">
              <div className="px-3 py-2 border-b border-white/10 mb-1">
                <p className="text-xs font-bold text-white">Velvet Account</p>
                <p className="text-[11px] text-zinc-400">user@velvet.app</p>
              </div>

              <button
                onClick={() => {
                  navigate("/settings");
                  setShowProfileMenu(false);
                }}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold text-zinc-200 hover:bg-violet-500/20 hover:text-white"
              >
                <ShieldCheck size={16} className="text-violet-400" />
                Account Settings
              </button>

              <button
                onClick={() => {
                  showToast("Velvet Premium is unlocked!", "info");
                  setShowProfileMenu(false);
                }}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold text-zinc-200 hover:bg-violet-500/20 hover:text-white"
              >
                <ExternalLink size={16} className="text-violet-400" />
                Upgrade to Premium
              </button>

              <div className="my-1 border-t border-white/10" />

              <button
                onClick={() => {
                  showToast("Signed out", "info");
                  setShowProfileMenu(false);
                }}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold text-red-400 hover:bg-red-500/20"
              >
                <LogOut size={16} />
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
