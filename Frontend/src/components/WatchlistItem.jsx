import StatusBadge from "./StatusBadge.jsx";
import { FiStar, FiEdit2, FiTrash2, FiMessageSquare } from "react-icons/fi";

export default function WatchlistItem({ item, onEdit, onRemove }) {
  const movie = item.movie;

  return (
    <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4 hover:border-[var(--color-border)] transition-all">
      <div className="flex gap-4">
        <div className="w-16 h-24 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-700 flex-shrink-0 flex items-center justify-center overflow-hidden">
          {movie?.posterUrl ? (
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          ) : (
            <span className="text-white/30 text-2xl font-bold">
              {movie?.title?.[0] || "?"}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-sm truncate">
            {movie?.title || "Unknown Movie"}
          </h3>
          <p className="text-[var(--color-text-secondary)] text-xs mt-0.5">
            {movie?.releaseYear} {movie?.runtime ? `\u00B7 ${movie.runtime} min` : ""}
          </p>

          <div className="flex items-center gap-2 mt-2">
            <StatusBadge status={item.status} />
            {item.rating && (
              <span className="flex items-center gap-0.5 text-yellow-400 text-xs">
                <FiStar size={12} fill="currentColor" />
                {item.rating}/10
              </span>
            )}
          </div>

          {item.notes && (
            <p className="flex items-center gap-1 text-[var(--color-text-secondary)] text-xs mt-2 line-clamp-2">
              <FiMessageSquare size={11} className="flex-shrink-0" />
              {item.notes}
            </p>
          )}

          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={() => onEdit(item)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] hover:text-white hover:bg-indigo-600/30 transition-colors text-xs"
            >
              <FiEdit2 size={12} />
              Edit
            </button>
            <button
              onClick={() => onRemove(item.id)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] hover:text-red-400 hover:bg-red-600/10 transition-colors text-xs"
            >
              <FiTrash2 size={12} />
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
