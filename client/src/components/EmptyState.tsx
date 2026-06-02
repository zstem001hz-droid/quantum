interface EmptyStateProps {
  message: string;
  action?: string;
  onAction?: () => void;
}

// Empty state for lists with no data yet
const EmptyState = ({ message, action, onAction }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <p className="text-quantum-muted text-sm text-center">{message}</p>
      {action && onAction && (
        <button
          onClick={onAction}
          className="bg-quantum-accent hover:bg-quantum-accent-hover text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          {action}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
