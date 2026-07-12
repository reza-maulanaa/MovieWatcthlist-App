import { getStatusConfig } from "../utils/constants.js";

export default function StatusBadge({ status, onClick, active }) {
  const config = getStatusConfig(status);

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all border ${
          active
            ? `${config.color} border-current`
            : "bg-transparent text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-current hover:text-current"
        }`}
      >
        {config.label}
      </button>
    );
  }

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${config.color}`}>
      {config.label}
    </span>
  );
}
