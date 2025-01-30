import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface NavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Navigation({ activeTab, setActiveTab }: NavProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const menuItems = [
    { id: "calc", icon: "📊", label: "Votre trajet" },
    { id: "stats", icon: "📈", label: "Vos stats" },
    { id: "profile", icon: "👤", label: "Votre profil" },
  ];

  return (
    <nav className="dashboard-nav">
      <ul>
        {menuItems.map((item) => (
          <motion.li
            key={item.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button
              type="button"
              className={`nav-item ${activeTab === item.id ? "active" : ""}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="icon">{item.icon}</span>
              <span className="label">{item.label}</span>
            </button>
          </motion.li>
        ))}
        <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <button
            type="button"
            className="nav-item logout"
            onClick={handleLogout}
          >
            <span className="icon">🚪</span>
            <span className="label">Déconnexion</span>
          </button>
        </motion.li>
      </ul>
    </nav>
  );
}
