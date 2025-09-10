import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import PurposePointMap, { PurposePoint } from '@/components/PurposePointMap';
import { ThemedText } from '@/components/ThemedText';
import { purposeModes, purposePoints } from '@/data/purpose_sample';

export default function PurposePointsScreen() {
  const router = useRouter();
  const [points, setPoints] = useState<PurposePoint[]>(purposePoints);

  // Handle purpose change
  const handlePurposeChange = (pointId: string, newPurpose: string, newColor: string) => {
    setPoints(prev => 
      prev.map(point => 
        point.id === pointId 
          ? { ...point, purpose: newPurpose, color: newColor } 
          : point
      )
    );
  };

  return (
    <>
      <PurposePointMap 
        points={points} 
        purposeButtons={purposeModes}
        onPurposeChange={handlePurposeChange}
      >
        <TouchableOpacity 
          style={styles.button}
          onPress={() => router.push('/finish')}
        >
          <ThemedText style={styles.buttonText}>Continue</ThemedText>
        </TouchableOpacity>
      </PurposePointMap>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#0a7ea4',
    width: "30%",
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