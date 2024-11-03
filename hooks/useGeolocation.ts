import { useState, useEffect } from "react";
import { Platform } from "react-native";
import Geolocation from "@react-native-community/geolocation";

interface Coordinates {
  latitude: number;
  longitude: number;
}

const useGeolocation = () => {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (Platform.OS === "android") {
      Geolocation.setRNConfiguration({
        skipPermissionRequests: false,
        authorizationLevel: "whenInUse",
      });
    }

    const watchId = Geolocation.watchPosition(
      (position) => {
        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (err) => setError(err.message),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );

    return () => {
      if (watchId) {
        Geolocation.clearWatch(watchId);
      }
    };
  }, []);

  return { coordinates, error };
};

export default useGeolocation;
