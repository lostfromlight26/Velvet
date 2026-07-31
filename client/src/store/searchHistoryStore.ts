import { create } from "zustand";

const STORAGE_KEY = "velvet_search_history";

function getInitialHistory(): string[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    return [];
  }
}

interface SearchHistoryStore {
  history: string[];
  addSearch: (query: string) => void;
  removeSearch: (query: string) => void;
  clearHistory: () => void;
}

export const useSearchHistoryStore = create<SearchHistoryStore>((set, get) => ({
  history: getInitialHistory(),

  addSearch(query) {
    const trimmed = query.trim();
    if (!trimmed) return;

    const current = get().history;
    const filtered = current.filter(
      (item) => item.toLowerCase() !== trimmed.toLowerCase()
    );
    const updated = [trimmed, ...filtered].slice(0, 10);

    set({ history: updated });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to save search history", err);
    }
  },

  removeSearch(query) {
    const updated = get().history.filter(
      (item) => item.toLowerCase() !== query.toLowerCase()
    );
    set({ history: updated });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to update search history", err);
    }
  },

  clearHistory() {
    set({ history: [] });
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error("Failed to clear search history", err);
    }
  },
}));
