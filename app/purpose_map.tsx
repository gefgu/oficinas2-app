
import { Trajectory } from '@/components/BaseMap';
import PurposeMapComponent from '@/components/PurposeMap';
import { ThemedText } from '@/components/ThemedText';
import { purposeModes, purposeSample } from '@/data/purpose_sample';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

export default function PurposeMapScreen() {
  const router = useRouter();

  // Sample purpose markers with date and time
  const [purposeMarkers, setPurposeMarkers] = useState<Trajectory[]>(purposeSample);

  // Handle purpose marker mode change
  const handlePurposeChange = (markerId: string, newMode: string, newColor: string) => {
    setPurposeMarkers(prev =>
      prev.map(marker =>
        marker.id === markerId
          ? { ...marker, mode: newMode, color: newColor }
          : marker
      )
    );
  };

  return (
    <>
      <PurposeMapComponent
        purposeMarkers={purposeMarkers}
        purposeModes={purposeModes}
        onPurposeChange={handlePurposeChange}
      >
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/finish')}
        >
          <ThemedText style={styles.buttonText}>Continue</ThemedText>
        </TouchableOpacity>
      </PurposeMapComponent>
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