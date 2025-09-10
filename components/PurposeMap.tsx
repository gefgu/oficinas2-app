import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Callout, Marker } from 'react-native-maps';

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
  // Custom callout rendering for purpose markers
  const renderPurposeCallout = (trajectory: Trajectory) => (
    <Callout tooltip>
      <View style={styles.callout}>
        <Text style={styles.calloutTitle}>{trajectory.mode}</Text>
        {trajectory.date && <Text style={styles.calloutText}>Date: {trajectory.date}</Text>}
        {trajectory.time && <Text style={styles.calloutText}>Time: {trajectory.time}</Text>}
      </View>
    </Callout>
  );
  
  // Custom marker rendering for purpose markers
  const renderPurposeMarker = (trajectory: Trajectory, isStart: boolean) => (
    <Marker
      key={`point-${trajectory.id}`}
      coordinate={trajectory.coordinates[0]}
      title={trajectory.mode}
      pinColor={trajectory.color}
      onPress={() => {}}
    >
      {renderPurposeCallout(trajectory)}
    </Marker>
  );

  return (
    <BaseMapComponent 
      trajectories={purposeMarkers}
      modeButtons={purposeModes}
      onModeChange={onPurposeChange}
      showLines={false}
      renderMarker={renderPurposeMarker}
      renderCallout={renderPurposeCallout}
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