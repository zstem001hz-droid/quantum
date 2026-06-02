import useTheme from '../hooks/useTheme';

type Theme = 'light' | 'system' | 'dark';

const options: { value: Theme; label: string }[] = [
  { value: 'light', label: '☀ Light' },
  { value: 'system', label: '⊙ System' },
  { value: 'dark', label: '◑ Dark' },
];

// Three-way toggle matching the wireframe design
const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="inline-flex items-center gap-0.5 bg-quantum-surface2 border border-quantum-border rounded-full p-0.5">
      {options.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            theme === value
              ? 'bg-quantum-accent text-white'
              : 'text-quantum-gold hover:text-quantum-text'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default ThemeSwitcher;