import { useRouter } from 'expo-router';
import { StyleSheet, TouchableOpacity } from 'react-native';

import MapComponent, { Trajectory } from '@/components/MapComponent';
import { ThemedText } from '@/components/ThemedText';

export default function Map2Screen() {
  const router = useRouter();

  // Updated trajectory data that follows a path through Curitiba
  const purposeTrajectories: Trajectory[] = [
    {
      id: "1",
      mode: "work",
      color: "#E74C3C", // Red
      coordinates: [
        // Starting from home at Jardim Botânico area
        { latitude: -25.4390, longitude: -49.2420 }, // Starting point (Home)
        { latitude: -25.4385, longitude: -49.2450 },
        { latitude: -25.4375, longitude: -49.2470 },
        { latitude: -25.4360, longitude: -49.2500 },
        { latitude: -25.4330, longitude: -49.2520 },
        { latitude: -25.4310, longitude: -49.2540 },
        { latitude: -25.4290, longitude: -49.2570 },
        { latitude: -25.4265, longitude: -49.2600 },
        { latitude: -25.4240, longitude: -49.2620 },
        { latitude: -25.4220, longitude: -49.2650 }, // Ending point (Work - Downtown area)
      ]
    },
    {
      id: "2",
      mode: "shopping",
      color: "#F39C12", // Yellow
      coordinates: [
        // Continuing from work to shopping mall
        { latitude: -25.4220, longitude: -49.2650 }, // Starting from work
        { latitude: -25.4215, longitude: -49.2680 },
        { latitude: -25.4225, longitude: -49.2710 },
        { latitude: -25.4235, longitude: -49.2740 },
        { latitude: -25.4255, longitude: -49.2765 },
        { latitude: -25.4275, longitude: -49.2780 },
        { latitude: -25.4300, longitude: -49.2790 },
        { latitude: -25.4325, longitude: -49.2795 },
        { latitude: -25.4350, longitude: -49.2800 },
        { latitude: -25.4375, longitude: -49.2810 }, // Ending at shopping mall (Batel area)
      ]
    },
    {
      id: "3",
      mode: "leisure",
      color: "#16A085", // Turquoise
      coordinates: [
        // From shopping mall to park
        { latitude: -25.4375, longitude: -49.2810 }, // Starting from shopping
        { latitude: -25.4400, longitude: -49.2790 },
        { latitude: -25.4415, longitude: -49.2760 },
        { latitude: -25.4425, longitude: -49.2730 },
        { latitude: -25.4440, longitude: -49.2700 },
        { latitude: -25.4460, longitude: -49.2670 },
        { latitude: -25.4480, longitude: -49.2650 },
        { latitude: -25.4500, longitude: -49.2630 },
        { latitude: -25.4515, longitude: -49.2610 },
        { latitude: -25.4530, longitude: -49.2590 }, // Ending at park (Barigui Park area)
      ]
    },
    {
      id: "4",
      mode: "education",
      color: "#8E44AD", // Dark Purple
      coordinates: [
        // From park back home (completing the circle)
        { latitude: -25.4530, longitude: -49.2590 }, // Starting from park
        { latitude: -25.4520, longitude: -49.2560 },
        { latitude: -25.4505, longitude: -49.2530 },
        { latitude: -25.4485, longitude: -49.2510 },
        { latitude: -25.4465, longitude: -49.2490 },
        { latitude: -25.4445, longitude: -49.2470 },
        { latitude: -25.4425, longitude: -49.2450 },
        { latitude: -25.4410, longitude: -49.2440 },
        { latitude: -25.4400, longitude: -49.2430 },
        { latitude: -25.4390, longitude: -49.2420 }, // Ending back at home
      ]
    },
  ];

  return (
    <>
      <MapComponent trajectories={purposeTrajectories} />
      <TouchableOpacity 
        style={styles.button}
        onPress={() => router.push('/finish')}
      >
        <ThemedText style={styles.buttonText}>3</ThemedText>
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