export const WATCHLIST_STATUSES = [
  { value: "PLANNED", label: "Planned", color: "bg-blue-500/20 text-blue-400" },
  { value: "WATCHING", label: "Watching", color: "bg-yellow-500/20 text-yellow-400" },
  { value: "COMPLETED", label: "Completed", color: "bg-green-500/20 text-green-400" },
  { value: "DROPPED", label: "Dropped", color: "bg-red-500/20 text-red-400" },
];

export const getStatusConfig = (status) => {
  return (
    WATCHLIST_STATUSES.find((s) => s.value === status) || WATCHLIST_STATUSES[0]
  );
};
