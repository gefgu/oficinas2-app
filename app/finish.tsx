import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Dimensions, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { submitUserData } from '@/utils/dataSubmission';

export default function FinishScreen() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmitData = async () => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // This will be replaced with actual data from your app state/context
      // For now we just pass placeholder data
      await submitUserData({
        transportData: { trajectories: [] },
        purposeData: { points: [] }
      });
      
      setIsSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit data');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title" style={styles.title} adjustsFontSizeToFit numberOfLines={1}>
            NetMob
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.messageContainer}>
          {isSubmitted ? (
            <>
              <ThemedText style={styles.successMessage}>
                Thank you! Your mobility data has been successfully submitted.
              </ThemedText>
            </>
          ) : (
            <>
              <ThemedText style={styles.infoMessage}>
                Thank you for recording your journey. Submit your data to help improve mobility planning.
              </ThemedText>
              
              {error && (
                <ThemedText style={styles.errorMessage}>
                  {error}
                </ThemedText>
              )}
            </>
          )}
        </ThemedView>

        {isSubmitting ? (
          <ActivityIndicator size="large" color="#0a7ea4" />
        ) : (
          <ThemedView style={styles.buttonContainer}>
            {!isSubmitted ? (
              <TouchableOpacity 
                style={styles.submitButton}
                onPress={handleSubmitData}
              >
                <ThemedText style={styles.buttonText}>Submit Data</ThemedText>
              </TouchableOpacity>
            ) : null}
            
            <TouchableOpacity 
              style={[styles.button, isSubmitted ? styles.homeButton : {}]}
              onPress={() => router.push('/')}
            >
              <ThemedText style={styles.buttonText}>
                {isSubmitted ? 'Return Home' : 'Cancel'}
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        )}
      </ThemedView>
    </SafeAreaView>
  );
}

// More precise responsive sizing
const { width } = Dimensions.get('window');
const responsiveFontSize = Math.min(38, width * 0.2); // Slightly reduced for better fit

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
  messageContainer: {
    width: '90%',
    marginBottom: 30,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  infoMessage: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  successMessage: {
    fontSize: 18,
    textAlign: 'center',
    color: '#2ECC71',
    fontWeight: '500',
  },
  errorMessage: {
    fontSize: 16,
    textAlign: 'center',
    color: '#E74C3C',
    marginTop: 10,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#95a5a6',
    paddingHorizontal: 0,
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 15,
    width: '60%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButton: {
    backgroundColor: '#0a7ea4',
    paddingHorizontal: 0,
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 15,
    width: '60%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeButton: {
    backgroundColor: '#0a7ea4',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    width: '100%',
    textAlign: 'center',
  },
});