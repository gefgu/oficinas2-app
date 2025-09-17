import { useRouter } from 'expo-router';
import { View, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useDataContext } from '@/contexts/DataContext';
import { useState } from 'react';

const PURPOSE_OPTIONS = [
  { value: 'HOME', label: 'Home', color: '#4CAF50' },
  { value: 'WORK', label: 'Work', color: '#2196F3' },
  { value: 'LEISURE', label: 'Leisure', color: '#FF9800' },
  { value: 'SHOPPING', label: 'Shopping', color: '#9C27B0' },
  { value: 'OTHER', label: 'Other', color: '#607D8B' },
];

export default function PurposeMapScreen() {
  const router = useRouter();
  const { visits, updateVisitPurpose } = useDataContext();
  const [selectedVisit, setSelectedVisit] = useState<number | null>(null);

  const handlePurposeSelect = (visitIndex: number, purpose: string) => {
    const visit = visits[visitIndex];
    updateVisitPurpose(visit.uid, visit.trip_number, purpose);
  };

  const renderVisitItem = ({ item, index }: { item: any, index: number }) => (
    <TouchableOpacity
      style={[styles.visitItem, selectedVisit === index && styles.selectedVisit]}
      onPress={() => setSelectedVisit(selectedVisit === index ? null : index)}
    >
      <ThemedText style={styles.visitTitle}>
        Visit {index + 1} - Trip {item.trip_number}
      </ThemedText>
      <ThemedText style={styles.visitDetails}>
        {new Date(item.arrive_time).toLocaleString()} - {new Date(item.depart_time).toLocaleString()}
      </ThemedText>
      <ThemedText style={styles.visitPurpose}>
        Purpose: {item.purpose || 'Not set'}
      </ThemedText>
      
      {selectedVisit === index && (
        <View style={styles.purposeOptions}>
          {PURPOSE_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.purposeButton,
                { backgroundColor: option.color },
                item.purpose === option.value && styles.selectedPurpose
              ]}
              onPress={() => handlePurposeSelect(index, option.value)}
            >
              <ThemedText style={styles.purposeButtonText}>
                {option.label}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Set Visit Purposes
      </ThemedText>
      
      <FlatList
        data={visits}
        renderItem={renderVisitItem}
        keyExtractor={(item, index) => `${item.uid}-${item.trip_number}-${index}`}
        style={styles.list}
      />

      <TouchableOpacity 
        style={styles.button}
        onPress={() => router.push('/finish')}
      >
        <ThemedText style={styles.buttonText}>Continue</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  list: {
    flex: 1,
  },
  visitItem: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  selectedVisit: {
    backgroundColor: 'rgba(10, 126, 164, 0.1)',
    borderWidth: 2,
    borderColor: '#0a7ea4',
  },
  visitTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  visitDetails: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 5,
  },
  visitPurpose: {
    fontSize: 14,
    fontWeight: '500',
  },
  purposeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  purposeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
    margin: 4,
  },
  selectedPurpose: {
    borderWidth: 2,
    borderColor: '#fff',
  },
  purposeButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});