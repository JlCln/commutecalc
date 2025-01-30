import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useStats } from "../contexts/StatsContext";

interface LastCalculation {
  id: number;
  userId: number;
  calculatedDuration: number;
  startStop: string;
  endStop: string;
  departureTime: string;
  selectedDate: string;
}

export interface DetailedStats {
  daily: Array<{
    date: string;
    duration: number;
    count: number;
  }>;
  weekly: Array<{
    week: string;
    duration: number;
    count: number;
  }>;
  monthly: Array<{
    month: string;
    duration: number;
    count: number;
  }>;
}

interface OverallStats {
  totalDuration: number;
  totalRoutes: number;
  mostFrequentRoute: {
    startStop: string;
    endStop: string;
    count: number;
  };
}

const formatDuration = (minutes: number): string => {
  const days = Math.floor(minutes / (24 * 60));
  const hours = Math.floor((minutes % (24 * 60)) / 60);
  const remainingMinutes = Math.round(minutes % 60);

  const parts = [];
  if (days > 0) parts.push(`${days} jour${days > 1 ? "s" : ""}`);
  if (hours > 0) parts.push(`${hours} heure${hours > 1 ? "s" : ""}`);
  if (remainingMinutes > 0)
    parts.push(`${remainingMinutes} minute${remainingMinutes > 1 ? "s" : ""}`);

  return parts.join(" et ") || "0 minute";
};

const createShareMessage = (calculation: LastCalculation): string => {
  return `🚇 **Mon trajet sur Commute Calc :**
📅 Le ${new Date(calculation.selectedDate).toLocaleDateString("fr-FR")} à ${calculation.departureTime}
🚩 Départ: ${calculation.startStop}
🏁 Arrivée: ${calculation.endStop}
⌚ Durée estimée: ${formatDuration(calculation.calculatedDuration)}`;
};

const StatsSection = ({
  title,
  children,
  isOpen,
  onToggle,
}: {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}) => (
  <div className="stats-card">
    <button
      type="button"
      className={`stats-header ${isOpen ? "open" : ""}`}
      onClick={onToggle}
    >
      <h3>{title}</h3>
      <span className="toggle-icon" />
    </button>
    <motion.div
      initial={false}
      animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      className="stats-content"
    >
      {children}
    </motion.div>
  </div>
);

const defaultOverallStats: OverallStats = {
  totalDuration: 0,
  totalRoutes: 0,
  mostFrequentRoute: {
    startStop: "",
    endStop: "",
    count: 0,
  },
};

const defaultDetailedStats: DetailedStats = {
  daily: [],
  weekly: [],
  monthly: [],
};

