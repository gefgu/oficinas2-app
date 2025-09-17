import { useState, useEffect } from 'react';
import { Trajectory } from '@/components/MapComponent';
import { ApiService, VisitData } from '@/utils/apiService';
import { VisitPoint, PurposeButton } from '@/components/PurposeMap';
import { transportModes } from '@/data/transport_sample';
import { purposeButtons } from '@/data/purpose_sample';


const getPurposeColor = (purpose: string): string => {
  const purposeColorMap: { [key: string]: string } = {
    'HOME': '#4CAF50',
    'WORK': '#2196F3',
    'LEISURE': '#FF9800',
    'PURCHASE': '#9C27B0',
    'OTHER': '#607D8B',
  };
  return purposeColorMap[purpose] || '#607D8B';
};

export const useTransportData = () => {
  const [trajectories, setTrajectories] = useState<Trajectory[]>([]);
  const [visits, setVisits] = useState<VisitData[]>([]);
  const [visitPoints, setVisitPoints] = useState<VisitPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTrajectories();
  }, []);

  // Update visit points when visits change
  useEffect(() => {
    const points: VisitPoint[] = visits.map((visit) => ({
      id: `${visit.uid}-${visit.trip_number}`,
      uid: visit.uid,
      trip_number: visit.trip_number,
      coordinate: {
        latitude: visit.latitude,
        longitude: visit.longitude,
      },
      purpose: visit.purpose || 'OTHER',
      arrive_time: visit.arrive_time,
      depart_time: visit.depart_time,
      color: getPurposeColor(visit.purpose || 'OTHER'),
    }));
    setVisitPoints(points);
  }, [visits]);

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

  const updateVisitPurposeOnMap = (visitId: string, newPurpose: string, newColor: string) => {
    // Update visitPoints for immediate visual feedback
    setVisitPoints(prev => 
      prev.map(point => 
        point.id === visitId 
          ? { ...point, purpose: newPurpose, color: newColor } 
          : point
      )
    );

    // Update visits data
    const [uid, trip_number] = visitId.split('-').map(Number);
    updateVisitPurpose(uid, trip_number, newPurpose);
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
    visitPoints,
    transportModes,
    purposeButtons,
    loading,
    error,
    refetch,
    updateTrajectoryMode,
    updateVisitPurpose,
    updateVisitPurposeOnMap,
    submitUpdates,
  };
};