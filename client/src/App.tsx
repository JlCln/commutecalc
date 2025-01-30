import { BrowserRouter, Route, Routes } from "react-router-dom";
import logo from "./assets/logo_1.png";
import ProtectedRoute from "./components/ProtectedRoute";
import WelcomePage from "./components/WelcomePage";
import { AuthProvider } from "./contexts/AuthContext";
import { StatsProvider } from "./contexts/StatsContext";
import Dashboard from "./pages/Dashboard";

import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <div className="logo-container">
          <img src={logo} alt="Commute Planner Logo" className="app-logo" />
          <h1 className="app-title">Commute Calc'</h1>
        </div>
      </header>
      <AuthProvider>
        <StatsProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<WelcomePage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </StatsProvider>
      </AuthProvider>
      <footer className="app-footer">
        Made with ❤️ by{" "}
        <a
          href="https://github.com/NebulaJ"
          target="_blank"
          rel="noopener noreferrer"
        >
          NebulaJ
        </a>{" "}
        @ WCS 2024-2025
      </footer>
    </div>
  );
}

export default App;
