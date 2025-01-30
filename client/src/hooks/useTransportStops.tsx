import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

interface TransportStop {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

const CACHE_DURATION = 5 * 60 * 1000;
const cache = new Map<string, CacheItem<TransportStop[]>>();

export function useTransportStops() {
  const [stops, setStops] = useState<TransportStop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { token } = useAuth();

  useEffect(() => {
    const fetchStops = async () => {
      const cacheKey = "transport_stops";
      const cachedData = cache.get(cacheKey);

      if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
        setStops(cachedData.data);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/transport/stops`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch stops");
        }

        const data = await response.json();
        cache.set(cacheKey, { data, timestamp: Date.now() });
        setStops(data);
      } catch (err) {
        setError("Failed to load transport stops");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStops();
  }, [token]);

  return { stops, loading, error };
}
