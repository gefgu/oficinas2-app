import { useRouter } from 'expo-router';
import { ActivityIndicator, Alert, Dimensions, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTransportData } from '@/hooks/useTransportData';
import { ApiService } from '@/utils/apiService';
import { useEffect } from 'react';

export default function HomeScreen() {
  const router = useRouter();
  const { trajectories, transportModes, loading, error, refetch } = useTransportData();

  const handleStartPress = () => {
    if (trajectories.length === 0 && !loading) {
      Alert.alert(
        'No Data Available',
        'No trajectory data could be loaded. Please check your connection and try again.',
        [
          { text: 'Retry', onPress: refetch },
          { text: 'Continue Anyway', onPress: () => router.push('/transport_map') },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
      return;
    }

    // Navigate to transport map with the loaded data
    router.push('/transport_map');
  };

  useEffect(() => {
    ApiService.healthCheck().then((isHealthy) => {
      if (!isHealthy) {
        Alert.alert(
          'Server Unreachable',
          'The backend server is not reachable. Please ensure the server is running and try again.',
          [{ text: 'OK' }]
        );
      }
    }).catch((error) => {
      console.error('Health check error:', error);
      Alert.alert(
        'Connection Error',
        'Unable to check server connection. Please check your network.',
        [{ text: 'OK' }]
      );
    });
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title" style={styles.title} adjustsFontSizeToFit numberOfLines={1}>
            NetMob
          </ThemedText>
        </ThemedView>

        {/* Error Display */}
        {error && (
          <ThemedView style={styles.errorContainer}>
            <ThemedText style={styles.errorText}>
              Failed to load data: {error}
            </ThemedText>
            <TouchableOpacity onPress={refetch} style={styles.retryButton}>
              <ThemedText style={styles.retryButtonText}>Retry</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        )}

        {/* Loading Indicator */}
        {loading && (
          <ThemedView style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0a7ea4" />
            <ThemedText style={styles.loadingText}>
              Loading transportation data...
            </ThemedText>
          </ThemedView>
        )}

        {/* Data Status */}
        {!loading && (
          <ThemedText style={styles.statusText}>
            {trajectories.length > 0 
              ? `${trajectories.length} trajectories loaded`
              : 'No trajectory data available'
            }
          </ThemedText>
        )}

        {/* Start Button */}
        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleStartPress}
          disabled={loading}
        >
          <ThemedText style={styles.buttonText}>
            {loading ? 'Loading...' : 'Start'}
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </SafeAreaView>
  );
}

// More precise responsive sizing
const { width } = Dimensions.get('window');
const responsiveFontSize = Math.min(38, width * 0.2);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    width: '100%',
    minHeight: 60,
  },
  title: {
    fontSize: responsiveFontSize,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#0a7ea4',
    paddingHorizontal: 0,
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 20,
    width: '60%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
    backgroundColor: '#666',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    width: '100%',
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusText: {
    fontSize: 12,
    marginBottom: 10,
    textAlign: 'center',
    opacity: 0.7,
  },
});