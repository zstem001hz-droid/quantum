interface ErrorMessageProps {
  message: string;
  retryLabel?: string;
  onRetry?: () => void;
}

// Inline error state with optional retry action
const ErrorMessage = ({ message, retryLabel, onRetry }: ErrorMessageProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <p className="text-red-400 text-sm text-center">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="text-quantum-accent text-sm hover:underline">
          {retryLabel ?? "Try again"}
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
