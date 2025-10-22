import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';
import { Dimensions, Image, ImageBackground, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function FinishScreen() {
  const router = useRouter();

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

          <ThemedView style={styles.messageContainer}>
            <ThemedText style={styles.thankYouText}>
              Obrigado!
            </ThemedText>
            <ThemedText style={styles.messageText}>
              Seus dados foram enviados com sucesso.
            </ThemedText>
          </ThemedView>

          {/* Back to Home Button */}
          <TouchableOpacity 
            style={styles.button}
            onPress={() => router.push('/')}
          >
            <ThemedText style={styles.buttonText}>
              Voltar ao Início
            </ThemedText>
          </TouchableOpacity>
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
    marginBottom: 20,
  },
  title: {
    fontSize: responsiveFontSize,
    fontFamily: 'Montserrat-Bold',
    textAlign: 'center',
    lineHeight: responsiveFontSize * 1,
  },
  compassIcon: {
    width: responsiveFontSize * 0.9,
    height: responsiveFontSize * 0.9,
    marginLeft: 10,
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: 40,
    backgroundColor: 'transparent',
  },
  thankYouText: {
    fontSize: responsiveFontSize * 0.8,
    fontFamily: 'Montserrat-Bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#4CAF50',
    lineHeight: responsiveFontSize * 1,
  },
  messageText: {
    fontSize: responsiveFontSize * 0.4,
    fontFamily: 'Montserrat-Regular',
    textAlign: 'center',
    opacity: 0.9,
  },
  button: {
    backgroundColor: '#0a7ea4',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
    textAlign: 'center',
  },
});