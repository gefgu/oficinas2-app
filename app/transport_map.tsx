import { useRouter } from 'expo-router';
import { StyleSheet, TouchableOpacity } from 'react-native';

import MapComponent, { Trajectory } from '@/components/MapComponent';
import { ThemedText } from '@/components/ThemedText';
import { sampleTrajectory, transportModes } from '@/data/transport_sample';
import { useState } from 'react';

export default function TransportMap() {
  const router = useRouter();

   // State for trajectories
  const [trajectories, setTrajectories] = useState<Trajectory[]>(sampleTrajectory);

  // Handle trajectory mode change
  const handleTrajectoryModeChange = (trajectoryId: string, newMode: string, newColor: string) => {
    setTrajectories(prev => 
      prev.map(trajectory => 
        trajectory.id === trajectoryId 
          ? { ...trajectory, mode: newMode, color: newColor } 
          : trajectory
      )
    );
  };

  return (
    <>
      <MapComponent 
        trajectories={trajectories} 
        transportModes={transportModes}
        onTrajectoryModeChange={handleTrajectoryModeChange}
      >
        <TouchableOpacity 
          style={styles.button}
          onPress={() => router.push('/purpose_map')}
        >
          <ThemedText style={styles.buttonText}>Continue</ThemedText>
        </TouchableOpacity>
      </MapComponent>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#0a7ea4',
    width: "30%",
    textAlign: 'center',
    marginHorizontal: "auto",
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    width: '100%',
    textAlign: 'center',
  },
});