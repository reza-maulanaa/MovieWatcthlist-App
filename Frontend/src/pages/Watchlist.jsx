import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import WatchlistItem from "../components/WatchlistItem.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import Modal from "../components/Modal.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { FiList, FiPlus, FiLoader } from "react-icons/fi";
import { WATCHLIST_STATUSES } from "../utils/constants.js";
import toast from "react-hot-toast";

export default function Watchlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({ status: "", rating: "", notes: "" });
  const [saving, setSaving] = useState(false);

  const fetchWatchlist = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (activeFilter) params.status = activeFilter;
      const { data } = await api.get("/watchlist", { params });
      setItems(data.data.items);
    } catch {
      toast.error("Failed to load watchlist");
    } finally {
      setLoading(false);
    }
  }, [activeFilter]);

  useEffect(() => {
    fetchWatchlist();
  }, [fetchWatchlist]);

  const handleRemove = async (itemId) => {
    if (!confirm("Remove from watchlist?")) return;
    try {
      await api.delete(`/watchlist/${itemId}`);
      setItems((prev) => prev.filter((item) => item.id !== itemId));
      toast.success("Removed from watchlist");
    } catch {
      toast.error("Failed to remove");
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setEditForm({
      status: item.status,
      rating: item.rating || "",
      notes: item.notes || "",
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingItem) return;
    setSaving(true);
    try {
      const payload = {
        status: editForm.status,
        rating: editForm.rating ? Number(editForm.rating) : null,
        notes: editForm.notes || null,
      };
      await api.put(`/watchlist/${editingItem.id}`, payload);
      toast.success("Updated");
      setEditingItem(null);
      fetchWatchlist();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update");
    } finally {
      setSaving(false);
    }
  };

  const statusCounts = items.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">My Watchlist</h1>
          <p className="text-[var(--color-text-secondary)] text-sm mt-0.5">
            {items.length} {items.length === 1 ? "movie" : "movies"} tracked
          </p>
        </div>
        <Link
          to="/movies"
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors text-sm"
        >
          <FiPlus size={16} />
          Browse Movies
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveFilter("")}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
            activeFilter === ""
              ? "bg-white/10 text-white border-white/20"
              : "bg-transparent text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-current"
          }`}
        >
          All ({items.length})
        </button>
        {WATCHLIST_STATUSES.map((s) => (
          <button
            key={s.value}
            onClick={() => setActiveFilter(activeFilter === s.value ? "" : s.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
              activeFilter === s.value
                ? `${s.color} border-current`
                : "bg-transparent text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-current hover:text-current"
            }`}
          >
            {s.label} ({statusCounts[s.value] || 0})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-4">
              <div className="flex gap-4">
                <div className="w-16 h-24 bg-[var(--color-surface-hover)] rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-[var(--color-surface-hover)] rounded w-1/2" />
                  <div className="h-3 bg-[var(--color-surface-hover)] rounded w-1/3" />
                  <div className="h-3 bg-[var(--color-surface-hover)] rounded w-1/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={FiList}
          title="Your watchlist is empty"
          description="Browse movies and add them to your watchlist to track what you want to watch"
          action={
            <Link
              to="/movies"
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors text-sm"
            >
              <FiPlus size={16} />
              Browse Movies
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map((item) => (
            <WatchlistItem
              key={item.id}
              item={item}
              onEdit={handleEdit}
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={Boolean(editingItem)}
        onClose={() => setEditingItem(null)}
        title="Edit Watchlist Item"
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
              Status
            </label>
            <div className="flex flex-wrap gap-2">
              {WATCHLIST_STATUSES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setEditForm((f) => ({ ...f, status: s.value }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                    editForm.status === s.value
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
              Rating (1-10)
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={editForm.rating}
              onChange={(e) => setEditForm((f) => ({ ...f, rating: e.target.value }))}
              placeholder="No rating"
              className="w-full px-4 py-2.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl text-white text-sm placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
              Notes
            </label>
            <textarea
              value={editForm.notes}
              onChange={(e) => setEditForm((f) => ({ ...f, notes: e.target.value }))}
              placeholder="Your thoughts..."
              rows={3}
              className="w-full px-4 py-2.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl text-white text-sm placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setEditingItem(null)}
              className="flex-1 py-2.5 rounded-xl bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-white transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
            >
              {saving ? (
                <>
                  <FiLoader className="animate-spin" size={16} />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
