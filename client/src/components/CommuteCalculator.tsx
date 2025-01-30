import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTransportStops } from "../hooks/useTransportStops";
import BackgroundLines from "./BackgroundLines";

interface TransportStop {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

interface CommuteStats {
  dailyMinutes: number;
  weeklyMinutes: number;
  monthlyMinutes: number;
  yearlyMinutes: number;
}

interface UserStats {
  totalCommutes: number;
  avgDuration: number;
  mostFrequentRoute: {
    startStop: string;
    endStop: string;
  };
}

function calculateDuration(start: TransportStop, end: TransportStop): number {
  const R = 6371;
  const dLat = ((end.latitude - start.latitude) * Math.PI) / 180;
  const dLon = ((end.longitude - start.longitude) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((start.latitude * Math.PI) / 180) *
      Math.cos((end.latitude * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 2);
}

export default function CommuteCalculator() {
  const { stops, loading, error } = useTransportStops();
  const [stats, setStats] = useState<CommuteStats | null>(null);
  const { token } = useAuth();
  const [calculationError, setCalculationError] = useState<string | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/commute/stats`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) throw new Error("Failed to fetch stats");
        const data = await response.json();
        setUserStats(data);
      } catch (error) {
        console.error("Failed to fetch user statistics:", error);
      }
    };

    fetchUserStats();
  }, [token]);

  const [formState, setFormState] = useState({
    date: new Date().toISOString().split("T")[0],
    time: "",
    startStop: "",
    endStop: "",
  });

  const [formErrors, setFormErrors] = useState({
    date: "",
    time: "",
    startStop: "",
    endStop: "",
  });

  const validateForm = () => {
    const errors = {
      date: "",
      time: "",
      startStop: "",
      endStop: "",
    };

    if (!formState.date) {
      errors.date = "Date is required";
    }
    if (!formState.time) {
      errors.time = "Time is required";
    }
    if (!formState.startStop) {
      errors.startStop = "Start location is required";
    }
    if (!formState.endStop) {
      errors.endStop = "End location is required";
    }
    if (
      formState.startStop === formState.endStop &&
      formState.startStop !== ""
    ) {
      errors.endStop = "Start and end locations must be different";
    }

    setFormErrors(errors);
    return !Object.values(errors).some((error) => error !== "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const startLocation = stops.find(
        (s) => s.id === Number(formState.startStop),
      );
      const endLocation = stops.find((s) => s.id === Number(formState.endStop));

      if (!startLocation || !endLocation) {
        throw new Error("Invalid stops selected");
      }

      const calculatedDuration = calculateDuration(startLocation, endLocation);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/commute/calculate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            startStopId: formState.startStop,
            endStopId: formState.endStop,
            departureTime: formState.time,
            selectedDate: formState.date,
            average_duration_minutes: calculatedDuration,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Calculation failed");
      }

      const data = await response.json();
      setStats(data);
    } catch (err) {
      setCalculationError("Failed to calculate commute time");
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="loading-state">
        <div className="spinner" />
        <p>Loading transport stops...</p>
      </div>
    );

  if (error) return <div className="error">{error}</div>;

  return (
    <div className="commute-calculator">
      <BackgroundLines className="dashboard-lines" />
      <h2>Calculate Your Commute Time</h2>
      <form onSubmit={handleSubmit} className="commute-form">
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            value={formState.date}
            onChange={(e) =>
              setFormState({ ...formState, date: e.target.value })
            }
            min={new Date().toISOString().split("T")[0]}
            className={formErrors.date ? "error" : ""}
          />
          {formErrors.date && (
            <span className="error-message">{formErrors.date}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="time">Departure Time</label>
          <input
            type="time"
            id="time"
            value={formState.time}
            onChange={(e) =>
              setFormState({ ...formState, time: e.target.value })
            }
            className={formErrors.time ? "error" : ""}
          />
          {formErrors.time && (
            <span className="error-message">{formErrors.time}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="startStop">Start Location</label>
          <select
            id="startStop"
            value={formState.startStop}
            onChange={(e) =>
              setFormState({ ...formState, startStop: e.target.value })
            }
            className={formErrors.startStop ? "error" : ""}
          >
            <option value="">Select start location</option>
            {stops.map((stop) => (
              <option key={stop.id} value={stop.id}>
                {stop.name}
              </option>
            ))}
          </select>
          {formErrors.startStop && (
            <span className="error-message">{formErrors.startStop}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="endStop">End Location</label>
          <select
            id="endStop"
            value={formState.endStop}
            onChange={(e) =>
              setFormState({ ...formState, endStop: e.target.value })
            }
            className={formErrors.endStop ? "error" : ""}
          >
            <option value="">Select end location</option>
            {stops.map((stop) => (
              <option key={stop.id} value={stop.id}>
                {stop.name}
              </option>
            ))}
          </select>
          {formErrors.endStop && (
            <span className="error-message">{formErrors.endStop}</span>
          )}
        </div>

        <button type="submit" className="submit-button">
          Calculate
        </button>
      </form>

      {calculationError && (
        <div className="error-message">{calculationError}</div>
      )}
      {stats && (
        <div className="stats">
          <h3>Your Commute Statistics</h3>
          <p>Daily: {stats.dailyMinutes} minutes</p>
          <p>Weekly: {stats.weeklyMinutes} minutes</p>
          <p>Monthly: {stats.monthlyMinutes} minutes</p>
          <p>Yearly: {stats.yearlyMinutes} minutes</p>
        </div>
      )}
      {userStats && (
        <div className="user-stats">
          <h3>Your Overall Statistics</h3>
          <p>Total Commutes: {userStats.totalCommutes}</p>
          <p>Average Duration: {Math.round(userStats.avgDuration)} minutes</p>
          <p>
            Most Frequent Route: {userStats.mostFrequentRoute.startStop} to{" "}
            {userStats.mostFrequentRoute.endStop}
          </p>
        </div>
      )}
    </div>
  );
}
