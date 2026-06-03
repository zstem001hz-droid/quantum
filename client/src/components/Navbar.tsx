import { Link, useNavigate } from "react-router-dom";
import QuantumLogo from "./animations/QuantumLogo";
import ThemeSwitcher from "./ThemeSwitcher";
import useAuth from "../hooks/useAuth";

// Top navigation bar — logo, theme switcher, user avatar, and sign out
const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials =
    user?.name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ?? "?";

  return (
    <nav className="bg-quantum-surface border-b border-quantum-border px-4 py-2">
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <QuantumLogo size={36} />
          <span className="text-quantum-text font-bold text-lg">Quantum</span>
        </Link>
        <ThemeSwitcher />
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-quantum-accent to-purple-600 flex items-center justify-center text-white text-xs font-bold">
            {initials}
          </div>
          <button
            onClick={handleLogout}
            className="text-quantum-light-muted dark:text-quantum-muted hover:text-quantum-crimson text-sm transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
