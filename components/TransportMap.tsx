import React from 'react';
import { StyleSheet } from 'react-native';

import BaseMapComponent, { ModeButton, Trajectory } from './BaseMap';

export interface TransportMapComponentProps {
  trajectories: Trajectory[];
  transportModes: ModeButton[];
  onModeChange: (trajectoryId: string, newMode: string, newColor: string) => void;
  children?: React.ReactNode;
}

export default function TransportMapComponent({
  trajectories,
  transportModes,
  onModeChange,
  children
}: TransportMapComponentProps) {
  return (
    <BaseMapComponent 
      trajectories={trajectories}
      modeButtons={transportModes}
      onModeChange={onModeChange}
      showLines={true}
      children={children}
    />
  );
}

// No specific styles needed as they're handled by the base component
const styles = StyleSheet.create({});