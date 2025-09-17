import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Trajectory } from '@/components/MapComponent';
import { VisitData } from '@/utils/apiService';
import { useTransportData } from '@/hooks/useTransportData';

interface DataContextType {
  trajectories: Trajectory[];
  visits: VisitData[];
  transportModes: any[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  updateTrajectoryMode: (trajectoryId: string, newMode: string, newColor: string) => void;
  updateVisitPurpose: (uid: number, trip_number: number, purpose: string) => void;
  submitUpdates: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useDataContext must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const data = useTransportData();
  
  return (
    <DataContext.Provider value={data}>
      {children}
    </DataContext.Provider>
  );
};