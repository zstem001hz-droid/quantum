import useTheme from "../hooks/useTheme";

type Theme = "light" | "system" | "dark";

const options: { value: Theme; label: string; icon: string }[] = [
  { value: "light", label: "Light", icon: "☀" },
  { value: "system", label: "System", icon: "⊙" },
  { value: "dark", label: "Dark", icon: "◑" },
];

// Three-way toggle matching the wireframe design
const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="inline-flex items-center gap-0.5 bg-quantum-surface2 border border-quantum-border rounded-full p-0.5">
      {options.map(({ value, label, icon }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={`px-1.5 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-medium transition-colors ${
            theme === value
              ? "bg-quantum-accent text-white"
              : "text-quantum-gold hover:text-quantum-text"
          }`}
        >
          <span className="hidden md:inline">
            {icon} {label}
          </span>
          <span className="md:hidden">{icon}</span>
        </button>
      ))}
    </div>
  );
};

export default ThemeSwitcher;