export default function UserStats() {
  const { token } = useAuth();
  const { lastCalculation, setLastCalculation } = useStats();
  const [detailedStats, setDetailedStats] =
    useState<DetailedStats>(defaultDetailedStats);
  const [overallStats, setOverallStats] =
    useState<OverallStats>(defaultOverallStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openSections, setOpenSections] = useState({
    daily: false,
    weekly: false,
    monthly: false,
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchStats = useCallback(async () => {
    if (!token) {
      setError("Authentication required");
      setLoading(false);
      return;
    }

    try {
      const [detailedResponse, overallResponse] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/api/commute/detailed-stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }),
        fetch(`${import.meta.env.VITE_API_URL}/api/commute/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }),
      ]);

      if (detailedResponse.status === 401 || overallResponse.status === 401) {
        setError("Session expired. Please log in again.");
        return;
      }

      if (!detailedResponse.ok || !overallResponse.ok) {
        throw new Error("Failed to fetch stats");
      }

      const [detailedData, overallData] = await Promise.all([
        detailedResponse.json(),
        overallResponse.json(),
      ]);

      setDetailedStats(detailedData);
      setOverallStats(overallData);
      setError("");
    } catch (err) {
      console.error("Failed to load statistics:", err);
      setError("Failed to load statistics");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleDelete = async (recordId: number) => {
    if (!token) return;

    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce trajet ?")) {
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/commute/stats/${recordId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) throw new Error("Failed to delete record");

      localStorage.removeItem("lastCalculation");
      setLastCalculation(null);
      fetchStats();
    } catch (err) {
      console.error("Failed to delete record:", err);
    }
  };

  const handleDeleteAll = async () => {
    if (
      !window.confirm(
        "Êtes-vous sûr de vouloir supprimer tout votre historique ? Cette action est irréversible.",
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/commute/stats-all`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) throw new Error("Failed to delete stats");

      localStorage.removeItem("lastCalculation");
      setLastCalculation(null);
      setOverallStats(defaultOverallStats);
      setDetailedStats(defaultDetailedStats);
      fetchStats();
    } catch (err) {
      console.error("Failed to delete stats:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleShare = async () => {
    if (!lastCalculation) return;

    const message = createShareMessage(lastCalculation);

    try {
      await navigator.clipboard.writeText(message);
      alert("Message copié dans le presse-papier !");
    } catch (err) {
      console.error("Failed to copy message:", err);
    }
  };

  if (loading) {
    return <div className="loading-state">Chargement des statistiques...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  const getWeekDates = (weekStr: string) => {
    const date = new Date(weekStr);
    const startDate = new Date(date);
    startDate.setDate(date.getDate() - date.getDay() + 1);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    return {
      start: startDate.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
      }),
      end: endDate.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
      }),
    };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="stats-dashboard"
    >
      <h2 className="stats-title">Vos Statistiques de Trajets</h2>
      <h3 className="stats-subtitle">Dernier trajet enregistré</h3>
      {lastCalculation ? (
        <div className="last-calculation-container">
          <div className="stats-card last-calculation">
            <div className="stat-details">
              <p>
                <strong>⌚ Temps estimé :</strong>{" "}
                {formatDuration(lastCalculation.calculatedDuration)}
              </p>
              <p>
                📅 Le{" "}
                {new Date(lastCalculation.selectedDate).toLocaleDateString(
                  "fr-FR",
                )}{" "}
                à {lastCalculation.departureTime}
              </p>
              <p>
                <strong>🚩 Départ :</strong> {lastCalculation.startStop}
              </p>
              <p>
                <strong>🏁 Arrivée :</strong> {lastCalculation.endStop}
              </p>
            </div>
          </div>
          <div className="action-buttons">
            <button
              type="button"
              onClick={handleShare}
              className="share-button"
              disabled={!lastCalculation}
            >
              Partager 📤
            </button>
            <button
              type="button"
              onClick={() =>
                lastCalculation?.id ? handleDelete(lastCalculation.id) : null
              }
              className="delete-button"
              disabled={!lastCalculation?.id}
            >
              Supprimer 🗑️
            </button>
          </div>
        </div>
      ) : (
        <div className="stats-card empty-state">
          <p>Vous n'avez pas de dernier trajet enregistré</p>
        </div>
      )}

      <h3 className="stats-subtitle">Statistiques Générales</h3>
      {overallStats && (
        <div className="stats-card overall-stats">
          <div className="stat-details">
            <p>
              ⌚ <strong>Temps total</strong> de vos trajets :{" "}
              {formatDuration(overallStats.totalDuration)}
            </p>
            <p>
              🔢 <strong>Nombre total</strong> de trajets effectués:{" "}
              {overallStats.totalRoutes}
            </p>
            {overallStats.mostFrequentRoute.count > 0 ? (
              <>
                <p>
                  ⭐ Trajet le <strong>plus fréquent</strong> :{" "}
                  {overallStats.mostFrequentRoute.startStop} ➡️{" "}
                  {overallStats.mostFrequentRoute.endStop}
                </p>
                <p>
                  📈 Vous avez effectué ce trajet{" "}
                  <strong>{overallStats.mostFrequentRoute.count} fois</strong>.
                </p>
              </>
            ) : (
              <p>Aucun trajet fréquent enregistré</p>
            )}
          </div>
        </div>
      )}
      <h3 className="stats-subtitle">Statistiques Particulières</h3>
      {detailedStats && (
        <div className="detailed-stats">
          <StatsSection
            title="Vos Stats Journalières"
            isOpen={openSections.daily}
            onToggle={() =>
              setOpenSections((prev) => ({ ...prev, daily: !prev.daily }))
            }
          >
            {detailedStats.daily.map((day) => (
              <div key={day.date} className="stat-row">
                <p className="stat-description">
                  Aujourd'hui, le{" "}
                  {new Date(day.date).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                  })}
                  , vous avez passé {formatDuration(day.duration)} dans les
                  transports en commun.
                </p>
              </div>
            ))}
          </StatsSection>

          <StatsSection
            title="Vos Stats Hebdomadaires"
            isOpen={openSections.weekly}
            onToggle={() =>
              setOpenSections((prev) => ({ ...prev, weekly: !prev.weekly }))
            }
          >
            {detailedStats.weekly.map((week) => (
              <div key={week.week} className="stat-row">
                <p className="stat-description">
                  Cette semaine, du lundi {getWeekDates(week.week).start} au
                  dimanche {getWeekDates(week.week).end}, vous avez passé{" "}
                  {formatDuration(week.duration)} dans les transports en commun.
                </p>
              </div>
            ))}
          </StatsSection>

          <StatsSection
            title="Vos Stats Mensuelles"
            isOpen={openSections.monthly}
            onToggle={() =>
              setOpenSections((prev) => ({ ...prev, monthly: !prev.monthly }))
            }
          >
            {detailedStats.monthly.map((month) => (
              <div key={month.month} className="stat-row">
                <p className="stat-description">
                  En ce mois de{" "}
                  {new Date(month.month)
                    .toLocaleDateString("fr-FR", {
                      month: "long",
                      year: "numeric",
                    })
                    .toLowerCase()}
                  , vous avez passé {formatDuration(month.duration)} dans les
                  transports en commun.
                </p>
              </div>
            ))}
          </StatsSection>
        </div>
      )}
      <div className="delete-all-container">
        <button
          type="button"
          className="delete-all-button"
          onClick={handleDeleteAll}
          disabled={isDeleting}
        >
          {isDeleting ? "Suppression..." : "🗑️ Supprimer tout mon historique"}
        </button>
      </div>
    </motion.div>
  );
}
