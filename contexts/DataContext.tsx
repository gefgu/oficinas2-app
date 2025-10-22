import { Trajectory } from '@/components/BaseMap';
import { PurposeButton, VisitPoint } from '@/components/PurposeMap';
import { useTransportData } from '@/hooks/useTransportData';
import { VisitData } from '@/utils/apiService';
import React, { createContext, ReactNode, useContext } from 'react';

interface DataContextType {
  trajectories: Trajectory[];
  visits: VisitData[];
  visitPoints: VisitPoint[];
  transportModes: any[];
  purposeButtons: PurposeButton[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  updateTrajectoryMode: (trajectoryId: string, newMode: string, newColor: string) => void;
  updateVisitPurpose: (uid: number, visit_number: number, purpose: string) => void;
  updateVisitPurposeOnMap: (visitId: string, newPurpose: string, newColor: string) => void;
  submitUpdates: () => Promise<void>;
  isSampleMode: boolean;
  loadSampleData: () => void;
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