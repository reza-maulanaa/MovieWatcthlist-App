import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Navbar from "./components/Navbar.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import MovieList from "./pages/MovieList.jsx";
import MovieDetail from "./pages/MovieDetail.jsx";
import MovieForm from "./pages/MovieForm.jsx";
import Watchlist from "./pages/Watchlist.jsx";

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/movies" replace />;
  return children;
}

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#1e293b",
            color: "#f8fafc",
            border: "1px solid #334155",
          },
          success: { iconTheme: { primary: "#22c55e", secondary: "#1e293b" } },
          error: { iconTheme: { primary: "#ef4444", secondary: "#1e293b" } },
        }}
      />
      <div className="min-h-screen bg-[var(--color-bg)]">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Routes>
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/movies" element={<ProtectedRoute><MovieList /></ProtectedRoute>} />
            <Route path="/movies/new" element={<ProtectedRoute><MovieForm /></ProtectedRoute>} />
            <Route path="/movies/:id" element={<ProtectedRoute><MovieDetail /></ProtectedRoute>} />
            <Route path="/movies/:id/edit" element={<ProtectedRoute><MovieForm /></ProtectedRoute>} />
            <Route path="/watchlist" element={<ProtectedRoute><Watchlist /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/movies" replace />} />
          </Routes>
        </main>
      </div>
    </>
  );
}
