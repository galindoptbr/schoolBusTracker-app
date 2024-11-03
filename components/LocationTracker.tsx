import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import * as Location from "expo-location";
import { db } from "../services/firebase";
import { doc, setDoc } from "firebase/firestore";
import useAuth from "../hooks/useAuth";

interface Coordinates {
  latitude: number;
  longitude: number;
}

const LocationTracker: React.FC = () => {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const requestLocationPermission = async () => {
      // Pedir permissão de localização
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Permissão para acessar localização foi negada");
        return;
      }

      // Obter a localização atual
      try {
        let location = await Location.getCurrentPositionAsync({});
        setCoordinates({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch (err) {
        setError("Erro ao obter localização");
      }
    };

    requestLocationPermission();
  }, []);

  useEffect(() => {
    const saveLocation = async () => {
      if (coordinates && user) {
        try {
          await setDoc(doc(db, "locations", user.uid), {
            driverId: user.uid,
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
            timestamp: new Date(),
          });
        } catch (e) {
          console.error("Erro ao salvar localização:", e);
        }
      }
    };

    if (coordinates && user) {
      saveLocation(); // Salva quando obtiver novas coordenadas
    }
  }, [coordinates, user]);

  return (
    <View style={{ padding: 16 }}>
      {error ? (
        <Text style={{ color: "red" }}>Erro: {error}</Text>
      ) : coordinates ? (
        <Text>
          Latitude: {coordinates.latitude}, Longitude: {coordinates.longitude}
        </Text>
      ) : (
        <Text>Obtendo localização...</Text>
      )}
    </View>
  );
};

export default LocationTracker;
