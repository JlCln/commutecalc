import { motion } from "framer-motion";
import { useContext, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useStats } from "../contexts/StatsContext";
import { TabContext } from "../contexts/TabContext";
import { useTransportStops } from "../hooks/useTransportStops";

interface TransportStop {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
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

  const speedInKmPerHour = 9;
  const timeInHours = distance / speedInKmPerHour;
  const timeInMinutes = Math.round(timeInHours * 60);

  return Math.max(timeInMinutes, 1);
}

export default function CommuteCalculator() {
  const { stops, loading, error: stopsError } = useTransportStops();
  const { token, user } = useAuth();
  const { setLastCalculation } = useStats();
  const [calculationError, setCalculationError] = useState<string | null>(null);

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

    if (!formState.date) errors.date = "Date requise";
    if (!formState.time) errors.time = "Heure requise";
    if (!formState.startStop) errors.startStop = "Lieu de départ requis";
    if (!formState.endStop) errors.endStop = "Lieu d'arrivée requis";

    if (
      formState.startStop === formState.endStop &&
      formState.startStop !== ""
    ) {
      errors.endStop =
        "Les lieux de départ et d'arrivée doivent être différents";
    }

    setFormErrors(errors);
    return !Object.values(errors).some((error) => error !== "");
  };

  interface TabContextType {
    setActiveTab: (tab: string) => void;
  }

  const { setActiveTab } = useContext(TabContext) as TabContextType;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const startLocation = stops.find(
        (s) => s.id === Number(formState.startStop),
      );
      const endLocation = stops.find((s) => s.id === Number(formState.endStop));

      if (!startLocation || !endLocation) {
        throw new Error("Arrêts invalides");
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
            startStopId: startLocation.id,
            endStopId: endLocation.id,
            departureTime: formState.time,
            selectedDate: formState.date,
            average_duration_minutes: calculatedDuration,
          }),
        },
      );

      if (!response.ok) throw new Error("Erreur lors du calcul");

      const data = await response.json();

      setLastCalculation({
        id: data.id,
        userId: user?.id || 0,
        calculatedDuration,
        startStop: startLocation.name,
        endStop: endLocation.name,
        departureTime: formState.time,
        selectedDate: formState.date,
      });

      setActiveTab("stats");
    } catch (err) {
      setCalculationError("Erreur lors du calcul du temps de trajet");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner" />
        <p>Chargement des arrêts...</p>
      </div>
    );
  }

  if (stopsError) return <div className="error">{stopsError}</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="commute-calculator"
    >
      <h2 className="commute-title">Ajoutez votre trajet</h2>
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
          <label htmlFor="time">Horaire de départ</label>
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
          <label htmlFor="startStop">Lieu de départ</label>
          <select
            id="startStop"
            value={formState.startStop}
            onChange={(e) =>
              setFormState({ ...formState, startStop: e.target.value })
            }
            className={formErrors.startStop ? "error" : ""}
          >
            <option value="">Choisissez votre arrêt</option>
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
          <label htmlFor="endStop">Lieu d'arrivée</label>
          <select
            id="endStop"
            value={formState.endStop}
            onChange={(e) =>
              setFormState({ ...formState, endStop: e.target.value })
            }
            className={formErrors.endStop ? "error" : ""}
          >
            <option value="">Choisissez votre arrêt</option>
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
          Calculer mon trajet
        </button>
      </form>

      {calculationError && (
        <div className="error-message">{calculationError}</div>
      )}
    </motion.div>
  );
}
