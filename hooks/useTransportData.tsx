import { Trajectory, TransportModeButton } from "@/components/MapComponent";
import { ApiService } from '@/utils/apiService';
import { useEffect, useState } from 'react';

// Keep your transport modes as they are
const transportModes: TransportModeButton[] = [
  {
    id: "mode-bus",
    mode: "bus",
    iconPath: require('../assets/icons/bus.png'),
    color: "#FF5733",
  },
  {
    id: "mode-car",
    mode: "car",
    iconPath: require('../assets/icons/car.png'),
    color: "#3498DB",
  },
  {
    id: "mode-bicycle",
    mode: "bicycle",
    iconPath: require('../assets/icons/bicycle.png'),
    color: "#2ECC71",
  },
  {
    id: "mode-walk",
    mode: "walk",
    iconPath: require('../assets/icons/walk.png'),
    color: "#9B59B6",
  },
];

export const useTransportData = () => {
  const [trajectories, setTrajectories] = useState<Trajectory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTrajectories();
  }, []);

  const loadTrajectories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ApiService.fetchTrajectories();
      console.log('Fetched trajectories:', data);
      setTrajectories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    loadTrajectories();
  };

  return {
    trajectories,
    transportModes,
    loading,
    error,
    refetch,
  };
};