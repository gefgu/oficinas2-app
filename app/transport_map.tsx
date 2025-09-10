import { useRouter } from 'expo-router';
import { StyleSheet, TouchableOpacity } from 'react-native';

import MapComponent from '@/components/MapComponent';
import { ThemedText } from '@/components/ThemedText';

export default function Map1Screen() {
  const router = useRouter();

  return (
    <>
      <MapComponent />
      <TouchableOpacity 
        style={styles.button}
        onPress={() => router.push('/purpose_map')}
      >
        <ThemedText style={styles.buttonText}>2</ThemedText>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#0a7ea4',
    width: 60,
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
  },
});