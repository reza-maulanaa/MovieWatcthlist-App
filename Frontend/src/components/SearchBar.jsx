import { FiSearch, FiLoader } from "react-icons/fi";

export default function SearchBar({ value, onChange, placeholder, loading }) {
  return (
    <div className="relative">
      <FiSearch
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Search movies..."}
        className="w-full pl-10 pr-10 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-white text-sm placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
      />
      {loading && (
        <FiLoader
          size={16}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-400 animate-spin"
        />
      )}
    </div>
  );
}
