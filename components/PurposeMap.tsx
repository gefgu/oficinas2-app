<<<<<<< HEAD
import React, { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Callout } from 'react-native-maps';
import { ThemedText } from '@/components/ThemedText';

// Define the coordinate type
export interface Coordinate {
  latitude: number;
  longitude: number;
}

// Define visit point type for map display
export interface VisitPoint {
  id: string;
  uid: number;
  trip_number: number;
  coordinate: Coordinate;
  purpose: string;
  arrive_time: string;
  depart_time: string;
  color: string;
}

// Define purpose button type
export interface PurposeButton {
  id: string;
  purpose: string;
  iconPath: any;
  color: string;
  label: string;
}

interface PurposeMapProps {
  visits?: VisitPoint[];
  purposeButtons?: PurposeButton[];
  onVisitPurposeChange?: (visitId: string, newPurpose: string, newColor: string) => void;
  children?: React.ReactNode;
}

export default function PurposeMap({ 
  visits = [], 
  purposeButtons = [],
  onVisitPurposeChange,
  children 
}: PurposeMapProps) {
  const [selectedVisit, setSelectedVisit] = useState<string | null>(null);
  const [selectedPurpose, setSelectedPurpose] = useState<string | null>(null);
  
  // Curitiba coordinates
  const curitibaRegion = {
    latitude: -25.4290,
    longitude: -49.2671,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  // Handle visit marker selection
  const handleVisitPress = (visitId: string) => {
    setSelectedVisit(visitId === selectedVisit ? null : visitId);
    
    // If both visit and purpose are selected, change the purpose
    if (selectedPurpose && visitId !== selectedVisit) {
      const selectedPurposeButton = purposeButtons.find(purpose => purpose.id === selectedPurpose);
      if (selectedPurposeButton && onVisitPurposeChange) {
        // Apply the purpose change
        onVisitPurposeChange(visitId, selectedPurposeButton.purpose, selectedPurposeButton.color);
        
        // Reset both selections after changing the visit purpose
        setSelectedVisit(null);
        setSelectedPurpose(null);
      }
    }
  };
  
  // Handle purpose button press
  const handlePurposePress = (purposeId: string) => {
    setSelectedPurpose(purposeId === selectedPurpose ? null : purposeId);
    
    // If both visit and purpose are selected, change the purpose
    if (selectedVisit && purposeId !== selectedPurpose) {
      const selectedPurposeButton = purposeButtons.find(purpose => purpose.id === purposeId);
      if (selectedPurposeButton && onVisitPurposeChange) {
        // Apply the purpose change
        onVisitPurposeChange(selectedVisit, selectedPurposeButton.purpose, selectedPurposeButton.color);
        
        // Reset both selections after changing the visit purpose
        setSelectedVisit(null);
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
        {/* Render visit markers */}
        {visits.map((visit) => (
          <Marker
            key={`visit-${visit.id}-${visit.purpose}-${visit.color}`} // Add purpose and color to force re-render
            coordinate={visit.coordinate}
            title={`Trip ${visit.trip_number} - ${visit.purpose || 'Not set'}`}
            description={`${new Date(visit.arrive_time).toLocaleTimeString()} - ${new Date(visit.depart_time).toLocaleTimeString()}`}
            pinColor={visit.color}
            onPress={() => handleVisitPress(visit.id)}
          >
            {/* <Callout>
              <View style={styles.callout}>
                <ThemedText style={[styles.calloutTitle, { color: visit.color }]}>
                  Trip {visit.trip_number}
                </ThemedText>
                <ThemedText style={styles.calloutText}>
                  Purpose: {visit.purpose || 'Not set'}
                </ThemedText>
                <ThemedText style={styles.calloutText}>
                  Arrive: {new Date(visit.arrive_time).toLocaleTimeString()}
                </ThemedText>
                <ThemedText style={styles.calloutText}>
                  Depart: {new Date(visit.depart_time).toLocaleTimeString()}
                </ThemedText>
              </View>
            </Callout> */}
          </Marker>
        ))}

        {/* Default marker for Curitiba center if no visits */}
        {visits.length === 0 && (
          <Marker coordinate={{ latitude: curitibaRegion.latitude, longitude: curitibaRegion.longitude }} />
        )}
      </MapView>
      
      {/* Purpose buttons - horizontal at bottom */}
      <View style={styles.overlayButtonsContainer}>
        {purposeButtons.map((purpose) => (
          <TouchableOpacity
            key={purpose.id}
            style={[
              styles.purposeButton,
              { backgroundColor: purpose.color },
              selectedPurpose === purpose.id && styles.selectedPurposeButton
            ]}
            onPress={() => handlePurposePress(purpose.id)}
          >
            <Image source={purpose.iconPath} style={styles.purposeIcon} />
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Navigation button container */}
      <View style={styles.navigationButtonContainer}>
        {children}
      </View>
    </View>
=======
import React from 'react';
import { StyleSheet } from 'react-native';

import BaseMapComponent, { ModeButton, Trajectory } from './BaseMap';

export interface PurposeMapComponentProps {
  purposeMarkers: Trajectory[];
  purposeModes: ModeButton[];
  onPurposeChange: (markerId: string, newMode: string, newColor: string) => void;
  children?: React.ReactNode;
}

export default function PurposeMapComponent({
  purposeMarkers,
  purposeModes,
  onPurposeChange,
  children
}: PurposeMapComponentProps) {
  return (
    <BaseMapComponent 
      trajectories={purposeMarkers}
      modeButtons={purposeModes}
      onModeChange={onPurposeChange}
      showLines={false}
      renderMarker={renderPurposeMarker}
      children={children}
    />
>>>>>>> master
  );
}

const styles = StyleSheet.create({
<<<<<<< HEAD
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  overlayButtonsContainer: {
    position: 'absolute',
    bottom: 180,
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
    bottom: 60,
    width: '100%',
    alignSelf: 'center',
  },
  callout: {
    padding: 10,
    minWidth: 200,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  calloutText: {
    fontSize: 12,
    marginBottom: 2,
    opacity: 0.8,
=======
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
>>>>>>> master
  },
});