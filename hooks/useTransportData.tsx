import { Trajectory } from '@/components/BaseMap';
import { VisitPoint } from '@/components/PurposeMap';
import { purposeButtons } from '@/data/purpose_sample';
import { transportModes } from '@/data/transport_sample';
import { ApiService, VisitData } from '@/utils/apiService';
import { useEffect, useState } from 'react';


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
      id: `${visit.uid}-${visit.visit_number}`,
      uid: visit.uid,
      visit_number: visit.visit_number,
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
    const [uid, visit_number] = trajectoryId.split('-').map(Number);
    setVisits(prev => 
      prev.map(visit => 
        visit.uid === uid && visit.visit_number === visit_number
          ? { ...visit, mode_of_transport: newMode }
          : visit
      )
    );
  };

  const updateVisitPurpose = (uid: number, visit_number: number, purpose: string) => {
    setVisits(prev => 
      prev.map(visit => 
        visit.uid === uid && visit.visit_number === visit_number
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
    const [uid, visit_number] = visitId.split('-').map(Number);
    updateVisitPurpose(uid, visit_number, newPurpose);
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