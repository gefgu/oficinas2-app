import { useRouter } from 'expo-router';
import { Dimensions, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title" style={styles.title} adjustsFontSizeToFit numberOfLines={1}>
            NetMob
          </ThemedText>
        </ThemedView>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => router.push('/transport_map')}
        >
          <ThemedText style={styles.buttonText}>Start</ThemedText>
        </TouchableOpacity>
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
    minHeight: 60, // Ensure enough height for the title
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
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    width: '100%',
    textAlign: 'center',
  },
});