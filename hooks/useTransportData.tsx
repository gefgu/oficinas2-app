import { useState, useEffect } from 'react';
import { Trajectory } from '@/components/MapComponent';
import { ApiService, VisitData } from '@/utils/apiService';
import { transportModes } from '@/data/transport_sample'; // Import the transport modes


export const useTransportData = () => {
  const [trajectories, setTrajectories] = useState<Trajectory[]>([]);
  const [visits, setVisits] = useState<VisitData[]>([]);
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
      console.log('Fetched data:', data);
      setTrajectories(data.trajectories);
      setVisits(data.visits);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const updateTrajectoryMode = (trajectoryId: string, newMode: string, newColor: string) => {
    setTrajectories(prev => 
      prev.map(trajectory => 
        trajectory.id === trajectoryId 
          ? { ...trajectory, mode: newMode, color: newColor } 
          : trajectory
      )
    );

    // Update corresponding visit
    const trajectory = trajectories.find(t => t.id === trajectoryId);
    if (trajectory) {
      setVisits(prev => 
        prev.map(visit => 
          visit.uid === trajectory.uid && visit.trip_number === trajectory.trip_number
            ? { ...visit, mode_of_transport: newMode }
            : visit
        )
      );
    }
  };

  const updateVisitPurpose = (uid: number, trip_number: number, purpose: string) => {
    setVisits(prev => 
      prev.map(visit => 
        visit.uid === uid && visit.trip_number === trip_number
          ? { ...visit, purpose }
          : visit
      )
    );
  };

  const submitUpdates = async () => {
    try {
      await ApiService.updateVisits(visits);
      console.log('Successfully submitted updates');
    } catch (error) {
      console.error('Failed to submit updates:', error);
      throw error;
    }
  };

  const refetch = () => {
    loadTrajectories();
  };

  return {
    trajectories,
    visits,
    transportModes,
    loading,
    error,
    refetch,
    updateTrajectoryMode,
    updateVisitPurpose,
    submitUpdates,
  };
};