import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

interface StatsData {
  daily: { date: string; duration: number }[];
  weekly: { week: string; duration: number }[];
  monthly: { month: string; duration: number }[];
}

export default function UserStats() {
  const { token } = useAuth();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/commute/detailed-stats`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch stats: ${response.statusText}`);
        }

        const data = await response.json();
        setStats({
          daily: data.daily || [],
          weekly: data.weekly || [],
          monthly: data.monthly || [],
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  if (loading) return <div className="loading">Loading stats...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="stats-dashboard"
    >
      <h2>Commute Statistics</h2>

      <div className="stats-grid">
        <div className="stats-card daily">
          <h3>Daily Overview</h3>
          {stats?.daily.map((day) => (
            <div key={day.date} className="stat-item">
              <span>{day.date}</span>
              <span>{day.duration} min</span>
            </div>
          ))}
        </div>

        <div className="stats-card weekly">
          <h3>Weekly Overview</h3>
          {stats?.weekly.map((week) => (
            <div key={week.week} className="stat-item">
              <span>{week.week}</span>
              <span>{week.duration} min</span>
            </div>
          ))}
        </div>

        <div className="stats-card monthly">
          <h3>Monthly Overview</h3>
          {stats?.monthly.map((month) => (
            <div key={month.month} className="stat-item">
              <span>{month.month}</span>
              <span>{month.duration} min</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
