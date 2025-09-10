import React from 'react';
import { StyleSheet, View } from 'react-native';
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

interface MapComponentProps {
  trajectories?: Trajectory[];
  children?: React.ReactNode;
}

export default function MapComponent({ trajectories = [], children }: MapComponentProps) {
  // Curitiba coordinates
  const curitibaRegion = {
    latitude: -25.4290,
    longitude: -49.2671,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
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
            strokeWidth={4}
          />
        ))}

        {/* Render start points as markers */}
        {trajectories.map((trajectory) => (
          trajectory.coordinates.length > 0 && (
            <Marker
              key={`start-${trajectory.id}`}
              coordinate={trajectory.coordinates[0]}
              title={`Start: ${trajectory.mode}`}
              pinColor={trajectory.color}
            />
          )
        ))}

        {/* Render end points as markers */}
        {trajectories.map((trajectory) => (
          trajectory.coordinates.length > 0 && (
            <Marker
              key={`end-${trajectory.id}`}
              coordinate={trajectory.coordinates[trajectory.coordinates.length - 1]}
              title={`End: ${trajectory.mode}`}
              pinColor="black"
            />
          )
        ))}

        {/* Default marker for Curitiba center if no trajectories */}
        {trajectories.length === 0 && (
          <Marker coordinate={{ latitude: curitibaRegion.latitude, longitude: curitibaRegion.longitude }} />
        )}
      </MapView>
      {children}
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
});