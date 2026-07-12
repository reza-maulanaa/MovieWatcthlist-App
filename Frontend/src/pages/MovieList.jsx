import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import MovieCard from "../components/MovieCard.jsx";
import SearchBar from "../components/SearchBar.jsx";
import LoadingGrid from "../components/LoadingGrid.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { FiPlus, FiFilm, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import toast from "react-hot-toast";

export default function MovieList() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);

  const fetchMovies = useCallback(async (isSearch = false) => {
    if (isSearch) setSearchLoading(true);
    else setLoading(true);

    try {
      const params = { page, limit: 20 };
      if (search) params.search = search;
      if (selectedGenre) params.genre = selectedGenre;
      if (selectedYear) params.year = selectedYear;

      const { data } = await api.get("/movies", { params });
      setMovies(data.data.movies);
      setPagination(data.data.pagination);
    } catch {
      toast.error("Failed to load movies");
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  }, [page, search, selectedGenre, selectedYear]);

  useEffect(() => {
    fetchMovies();
  }, [page, selectedGenre, selectedYear]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const { data } = await api.get("/movies/genres");
        setGenres(data.data.genres);
      } catch {
        // ignore
      }
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, selectedGenre, selectedYear]);

  const handleSearch = (value) => {
    setSearch(value);
  };

  const years = [];
  const currentYear = new Date().getFullYear();
  for (let y = currentYear; y >= 1970; y--) years.push(y);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Movies</h1>
          <p className="text-[var(--color-text-secondary)] text-sm mt-0.5">
            Browse and discover movies
          </p>
        </div>
        <Link
          to="/movies/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors text-sm"
        >
          <FiPlus size={16} />
          Add Movie
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <SearchBar
            value={search}
            onChange={handleSearch}
            placeholder="Search movies..."
            loading={searchLoading}
          />
        </div>
        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="px-4 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none cursor-pointer"
        >
          <option value="">All Genres</option>
          {genres.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="px-4 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none cursor-pointer"
        >
          <option value="">All Years</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <LoadingGrid />
      ) : movies.length === 0 ? (
        <EmptyState
          icon={FiFilm}
          title="No movies found"
          description={search || selectedGenre || selectedYear
            ? "Try adjusting your filters"
            : "Add your first movie to get started"}
          action={
            <Link
              to="/movies/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors text-sm"
            >
              <FiPlus size={16} />
              Add Movie
            </Link>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-white hover:border-indigo-500/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm"
              >
                <FiChevronLeft size={16} />
                Prev
              </button>
              <span className="text-[var(--color-text-secondary)] text-sm">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
                className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-white hover:border-indigo-500/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm"
              >
                Next
                <FiChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
