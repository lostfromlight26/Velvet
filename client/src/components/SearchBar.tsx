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
    <div
      style={{
        marginBottom: "30px",
      }}
    >
      <input
        type="text"
        placeholder="Search any song..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          padding: "10px",
          width: "320px",
          marginRight: "10px",
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSearch();
          }
        }}
      />

      <button
        onClick={onSearch}
        disabled={loading}
      >
        {loading ? "Searching..." : "Search"}
      </button>
    </div>
  );
}

export default SearchBar;