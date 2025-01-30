import { useState } from "react";
import Login from "./Login";
import Register from "./Register";

export default function WelcomePage() {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="welcome-page">
      <div className="content">
        <div className="welcome-text">
          <h1>Bienvenue sur Commute Planner</h1>
          <p>
            Trackez votre temps de trajet quotidien et optimisez vos
            déplacements.
          </p>
          <p>
            Planifiez votre trajet, obtenez des statistiques et partagez-les
            avec vos amis.
          </p>
          <p>Authentifiez vous pour débuter !</p>
        </div>

        <div className="auth-container">
          <div className="auth-toggle">
            <button
              type="button"
              className={`toggle-btn ${showLogin ? "active" : ""}`}
              onClick={() => setShowLogin(true)}
            >
              Login
            </button>
            <button
              type="button"
              className={`toggle-btn ${!showLogin ? "active" : ""}`}
              onClick={() => setShowLogin(false)}
            >
              Register
            </button>
          </div>

          {showLogin ? <Login /> : <Register />}
        </div>
      </div>
    </div>
  );
}
