export interface HistoryItem {
  id: string;
  tool: string;
  title: string;
  timestamp: number;
  href: string;
}

export const saveHistory = (item: Omit<HistoryItem, "id" | "timestamp">) => {
  if (typeof window === "undefined") return;

  const history = getHistory();
  const newItem: HistoryItem = {
    ...item,
    id: Math.random().toString(36).substring(2, 9),
    timestamp: Date.now(),
  };

  const updatedHistory = [newItem, ...history].slice(0, 50); // Keep last 50
  localStorage.setItem("dailyai_history", JSON.stringify(updatedHistory));
};

export const getHistory = (): HistoryItem[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("dailyai_history");
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch (e) {
    return [];
  }
};

export const clearHistory = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("dailyai_history");
};

export const formatTimeAgo = (timestamp: number): string => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
};
