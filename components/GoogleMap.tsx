import React from "react";
import MapView, { Marker } from "react-native-maps";
import { View } from "react-native";

interface GoogleMapProps {
  lat: number;
  lng: number;
}

const GoogleMapComponent: React.FC<GoogleMapProps> = ({ lat, lng }) => {
  if (!lat || !lng) {
    // Se latitude ou longitude não forem válidos, não renderizar o mapa
    return null;
  }

  return (
    <View
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
      }}
    >
      <MapView
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        }}
        initialRegion={{
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker coordinate={{ latitude: lat, longitude: lng }} />
      </MapView>
    </View>
  );
};

export default GoogleMapComponent;
