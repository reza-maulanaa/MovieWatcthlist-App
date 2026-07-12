export default function LoadingGrid({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[2/3] bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)]" />
          <div className="mt-2 space-y-2">
            <div className="h-4 bg-[var(--color-surface)] rounded w-3/4" />
            <div className="h-3 bg-[var(--color-surface)] rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
