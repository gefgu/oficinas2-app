import { useRouter } from 'expo-router';
import { TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useDataContext } from '@/contexts/DataContext';
import { useState } from 'react';

export default function FinishScreen() {
  const router = useRouter();
  const { submitUpdates } = useDataContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmitData = async () => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      await submitUpdates();
      setIsSubmitted(true);
      
      Alert.alert(
        'Success!',
        'Your data has been submitted successfully.',
        [{ text: 'OK', onPress: () => router.push('/') }]
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit data');
      Alert.alert(
        'Error',
        'Failed to submit data. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Review Complete!</ThemedText>
          <ThemedText style={styles.subtitle}>
            Thank you for reviewing your mobility data.
          </ThemedText>
        </ThemedView>

        {error && (
          <ThemedView style={styles.errorContainer}>
            <ThemedText style={styles.errorText}>{error}</ThemedText>
          </ThemedView>
        )}

        <TouchableOpacity 
          style={[styles.button, (isSubmitting || isSubmitted) && styles.buttonDisabled]}
          onPress={handleSubmitData}
          disabled={isSubmitting || isSubmitted}
        >
          <ThemedText style={styles.buttonText}>
            {isSubmitting ? 'Submitting...' : isSubmitted ? 'Submitted!' : 'Submit Data'}
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={() => router.push('/')}
        >
          <ThemedText style={styles.secondaryButtonText}>Back to Home</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    opacity: 0.7,
  },
  button: {
    backgroundColor: '#0a7ea4',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 20,
    width: '80%',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0a7ea4',
    width: '80%',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#0a7ea4',
    fontSize: 16,
    fontWeight: 'bold',
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
  },
});