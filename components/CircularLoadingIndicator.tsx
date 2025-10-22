import { useEffect, useRef } from "react";
import { Animated, Image, StyleSheet, View } from "react-native";

// Custom Loading Indicator Component
const CircularLoadingIndicator = () => {
    const numberOfDots = 8;
    const rotationValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(rotationValue, {
                toValue: numberOfDots,
                duration: numberOfDots * 150,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    return (
        <View style={styles.loadingIconContainer}>
            {Array.from({ length: numberOfDots }).map((_, index) => {
                const angle = (index * 360) / numberOfDots;
                const radius = 35;
                const x = radius * Math.cos((angle * Math.PI) / 180);
                const y = radius * Math.sin((angle * Math.PI) / 180);

                // Calculate opacity based on the rotation value
                const inputRange = [];
                const outputRangeOpacity = [];
                const outputRangeScale = [];
                
                for (let i = 0; i <= numberOfDots; i++) {
                    inputRange.push(i);
                    // Distance from current dot
                    const distance = Math.min(
                        Math.abs(i - index),
                        numberOfDots - Math.abs(i - index)
                    );
                    // Only the active dot is bright white, others are gray
                    outputRangeOpacity.push(distance === 0 ? 1 : 0.25);
                    outputRangeScale.push(distance === 0 ? 1.4 : 1);
                }

                const opacity = rotationValue.interpolate({
                    inputRange,
                    outputRange: outputRangeOpacity,
                });

                const scale = rotationValue.interpolate({
                    inputRange,
                    outputRange: outputRangeScale,
                });

                return (
                    <Animated.View
                        key={index}
                        style={[
                            styles.loadingDot,
                            {
                                opacity,
                                transform: [
                                    { translateX: x },
                                    { translateY: y },
                                    { scale },
                                ],
                            },
                        ]}
                    />
                );
            })}
            <Image
                source={require('../assets/icons/compass.png')}
                style={styles.loadingCompassIcon}
                resizeMode="contain"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    loadingIconContainer: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  loadingDot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
  loadingCompassIcon: {
    width: 40,
    height: 40,
    position: 'absolute',
  },
});


export default CircularLoadingIndicator;