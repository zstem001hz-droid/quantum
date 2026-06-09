import { useRef, useEffect, type KeyboardEvent, type ClipboardEvent } from "react";

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  onComplete?: (completedValue: string) => void;
  length?: number;
}

// Reusable OTP input — individual digit boxes with auto-advance and paste support
const OTPInput = ({ value, onChange, onComplete, length = 6 }: OTPInputProps) => {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus first input box on mount
  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  // Refocus first input when value is cleared after an error
  useEffect(() => {
    if (value === "") {
      inputs.current[0]?.focus();
    }
  }, [value]);

  const distributeValue = (raw: string) => {
    const cleaned = raw.replace(/\D/g, "").slice(0, length);
    onChange(cleaned);
    const focusIndex = Math.min(cleaned.length, length - 1);
    inputs.current[focusIndex]?.focus();
    if (cleaned.length === length) {
      onComplete?.(cleaned);
    }
  };

  const handleChange = (index: number, digit: string) => {
    // Handle multi-character input from authenticator app auto-fill
    if (digit.length > 1) {
      distributeValue(digit);
      return;
    }
    if (!/^\d*$/.test(digit)) return;
    const newValue = value.slice(0, index) + digit.slice(-1) + value.slice(index + 1);
    const trimmed = newValue.slice(0, length);
    onChange(trimmed);
    if (digit && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }
    if (trimmed.length === length) {
      onComplete?.(trimmed);
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (value[index]) {
        const newValue = value.slice(0, index) + value.slice(index + 1);
        onChange(newValue);
      } else if (index > 0) {
        inputs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    distributeValue(e.clipboardData.getData("text"));
  };

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={6}
          autoComplete={index === 0 ? "one-time-code" : "off"}
          value={value[index] || ""}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className="w-10 h-12 text-center text-quantum-gold text-xl font-bold bg-quantum-light-input dark:bg-quantum-input border border-quantum-light-border dark:border-quantum-border rounded-lg outline-none focus:border-quantum-accent transition-colors"
        />
      ))}
    </div>
  );
};

export default OTPInput;
