import { useState } from "react";
import Login from "./Login";
import Register from "./Register";

export default function WelcomePage() {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="welcome-page">
      <div className="content">
        <div className="welcome-text">
          <h1>Bienvenue sur Commute Calc'</h1>
          <p>
            Trackez votre temps de trajet quotidien et optimisez vos
            déplacements.
          </p>
          <p>
            Planifiez votre trajet, obtenez des statistiques et partagez-les
            avec vos amis.
          </p>
          <p>Authentifiez vous pour débuter !</p>
          <div className="auth-buttons">
            <button
              type="button"
              className={`auth-button ${showLogin ? "active" : ""}`}
              onClick={() => setShowLogin(true)}
            >
              Connexion
            </button>
            <button
              type="button"
              className={`auth-button ${!showLogin ? "active" : ""}`}
              onClick={() => setShowLogin(false)}
            >
              Inscription
            </button>
          </div>
        </div>
        <div className="auth-form">{showLogin ? <Login /> : <Register />}</div>
      </div>
    </div>
  );
}
