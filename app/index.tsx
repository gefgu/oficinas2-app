import { useRouter } from 'expo-router';
import { Dimensions, Image, ImageBackground, SafeAreaView, StyleSheet, View } from 'react-native';

import CircularLoadingIndicator from '@/components/CircularLoadingIndicator';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTransportData } from '@/hooks/useTransportData';
import { ApiService } from '@/utils/apiService';
import React, { useEffect } from 'react';


export default function HomeScreen() {
  const router = useRouter();
  const { trajectories, transportModes, loading, error, refetch } = useTransportData();

  useEffect(() => {
    ApiService.healthCheck().then((isHealthy) => {
      if (!isHealthy) {
        // Alert.alert(
        //   'Server Unreachable',
        //   'The backend server is not reachable. Please ensure the server is running and try again.',
        //   [{ text: 'OK' }]
        // );
      } else {
        console.log('Server is healthy.');
      }
    }).catch((error) => {
      console.error('Health check error:', error);
      // Alert.alert(
      //   'Connection Error',
      //   'Unable to check server connection. Please check your network.',
      //   [{ text: 'OK' }]
      // );
    });
  }, []);

  // Auto-navigate when data is loaded
  useEffect(() => {
    if (!loading && trajectories.length > 0) {
      // Small delay to show the loaded state briefly
      const timer = setTimeout(() => {
        router.push('/transport_map');
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [loading, trajectories.length, router]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground 
        source={require('../assets/images/background.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Gray overlay */}
        <View style={styles.overlay} />
        
        <ThemedView style={styles.container}>

          {!loading && (
            <>
              <ThemedView style={styles.titleContainer}>
                <ThemedText type="title" style={styles.title} adjustsFontSizeToFit numberOfLines={1}>
                  NETMOB
                </ThemedText>
                <Image 
                  source={require('../assets/icons/compass.png')} 
                  style={styles.compassIcon}
                  resizeMode="contain"
                />
              </ThemedView>

              <ThemedView style={styles.titleContainer}>
                  <ThemedText style={styles.subtitleText}>
                      Bem-Vindo!
                </ThemedText>
              </ThemedView>
            </>
          )}  

          

          {/* Error Display */}
          {/* {error && (
            <ThemedView style={styles.errorContainer}>
              <ThemedText style={styles.errorText}>
                Failed to load data
                
              </ThemedText>
              <TouchableOpacity onPress={refetch} style={styles.retryButton}>
                <ThemedText style={styles.retryButtonText}>Retry</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          )} */}

          {/* Loading Indicator */}
          {loading && (
            <ThemedView style={styles.loadingContainer}>
              <CircularLoadingIndicator />
              <ThemedText style={styles.loadingText}>
                NETMOB
              </ThemedText>
            </ThemedView>
          )}

          {/* Data Status */}
          {/* {!loading && (
            <ThemedText style={styles.statusText}>
              {trajectories.length > 0 
                ? `${trajectories.length} trajectories loaded`
                : 'No trajectory data available'
              }
            </ThemedText>
          )} */}

          {/* Start Button */}
          {/* <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleStartPress}
            disabled={loading}
          >
            <ThemedText style={styles.buttonText}>
              {loading ? 'Loading...' : 'Start'}
            </ThemedText>
          </TouchableOpacity> */}


        </ThemedView>
      </ImageBackground>
    </SafeAreaView>
  );
}

// More precise responsive sizing
const { width } = Dimensions.get('window');
const responsiveFontSize = Math.min(48, width * 0.2);

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'transparent',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    minHeight: 60,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: responsiveFontSize,
    fontFamily: 'Montserrat-Bold',
    marginBottom: 30,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  compassIcon: {
    width: responsiveFontSize * 0.9,
    height: responsiveFontSize * 0.9,
    marginLeft: 10,
    marginBottom: 30,
    color: "white",
    // backgroundColor: "white"
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
    fontFamily: 'Montserrat-Bold',
    width: '100%',
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'transparent',
  },

  loadingText: {
    marginTop: 20,
    fontSize: responsiveFontSize * 0.75,
    fontFamily: 'Montserrat-Bold',
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
    fontFamily: 'Montserrat-Regular',
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
    fontFamily: 'Montserrat-Bold',
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    marginBottom: 10,
    textAlign: 'center',
    opacity: 0.7,
  },
  subtitleText: {
    fontSize: responsiveFontSize * 0.5,
    fontFamily: 'Montserrat-Medium',
    marginBottom: 20,
    textAlign: 'center',
  },
});