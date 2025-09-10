import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { Trajectory } from '@/components/BaseMap';
import { ThemedText } from '@/components/ThemedText';
import TransportMapComponent from '@/components/TransportMap';
import { sampleTrajectory, transportModes } from '@/data/transport_sample';

export default function TransportMapScreen() {
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
      <TransportMapComponent 
        trajectories={trajectories} 
        transportModes={transportModes}
        onModeChange={handleTrajectoryModeChange}
      >
        <TouchableOpacity 
          style={styles.button}
          onPress={() => router.push('/purpose_map')}
        >
          <ThemedText style={styles.buttonText}>Continue</ThemedText>
        </TouchableOpacity>
      </TransportMapComponent>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#0a7ea4',
    width: 120,
    height: 50,
    borderRadius: 25,
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
    fontSize: 16,
    fontWeight: 'bold',
  },
});