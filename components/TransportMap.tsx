<<<<<<< HEAD
import React, { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';

// Define the coordinate type
export interface Coordinate {
  latitude: number;
  longitude: number;
}

// Define trajectory type
export interface Trajectory {
  id: string;
  mode: string; // "bus", "car", "walk", etc. or purpose like "work", "leisure", etc.
  color: string;
  coordinates: Coordinate[];
}

// Define transport mode button type
export interface TransportModeButton {
  id: string;
  mode: string;
  iconPath: any; // Path to the icon image
  color: string;
}

interface MapComponentProps {
  trajectories?: Trajectory[];
  transportModes?: TransportModeButton[];
  onTrajectoryModeChange?: (trajectoryId: string, newMode: string, newColor: string) => void;
  children?: React.ReactNode;
}

export default function TransportMap({ 
  trajectories = [], 
  transportModes = [],
  onTrajectoryModeChange,
  children 
}: MapComponentProps) {
  const [selectedTrajectory, setSelectedTrajectory] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  
  // Curitiba coordinates
  const curitibaRegion = {
    latitude: -25.4290,
    longitude: -49.2671,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  // Handle trajectory selection
  const handleTrajectoryPress = (trajectoryId: string) => {
    setSelectedTrajectory(trajectoryId === selectedTrajectory ? null : trajectoryId);
    
    // If both trajectory and mode are selected, change the mode
    if (selectedMode && trajectoryId !== selectedTrajectory) {
      const selectedModeButton = transportModes.find(mode => mode.id === selectedMode);
      if (selectedModeButton && onTrajectoryModeChange) {
        // Apply the mode change
        onTrajectoryModeChange(trajectoryId, selectedModeButton.mode, selectedModeButton.color);
        
        // Reset both selections after changing the trajectory mode
        setSelectedTrajectory(null);
        setSelectedMode(null);
      }
    }
  };
  
  // Handle mode button press
  const handleModePress = (modeId: string) => {
    setSelectedMode(modeId === selectedMode ? null : modeId);
    
    // If both trajectory and mode are selected, change the mode
    if (selectedTrajectory && modeId !== selectedMode) {
      const selectedModeButton = transportModes.find(mode => mode.id === modeId);
      if (selectedModeButton && onTrajectoryModeChange) {
        // Apply the mode change
        onTrajectoryModeChange(selectedTrajectory, selectedModeButton.mode, selectedModeButton.color);
        
        // Reset both selections after changing the trajectory mode
        setSelectedTrajectory(null);
        setSelectedMode(null);
      }
    }
  };

  return (
    <View style={styles.container}>
      <MapView 
        provider={PROVIDER_GOOGLE} 
        style={styles.map} 
        initialRegion={curitibaRegion}
      >
        {/* Render each trajectory as a polyline */}
        {trajectories.map((trajectory) => (
          <Polyline
            key={trajectory.id}
            coordinates={trajectory.coordinates}
            strokeColor={trajectory.color}
            strokeWidth={selectedTrajectory === trajectory.id ? 10 : 4}
            onPress={() => handleTrajectoryPress(trajectory.id)}
            tappable={true}
          />
        ))}

        {/* Render only start points as markers */}
        {trajectories.map((trajectory) => (
          trajectory.coordinates.length > 0 && (
            <Marker
              key={`marker-${trajectory.id}`}
              coordinate={trajectory.coordinates[0]}
              title={`Trip ${trajectory.id.split('-')[1]} - ${trajectory.mode}`}
              description="Start of trajectory"
              pinColor={trajectory.color}
              onPress={() => handleTrajectoryPress(trajectory.id)}
            />
          )
        ))}

        {/* Default marker for Curitiba center if no trajectories */}
        {trajectories.length === 0 && (
          <Marker coordinate={{ latitude: curitibaRegion.latitude, longitude: curitibaRegion.longitude }} />
        )}
      </MapView>
      
      {/* Transport mode overlay buttons - now horizontal at bottom */}
      <View style={styles.overlayButtonsContainer}>
        {transportModes.map((mode) => (
          <TouchableOpacity
            key={mode.id}
            style={[
              styles.modeButton,
              { backgroundColor: mode.color },
              selectedMode === mode.id && styles.selectedModeButton
            ]}
            onPress={() => handleModePress(mode.id)}
          >
            <Image source={mode.iconPath} style={styles.modeIcon} />
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Navigation button container */}
      <View style={styles.navigationButtonContainer}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  overlayButtonsContainer: {
    position: 'absolute',
    bottom: 180,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  modeButton: {
    width: 60,
    height: 60,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  selectedModeButton: {
    borderWidth: 10,
    borderColor: 'white',
  },
  modeIcon: {
    width: 30,
    height: 30,
    tintColor: 'white',
  },
  navigationButtonContainer: {
    position: 'absolute',
    bottom: 60,
    width: '100%',
    alignSelf: 'center',
  },
});
=======
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
>>>>>>> master
