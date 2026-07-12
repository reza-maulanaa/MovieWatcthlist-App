import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios.js";
import StatusBadge from "../components/StatusBadge.jsx";
import Modal from "../components/Modal.jsx";
import { FiArrowLeft, FiStar, FiClock, FiEdit2, FiTrash2, FiPlus, FiLoader } from "react-icons/fi";
import { WATCHLIST_STATUSES } from "../utils/constants.js";
import toast from "react-hot-toast";

export default function MovieDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showWatchlistModal, setShowWatchlistModal] = useState(false);
  const [watchlistForm, setWatchlistForm] = useState({ status: "PLANNED", rating: "", notes: "" });
  const [addingToWatchlist, setAddingToWatchlist] = useState(false);
  const [myWatchlistItem, setMyWatchlistItem] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const { data } = await api.get(`/movies/${id}`);
        setMovie(data.data.movie);
        const userItem = data.data.movie.watchListItems?.find(
          (item) => item.userId === user.id
        );
        setMyWatchlistItem(userItem || null);
      } catch {
        toast.error("Movie not found");
        navigate("/movies");
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id, user.id, navigate]);

  const handleDelete = async () => {
    if (!confirm("Delete this movie? This cannot be undone.")) return;
    setDeleting(true);
    try {
      await api.delete(`/movies/${id}`);
      toast.success("Movie deleted");
      navigate("/movies");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  const handleAddToWatchlist = async (e) => {
    e.preventDefault();
    setAddingToWatchlist(true);
    try {
      await api.post("/watchlist", {
        movieId: id,
        status: watchlistForm.status,
        rating: watchlistForm.rating ? Number(watchlistForm.rating) : undefined,
        notes: watchlistForm.notes || undefined,
      });
      toast.success("Added to watchlist");
      setShowWatchlistModal(false);
      setWatchlistForm({ status: "PLANNED", rating: "", notes: "" });
      const { data } = await api.get(`/movies/${id}`);
      const userItem = data.data.movie.watchListItems?.find(
        (item) => item.userId === user.id
      );
      setMyWatchlistItem(userItem || null);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to add to watchlist");
    } finally {
      setAddingToWatchlist(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!movie) return null;

  const isCreator = movie.createdBy === user.id;

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-[var(--color-text-secondary)] hover:text-white transition-colors text-sm"
      >
        <FiArrowLeft size={16} />
        Back
      </button>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="aspect-[2/3] rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-700">
            {movie.posterUrl ? (
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-white/20 text-8xl font-bold">{movie.title[0]}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white">{movie.title}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-3 text-[var(--color-text-secondary)] text-sm">
              <span className="flex items-center gap-1">
                <FiClock size={14} />
                {movie.releaseYear}
              </span>
              {movie.runtime && <span>{movie.runtime} min</span>}
              {movie.creator && <span>by {movie.creator.name}</span>}
            </div>
          </div>

          {movie.genres?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {movie.genres.map((genre) => (
                <span
                  key={genre}
                  className="px-3 py-1 rounded-full bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] text-xs font-medium"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}

          {movie.overview && (
            <div>
              <h2 className="text-sm font-semibold text-white mb-2">Overview</h2>
              <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
                {movie.overview}
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            {myWatchlistItem ? (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
                <StatusBadge status={myWatchlistItem.status} />
                {myWatchlistItem.rating && (
                  <span className="flex items-center gap-0.5 text-yellow-400 text-sm">
                    <FiStar size={14} fill="currentColor" />
                    {myWatchlistItem.rating}/10
                  </span>
                )}
                <span className="text-[var(--color-text-secondary)] text-xs">In your watchlist</span>
              </div>
            ) : (
              <button
                onClick={() => setShowWatchlistModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors text-sm"
              >
                <FiPlus size={16} />
                Add to Watchlist
              </button>
            )}

            {isCreator && (
              <>
                <Link
                  to={`/movies/${id}/edit`}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-white hover:border-indigo-500/50 transition-colors text-sm"
                >
                  <FiEdit2 size={14} />
                  Edit
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-red-400 hover:border-red-500/50 disabled:opacity-50 transition-colors text-sm"
                >
                  {deleting ? <FiLoader className="animate-spin" size={14} /> : <FiTrash2 size={14} />}
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={showWatchlistModal}
        onClose={() => setShowWatchlistModal(false)}
        title="Add to Watchlist"
      >
        <form onSubmit={handleAddToWatchlist} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
              Status
            </label>
            <div className="flex flex-wrap gap-2">
              {WATCHLIST_STATUSES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setWatchlistForm((f) => ({ ...f, status: s.value }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                    watchlistForm.status === s.value
                      ? `${s.color} border-current`
                      : "bg-transparent text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-current"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
              Rating (1-10, optional)
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={watchlistForm.rating}
              onChange={(e) => setWatchlistForm((f) => ({ ...f, rating: e.target.value }))}
              placeholder="Leave empty for no rating"
              className="w-full px-4 py-2.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl text-white text-sm placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
              Notes (optional)
            </label>
            <textarea
              value={watchlistForm.notes}
              onChange={(e) => setWatchlistForm((f) => ({ ...f, notes: e.target.value }))}
              placeholder="Any thoughts about this movie?"
              rows={3}
              className="w-full px-4 py-2.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl text-white text-sm placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={addingToWatchlist}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
          >
            {addingToWatchlist ? (
              <>
                <FiLoader className="animate-spin" size={16} />
                Adding...
              </>
            ) : (
              "Add to Watchlist"
            )}
          </button>
        </form>
      </Modal>
    </div>
  );
}
