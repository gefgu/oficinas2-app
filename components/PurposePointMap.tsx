import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from 'react-native-maps';

// Define the coordinate type
export interface Coordinate {
  latitude: number;
  longitude: number;
}

// Define purpose point type
export interface PurposePoint {
  id: string;
  purpose: string;
  color: string;
  coordinate: Coordinate;
  time?: string;
  date?: string;
}

// Define purpose button type (reusing ModeButton interface structure)
export interface PurposeButton {
  id: string;
  mode: string;
  iconPath: any;
  color: string;
}

export interface PurposePointMapProps {
  points: PurposePoint[];
  purposeButtons: PurposeButton[];
  onPurposeChange?: (pointId: string, newPurpose: string, newColor: string) => void;
  children?: React.ReactNode;
}

export default function PurposePointMap({
  points = [],
  purposeButtons = [],
  onPurposeChange,
  children
}: PurposePointMapProps) {
  const [selectedPoint, setSelectedPoint] = useState<string | null>(null);
  const [selectedPurpose, setSelectedPurpose] = useState<string | null>(null);
  const [markerPoints, setMarkerPoints] = useState<PurposePoint[]>(points);
  
  // Update internal state when external props change
  useEffect(() => {
    setMarkerPoints(points);
  }, [points]);
  
  // Curitiba coordinates
  const curitibaRegion = {
    latitude: -25.4290,
    longitude: -49.2671,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  // Handle point selection
  const handlePointPress = (pointId: string) => {
    setSelectedPoint(pointId === selectedPoint ? null : pointId);
    
    // If both point and purpose are selected, change the purpose
    if (selectedPurpose && pointId !== selectedPoint) {
      const selectedButton = purposeButtons.find(btn => btn.id === selectedPurpose);
      if (selectedButton && onPurposeChange) {
        // Update internal state first for immediate feedback
        setMarkerPoints(prev => 
          prev.map(point => 
            point.id === pointId 
              ? { ...point, purpose: selectedButton.mode, color: selectedButton.color } 
              : point
          )
        );
        
        // Then notify parent component
        onPurposeChange(pointId, selectedButton.mode, selectedButton.color);
        
        // Reset both selections after changing
        setSelectedPoint(null);
        setSelectedPurpose(null);
      }
    }
  };
  
  // Handle purpose button press
  const handlePurposePress = (purposeId: string) => {
    setSelectedPurpose(purposeId === selectedPurpose ? null : purposeId);
    
    // If both point and purpose are selected, change the purpose
    if (selectedPoint && purposeId !== selectedPurpose) {
      const selectedButton = purposeButtons.find(btn => btn.id === purposeId);
      if (selectedButton && onPurposeChange) {
        // Update internal state first for immediate feedback
        setMarkerPoints(prev => 
          prev.map(point => 
            point.id === selectedPoint 
              ? { ...point, purpose: selectedButton.mode, color: selectedButton.color } 
              : point
          )
        );
        
        // Then notify parent component
        onPurposeChange(selectedPoint, selectedButton.mode, selectedButton.color);
        
        // Reset both selections after changing
        setSelectedPoint(null);
        setSelectedPurpose(null);
      }
    }
  };

  return (
    <View style={styles.container}>
      <MapView 
        provider={PROVIDER_GOOGLE} 
        style={styles.map} 
        initialRegion={curitibaRegion}
      >
        {/* Render purpose points as markers */}
        {markerPoints.map((point) => (
          <Marker
            key={`marker-${point.id}-${point.purpose}`} // Add purpose to key for re-rendering
            coordinate={point.coordinate}
            pinColor={point.color}
            onPress={() => handlePointPress(point.id)}
          >
            <Callout tooltip>
              <View style={styles.callout}>
                <Text style={[styles.calloutTitle, {color: point.color}]}>
                  {point.purpose}
                </Text>
                {point.date && <Text style={styles.calloutText}>Date: {point.date}</Text>}
                {point.time && <Text style={styles.calloutText}>Time: {point.time}</Text>}
              </View>
            </Callout>
          </Marker>
        ))}

        {/* Default marker for Curitiba center if no points */}
        {markerPoints.length === 0 && (
          <Marker coordinate={{ latitude: curitibaRegion.latitude, longitude: curitibaRegion.longitude }} />
        )}
      </MapView>
      
      {/* Purpose buttons - horizontal at bottom */}
      <View style={styles.overlayButtonsContainer}>
        {purposeButtons.map((button) => (
          <TouchableOpacity
            key={button.id}
            style={[
              styles.purposeButton,
              { backgroundColor: button.color },
              selectedPurpose === button.id && styles.selectedPurposeButton
            ]}
            onPress={() => handlePurposePress(button.id)}
          >
            <Image source={button.iconPath} style={styles.purposeIcon} />
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Navigation button container */}
      <View style={styles.navigationButtonContainer}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  overlayButtonsContainer: {
    position: 'absolute',
    bottom: 160,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  purposeButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  selectedPurposeButton: {
    borderWidth: 3,
    borderColor: 'white',
  },
  purposeIcon: {
    width: 30,
    height: 30,
    tintColor: 'white',
  },
  navigationButtonContainer: {
    position: 'absolute',
    bottom: 75,
    width: '100%',
    alignItems: 'center',
  },
  callout: {
    width: 160,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  calloutTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
    textTransform: 'capitalize',
  },
  calloutText: {
    fontSize: 14,
  },
});