import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { FiArrowLeft, FiLoader, FiPlus, FiX } from "react-icons/fi";
import toast from "react-hot-toast";

export default function MovieForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    overview: "",
    releaseYear: new Date().getFullYear(),
    genres: [],
    runtime: "",
    posterUrl: "",
  });
  const [genreInput, setGenreInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    const fetchMovie = async () => {
      try {
        const { data } = await api.get(`/movies/${id}`);
        const m = data.data.movie;
        setForm({
          title: m.title,
          overview: m.overview || "",
          releaseYear: m.releaseYear,
          genres: m.genres || [],
          runtime: m.runtime || "",
          posterUrl: m.posterUrl || "",
        });
      } catch {
        toast.error("Movie not found");
        navigate("/movies");
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id, isEdit, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!form.releaseYear) {
      toast.error("Release year is required");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: form.title.trim(),
        overview: form.overview.trim() || undefined,
        releaseYear: Number(form.releaseYear),
        genres: form.genres.length > 0 ? form.genres : undefined,
        runtime: form.runtime ? Number(form.runtime) : undefined,
        posterUrl: form.posterUrl.trim() || undefined,
      };

      if (isEdit) {
        await api.put(`/movies/${id}`, payload);
        toast.success("Movie updated");
      } else {
        await api.post("/movies", payload);
        toast.success("Movie created");
      }
      navigate("/movies");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to save movie");
    } finally {
      setSubmitting(false);
    }
  };

  const addGenre = () => {
    const g = genreInput.trim();
    if (g && !form.genres.includes(g)) {
      setForm((f) => ({ ...f, genres: [...f.genres, g] }));
      setGenreInput("");
    }
  };

  const removeGenre = (genre) => {
    setForm((f) => ({ ...f, genres: f.genres.filter((g) => g !== genre) }));
  };

  const handleGenreKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addGenre();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const currentYear = new Date().getFullYear();
  const years = [];
  for (let y = currentYear; y >= 1900; y--) years.push(y);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-[var(--color-text-secondary)] hover:text-white transition-colors text-sm"
      >
        <FiArrowLeft size={16} />
        Back
      </button>

      <div>
        <h1 className="text-2xl font-bold text-white">
          {isEdit ? "Edit Movie" : "Add New Movie"}
        </h1>
        <p className="text-[var(--color-text-secondary)] text-sm mt-0.5">
          {isEdit ? "Update movie details" : "Fill in the details to add a movie"}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 space-y-5"
      >
        <div>
          <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
            Title *
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="Movie title"
            className="w-full px-4 py-2.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl text-white text-sm placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
            Overview
          </label>
          <textarea
            value={form.overview}
            onChange={(e) => setForm((f) => ({ ...f, overview: e.target.value }))}
            placeholder="What is this movie about?"
            rows={4}
            className="w-full px-4 py-2.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl text-white text-sm placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
              Release Year *
            </label>
            <select
              value={form.releaseYear}
              onChange={(e) => setForm((f) => ({ ...f, releaseYear: e.target.value }))}
              className="w-full px-4 py-2.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none cursor-pointer"
            >
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
              Runtime (minutes)
            </label>
            <input
              type="number"
              min="1"
              value={form.runtime}
              onChange={(e) => setForm((f) => ({ ...f, runtime: e.target.value }))}
              placeholder="e.g. 120"
              className="w-full px-4 py-2.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl text-white text-sm placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
            Poster URL
          </label>
          <input
            type="url"
            value={form.posterUrl}
            onChange={(e) => setForm((f) => ({ ...f, posterUrl: e.target.value }))}
            placeholder="https://image.tmdb.org/t/p/w500/path.jpg"
            className="w-full px-4 py-2.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl text-white text-sm placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
          />
          {form.posterUrl && (
            <div className="mt-3">
              <p className="text-xs text-[var(--color-text-secondary)] mb-2">Preview:</p>
              <div className="w-32 aspect-[2/3] rounded-lg overflow-hidden bg-[var(--color-surface-hover)] border border-[var(--color-border)]">
                <img
                  src={form.posterUrl}
                  alt="Poster preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                  onLoad={(e) => {
                    e.target.style.display = "block";
                    e.target.nextSibling.style.display = "none";
                  }}
                />
                <div className="w-full h-full items-center justify-center text-red-400 text-xs hidden">
                  URL tidak valid
                </div>
              </div>
            </div>
          )}
          <p className="text-xs text-[var(--color-text-secondary)] mt-1.5">
            Gunakan direct image URL, contoh: https://image.tmdb.org/t/p/w500/xxxx.jpg
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
            Genres
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={genreInput}
              onChange={(e) => setGenreInput(e.target.value)}
              onKeyDown={handleGenreKeyDown}
              placeholder="Type genre and press Enter"
              className="flex-1 px-4 py-2.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl text-white text-sm placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
            />
            <button
              type="button"
              onClick={addGenre}
              className="px-4 py-2.5 bg-[var(--color-surface-hover)] hover:bg-indigo-600/30 border border-[var(--color-border)] rounded-xl text-[var(--color-text-secondary)] hover:text-white transition-colors text-sm"
            >
              <FiPlus size={16} />
            </button>
          </div>
          {form.genres.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {form.genres.map((genre) => (
                <span
                  key={genre}
                  className="flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-600/20 text-indigo-400 text-xs font-medium"
                >
                  {genre}
                  <button
                    type="button"
                    onClick={() => removeGenre(genre)}
                    className="hover:text-white transition-colors"
                  >
                    <FiX size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 py-2.5 rounded-xl bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-white transition-colors text-sm font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
          >
            {submitting ? (
              <>
                <FiLoader className="animate-spin" size={16} />
                Saving...
              </>
            ) : (
              isEdit ? "Update Movie" : "Create Movie"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
