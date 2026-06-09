import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import VerifyTwoFactorPage from "./pages/VerifyTwoFactorPage";
import SettingsPage from "./pages/SettingsPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes - no authentication required */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* 2FA verification - reached after password auth when 2FA is enabled */}
          <Route path="/verify-2fa" element={<VerifyTwoFactorPage />} />

          {/* Protected routes - require valid JWT  */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-quantum-light-bg dark:bg-quantum-bg overflow-x-hidden">
                  <Navbar />
                  <DashboardPage />
                </div>
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/projects/:id"
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-quantum-light-bg dark:bg-quantum-bg">
                  <Navbar />
                  <ProjectDetailPage />
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-quantum-light-bg dark:bg-quantum-bg overflow-x-hidden">
                  <Navbar />
                  <SettingsPage />
                </div>
              </ProtectedRoute>
            }
          />

          {/* Fallback - redirect unknown routes to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
