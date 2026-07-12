import { FiAlertCircle } from "react-icons/fi";

export default function EmptyState({ icon: Icon = FiAlertCircle, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center mb-4">
        <Icon size={28} className="text-[var(--color-text-secondary)]" />
      </div>
      <h3 className="text-white font-semibold text-lg mb-1">{title}</h3>
      {description && (
        <p className="text-[var(--color-text-secondary)] text-sm max-w-md">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
