import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { FiLogOut, FiFilm, FiList, FiMenu, FiX } from "react-icons/fi";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
    setMobileOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-[var(--color-surface)]/80 backdrop-blur-md border-b border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl">
            <FiFilm className="text-indigo-400" size={24} />
            <span className="hidden sm:inline">MovieWatchlist</span>
          </Link>

          {user && (
            <>
              <div className="hidden md:flex items-center gap-6">
                <Link
                  to="/movies"
                  className="flex items-center gap-1.5 text-[var(--color-text-secondary)] hover:text-white transition-colors text-sm font-medium"
                >
                  <FiFilm size={16} />
                  Movies
                </Link>
                <Link
                  to="/watchlist"
                  className="flex items-center gap-1.5 text-[var(--color-text-secondary)] hover:text-white transition-colors text-sm font-medium"
                >
                  <FiList size={16} />
                  My Watchlist
                </Link>
                <span className="text-[var(--color-text-secondary)] text-sm">
                  {user.name || user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-[var(--color-text-secondary)] hover:text-red-400 transition-colors text-sm font-medium"
                >
                  <FiLogOut size={16} />
                  Logout
                </button>
              </div>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden text-[var(--color-text-secondary)] hover:text-white"
              >
                {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </>
          )}
        </div>

        {mobileOpen && user && (
          <div className="md:hidden border-t border-[var(--color-border)] py-4 space-y-3">
            <Link
              to="/movies"
              onClick={() => setMobileOpen(false)}
              className="block px-2 py-2 text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-surface-hover)] rounded-lg text-sm"
            >
              Movies
            </Link>
            <Link
              to="/watchlist"
              onClick={() => setMobileOpen(false)}
              className="block px-2 py-2 text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-surface-hover)] rounded-lg text-sm"
            >
              My Watchlist
            </Link>
            <div className="border-t border-[var(--color-border)] pt-3">
              <div className="px-2 text-[var(--color-text-secondary)] text-sm mb-2">
                {user.name || user.email}
              </div>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-2 py-2 text-red-400 hover:bg-[var(--color-surface-hover)] rounded-lg text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
