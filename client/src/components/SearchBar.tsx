import { Search } from "lucide-react";

interface SearchBarProps {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  onSearch: () => void;
  loading: boolean;
}

function SearchBar({
  query,
  setQuery,
  onSearch,
  loading,
}: SearchBarProps) {
  return (
    <div className="mb-10">
      <div className="relative w-full">
        <Search
          size={22}
          className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400"
        />

        <input
          type="text"
          placeholder="Search for artists, songs, or podcasts"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSearch();
            }
          }}
          className="
            w-full
            rounded-2xl
            border
            border-violet-500/40
            bg-gradient-to-r
            from-zinc-700/70
            via-zinc-600/50
            to-zinc-700/70
            py-4
            pl-14
            pr-36
            text-white
            placeholder:text-zinc-400
            outline-none
            transition-all
            duration-300
            focus:border-violet-400
            focus:ring-2
            focus:ring-violet-500/40
            shadow-[0_0_20px_rgba(139,92,246,0.25)]
          "
        />

        <button
          onClick={onSearch}
          disabled={loading}
          className="
            absolute
            right-3
            top-1/2
            -translate-y-1/2
            rounded-xl
            bg-violet-500
            px-5
            py-2.5
            font-medium
            transition
            hover:bg-violet-400
            disabled:opacity-50
          "
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>
    </div>
  );
}

export default SearchBar;