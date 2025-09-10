import React from 'react';
import { StyleSheet } from 'react-native';

import BaseMapComponent, { ModeButton, Trajectory } from './BaseMap';

export interface PurposeMapComponentProps {
  purposeMarkers: Trajectory[];
  purposeModes: ModeButton[];
  onPurposeChange: (markerId: string, newMode: string, newColor: string) => void;
  children?: React.ReactNode;
}

export default function PurposeMapComponent({
  purposeMarkers,
  purposeModes,
  onPurposeChange,
  children
}: PurposeMapComponentProps) {
  return (
    <BaseMapComponent 
      trajectories={purposeMarkers}
      modeButtons={purposeModes}
      onModeChange={onPurposeChange}
      showLines={false}
      renderMarker={renderPurposeMarker}
      children={children}
    />
  );
}

const styles = StyleSheet.create({
  callout: {
    width: 160,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  calloutTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
    textTransform: 'capitalize',
  },
  calloutText: {
    fontSize: 14,
  },
});