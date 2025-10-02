import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Callout, Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';

// Define the coordinate type
export interface Coordinate {
  latitude: number;
  longitude: number;
}

// Define trajectory type
export interface Trajectory {
  id: string;
  mode: string; 
  color: string;
  coordinates: Coordinate[];
  date?: string;
  time?: string;
  startTime?: string;
  endTime?: string;
}

// Define mode button type
export interface ModeButton {
  id: string;
  mode: string;
  iconPath: any;
  color: string;
}

export interface BaseMapComponentProps {
  trajectories?: Trajectory[];
  modeButtons?: ModeButton[];
  onModeChange?: (itemId: string, newMode: string, newColor: string) => void;
  showLines?: boolean;
  children?: React.ReactNode;
  renderMarker?: (trajectory: Trajectory, isStart: boolean) => React.ReactNode;
}

export default function BaseMapComponent({ 
  trajectories = [], 
  modeButtons = [],
  onModeChange,
  showLines = true,
  children,
  renderMarker
}: BaseMapComponentProps) {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  
  // Curitiba coordinates
  const curitibaRegion = {
    latitude: -25.4290,
    longitude: -49.2671,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  // Handle item selection (trajectory or marker)
  const handleItemPress = (itemId: string) => {
    setSelectedItem(itemId === selectedItem ? null : itemId);
    
    // If both item and mode are selected, change the mode
    if (selectedMode && itemId !== selectedItem) {
      const selectedModeButton = modeButtons.find(mode => mode.id === selectedMode);
      if (selectedModeButton && onModeChange) {
        // Apply the mode change
        onModeChange(itemId, selectedModeButton.mode, selectedModeButton.color);
        
        // Reset both selections after changing the mode
        setSelectedItem(null);
        setSelectedMode(null);
      }
    }
  };
  
  // Handle mode button press
  const handleModePress = (modeId: string) => {
    setSelectedMode(modeId === selectedMode ? null : modeId);
    
    // If both item and mode are selected, change the mode
    if (selectedItem && modeId !== selectedMode) {
      const selectedModeButton = modeButtons.find(mode => mode.id === modeId);
      if (selectedModeButton && onModeChange) {
        // Apply the mode change
        onModeChange(selectedItem, selectedModeButton.mode, selectedModeButton.color);
        
        // Reset both selections after changing the mode
        setSelectedItem(null);
        setSelectedMode(null);
      }
    }
  };

  // Default marker rendering
  const defaultRenderMarker = (trajectory: Trajectory, isStart: boolean) => {
    // Only render end markers if showLines is true
    if (!isStart && !showLines) return null;
    
    const coordinate = isStart 
      ? trajectory.coordinates[0] 
      : trajectory.coordinates[trajectory.coordinates.length - 1];
      
    return (
      <Marker
        key={`${isStart ? 'start' : 'end'}-${trajectory.id}`}
        coordinate={coordinate}
        title={`${isStart ? (showLines ? 'Start: ' : '') : 'End: '}${trajectory.mode}`}
        pinColor={isStart ? trajectory.color : 'black'}
        onPress={() => handleItemPress(trajectory.id)}
      >
        {isStart && !showLines && (
          <Callout tooltip>
            <View style={styles.callout}>
              <Text style={styles.calloutTitle}>{trajectory.mode}</Text>
              {trajectory.date && <Text style={styles.calloutText}>Date: {trajectory.date}</Text>}
              {trajectory.time && <Text style={styles.calloutText}>Time: {trajectory.time}</Text>}
            </View>
          </Callout>
        )}
      </Marker>
    );
  };

  return (
    <View style={styles.container}>
      <MapView 
        provider={PROVIDER_GOOGLE} 
        style={styles.map} 
        initialRegion={curitibaRegion}
      >
        {/* Render trajectories as polylines if showLines is true */}
        {showLines && trajectories.map((trajectory) => (
          <Polyline
            key={trajectory.id}
            coordinates={trajectory.coordinates}
            strokeColor={trajectory.color}
            strokeWidth={selectedItem === trajectory.id ? 10 : 4}
            onPress={() => handleItemPress(trajectory.id)}
            tappable={true}
          />
        ))}

        {/* Render markers */}
        {trajectories.map((trajectory) => (
          trajectory.coordinates.length > 0 && (
            <>
              {/* Start marker */}
              {renderMarker 
                ? renderMarker(trajectory, true) 
                : defaultRenderMarker(trajectory, true)
              }
              
              {/* End marker (only for transport mode) */}
              {showLines && (
                renderMarker 
                  ? renderMarker(trajectory, false) 
                  : defaultRenderMarker(trajectory, false)
              )}
            </>
          )
        ))}

        {/* Default marker for Curitiba center if no trajectories */}
        {trajectories.length === 0 && (
          <Marker coordinate={{ latitude: curitibaRegion.latitude, longitude: curitibaRegion.longitude }} />
        )}
      </MapView>
      
      {/* Mode buttons (transport or purpose) - horizontal at bottom */}
      <View style={styles.overlayButtonsContainer}>
        {modeButtons.map((mode) => (
          <View key={mode.id} style={styles.buttonWrapper}>
            <TouchableOpacity
              style={[
                styles.modeButton,
                { backgroundColor: mode.color },
                selectedMode === mode.id && styles.selectedModeButton
              ]}
              onPress={() => handleModePress(mode.id)}
            >
              <Image source={mode.iconPath} style={styles.modeIcon} />
            </TouchableOpacity>
          </View>
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
  buttonWrapper: {
    marginHorizontal: 8,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modeButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  selectedModeButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: 'white',
  },
  modeIcon: {
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