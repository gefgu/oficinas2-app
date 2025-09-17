
import PurposeMap from '@/components/PurposeMap';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useDataContext } from '@/contexts/DataContext';
import { useRouter } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export default function PurposeMapScreen() {
  const router = useRouter();
  const { visitPoints, purposeButtons, updateVisitPurposeOnMap, loading, error } = useDataContext();

  // Handle case when no data is available
  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Loading visits...</ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.errorText}>Error: {error}</ThemedText>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => router.push('/finish')}
        >
          <ThemedText style={styles.buttonText}>Continue Anyway</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  if (visitPoints.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.noDataText}>No visits available to review</ThemedText>
        <ThemedText style={styles.noDataSubtext}>
          It looks like there are no visit points to display. This could mean:
        </ThemedText>
        <ThemedText style={styles.bulletPoint}>• No location data was recorded for visits</ThemedText>
        <ThemedText style={styles.bulletPoint}>• The server has no visit data for your user</ThemedText>
        <ThemedText style={styles.bulletPoint}>• There was an issue processing the visit data</ThemedText>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={() => router.push('/finish')}
        >
          <ThemedText style={styles.buttonText}>Continue</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <PurposeMap 
        visits={visitPoints} 
        purposeButtons={purposeButtons}
        onVisitPurposeChange={updateVisitPurposeOnMap}
      >
        <TouchableOpacity 
          style={styles.button}
          onPress={() => router.push('/finish')}
        >
          <ThemedText style={styles.buttonText}>Continue</ThemedText>
        </TouchableOpacity>
      </PurposeMap>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  button: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: '#0a7ea4',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    width: '100%',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  noDataText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  noDataSubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 15,
    opacity: 0.8,
  },
  bulletPoint: {
    fontSize: 12,
    textAlign: 'left',
    marginBottom: 5,
    opacity: 0.7,
    alignSelf: 'flex-start',
  },
});