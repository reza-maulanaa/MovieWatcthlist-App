import { Link } from "react-router-dom";
import { FiStar, FiClock } from "react-icons/fi";

const PLACEHOLDER_COLORS = [
  "from-indigo-600 to-purple-700",
  "from-emerald-600 to-teal-700",
  "from-orange-600 to-red-700",
  "from-blue-600 to-cyan-700",
  "from-pink-600 to-rose-700",
];

function getColorFromTitle(title) {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PLACEHOLDER_COLORS[Math.abs(hash) % PLACEHOLDER_COLORS.length];
}

export default function MovieCard({ movie, showWatchlistStatus, watchlistItem }) {
  const gradientClass = getColorFromTitle(movie.title);

  return (
    <Link
      to={`/movies/${movie.id}`}
      className="group block bg-[var(--color-surface)] rounded-xl overflow-hidden border border-[var(--color-border)] hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300"
    >
      <div className={`aspect-[2/3] bg-gradient-to-br ${gradientClass} relative overflow-hidden`}>
        {movie.posterUrl ? (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-white/30 text-6xl font-bold">{movie.title[0]}</span>
          </div>
        )}
        {showWatchlistStatus && watchlistItem && (
          <div className="absolute top-2 right-2">
            <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-black/60 backdrop-blur-sm text-white">
              {watchlistItem.status}
            </span>
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-white font-semibold text-sm truncate group-hover:text-indigo-400 transition-colors">
          {movie.title}
        </h3>
        <div className="flex items-center gap-3 mt-1.5 text-[var(--color-text-secondary)] text-xs">
          <span className="flex items-center gap-1">
            <FiClock size={12} />
            {movie.releaseYear}
          </span>
          {movie.runtime && (
            <span>{movie.runtime} min</span>
          )}
        </div>
        {movie.genres?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {movie.genres.slice(0, 3).map((genre) => (
              <span
                key={genre}
                className="px-2 py-0.5 rounded-full bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] text-[10px]"
              >
                {genre}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
