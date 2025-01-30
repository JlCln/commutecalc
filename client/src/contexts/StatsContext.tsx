import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

interface LastCalculation {
  id: number;
  userId: number;
  calculatedDuration: number;
  startStop: string;
  endStop: string;
  departureTime: string;
  selectedDate: string;
}

interface DetailedStats {
  daily: { date: string; duration: number }[];
  weekly: { week: string; duration: number }[];
  monthly: { month: string; duration: number }[];
}

interface StatsContextType {
  lastCalculation: LastCalculation | null;
  setLastCalculation: (calc: LastCalculation | null) => void;
  detailedStats: DetailedStats;
  setDetailedStats: (stats: DetailedStats) => void;
}

const STORAGE_KEY = "lastCalculation";

export const StatsContext = createContext<StatsContextType | null>(null);

export function StatsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [lastCalculation, setLastCalculation] =
    useState<LastCalculation | null>(null);
  const [detailedStats, setDetailedStats] = useState<DetailedStats>({
    daily: [],
    weekly: [],
    monthly: [],
  });

  const handleSetLastCalculation = (calc: LastCalculation | null) => {
    if (!calc) {
      setLastCalculation(null);
      localStorage.removeItem(STORAGE_KEY);
      return;
    }

    const calculationWithUser = {
      ...calc,
      userId: user?.id || 0,
    };

    setLastCalculation(calculationWithUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(calculationWithUser));
  };

  useEffect(() => {
    if (!user) {
      setLastCalculation(null);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  return (
    <StatsContext.Provider
      value={{
        lastCalculation,
        setLastCalculation: handleSetLastCalculation,
        detailedStats,
        setDetailedStats,
      }}
    >
      {children}
    </StatsContext.Provider>
  );
}

export const useStats = () => {
  const context = useContext(StatsContext);
  if (!context) {
    throw new Error("");
  }
  return context;
};
