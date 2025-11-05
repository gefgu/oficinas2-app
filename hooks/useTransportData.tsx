import sampleDataJson from '@/assets/data/sample_data.json';
import { Trajectory } from '@/components/BaseMap';
import { VisitPoint } from '@/components/PurposeMap';
import { purposeButtons } from '@/data/purpose_sample';
import { transportModes } from '@/data/transport_sample';
import { ApiService, VisitData } from '@/utils/apiService';
import Constants from 'expo-constants';
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

const getTransportModeColor = (mode: string): string => {
  const transportColorMap: { [key: string]: string } = {
    'bus': '#FF5733',
    'car': '#3498DB',
    'bicycle': '#2ECC71',
    'walk': '#9B59B6',
    'other': '#95A5A6',
  };
  return transportColorMap[mode.toLowerCase()] || '#95A5A6';
};

export const useTransportData = () => {
  const [trajectories, setTrajectories] = useState<Trajectory[]>([]);
  const [visits, setVisits] = useState<VisitData[]>([]);
  const [visitPoints, setVisitPoints] = useState<VisitPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSampleMode, setIsSampleMode] = useState(false);
  const [apiBaseUrl, setApiBaseUrl] = useState<string>(
    Constants.expoConfig?.extra?.apiBaseUrl 
      || process.env.EXPO_PUBLIC_API_BASE_URL 
      || "http://192.168.1.83:8000"
  );

  useEffect(() => {
    loadTrajectories();
  }, [apiBaseUrl]); // Reload when API URL changes

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
      
      // Update ApiService with current URL before fetching
      ApiService.setBaseUrl(apiBaseUrl);
      
      const data = await ApiService.fetchTrajectories(apiBaseUrl);
      console.log('Fetched data:', data);
      setTrajectories(data.trajectories);
      setVisits(data.visits);
      setIsSampleMode(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setTimeout(() =>  setLoading(false), 500); // slight delay for better UX
      // setLoading(false);
    }
  };

  const loadSampleData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use imported sample data
      const sampleData = sampleDataJson;
      console.log('Loading sample data:', sampleData);
      
      // Process sample data same way as API data
      const trajectories: Trajectory[] = sampleData.trajectory.map((traj: any) => {
        const mode = sampleData.visits.find((v: any) => v.uid === traj.uid && v.visit_number === traj.trip_number)?.mode_of_transport || 'other';
        return {
          id: `${traj.uid}-${traj.trip_number}`,
          uid: traj.uid,
          trip_number: traj.trip_number,
          coordinates: traj.trajectory_points.map((point: any) => ({
            latitude: point.latitude,
            longitude: point.longitude,
          })),
          color: getTransportModeColor(mode),
          mode: mode,
          startTime: traj.trajectory_points[0]?.timestamp || '',
          endTime: traj.trajectory_points[traj.trajectory_points.length - 1]?.timestamp || '',
        };
      });

      setTrajectories(trajectories);
      setVisits(sampleData.visits);
      setIsSampleMode(true);
      console.log('Sample data loaded successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load sample data');
      console.error('Failed to load sample data:', err);
    } finally {
      setTimeout(() => setLoading(false), 500);
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
      if (isSampleMode) {
        // In sample mode, just simulate success without making API call
        console.log('Sample mode: Skipping API submission');
        console.log('Would have submitted:', visits);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        return;
      }
      
      // Ensure ApiService is using the current URL
      ApiService.setBaseUrl(apiBaseUrl);
      
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

  const updateApiBaseUrl = (newUrl: string) => {
    console.log('Updating API Base URL to:', newUrl);
    setApiBaseUrl(newUrl);
    // The useEffect will automatically trigger loadTrajectories when apiBaseUrl changes
  };

  const clearData = () => {
    console.log('Clearing all data...');
    setTrajectories([]);
    setVisits([]);
    setVisitPoints([]);
    setError(null);
    setIsSampleMode(false);
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
    clearData,
    isSampleMode,
    loadSampleData,
    apiBaseUrl,
    updateApiBaseUrl,
  };
};