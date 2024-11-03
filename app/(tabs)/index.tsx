import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/services/firebase";
import useAuth from "@/hooks/useAuth";
import DriverProfile from "@/components/DriverProfile";
import MenuButton from "@/components/MenuButton";
import GoogleMapComponent from "@/components/GoogleMap";

const HomeScreen: React.FC = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  const [userRole, setUserRole] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [isChildOnTheWay, setIsChildOnTheWay] = useState<boolean>(false);

  // Fetch do papel do usuário após logar
  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserRole(data.role || null);
            console.log("Papel do usuário:", data.role);
          }
        } catch (error) {
          console.error("Erro ao buscar papel do usuário:", error);
        }
      } else if (!loading && !isAuthenticated) {
        // Se o usuário não está logado, redirecionar para a tela de login
        router.push("/login");
      }
    };

    fetchUserRole();
  }, [user, loading, isAuthenticated, router]);

  // Ouvinte para localização das crianças e motorista
  useEffect(() => {
    let unsubscribeLocation: (() => void) | null = null;
    let unsubscribeDriver: (() => void) | null = null;

    if (isAuthenticated && user && userRole === "pai") {
      const fetchChildLocation = async () => {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.children) {
              console.log("Crianças encontradas:", data.children);

              for (const child of data.children) {
                if (child.driverId) {
                  // Ouvinte para status do motorista
                  const driverDocRef = doc(db, "drivers", child.driverId);
                  unsubscribeDriver = onSnapshot(
                    driverDocRef,
                    (driverDocSnap) => {
                      if (driverDocSnap.exists()) {
                        const driverData = driverDocSnap.data();
                        if (driverData.isSharingLocation) {
                          setIsChildOnTheWay(true);
                        } else {
                          setIsChildOnTheWay(false);
                        }
                      }
                    }
                  );

                  // Ouvinte para localização do motorista
                  const locationQuery = query(
                    collection(db, "locations"),
                    where("driverId", "==", child.driverId)
                  );

                  unsubscribeLocation = onSnapshot(
                    locationQuery,
                    (querySnapshot) => {
                      querySnapshot.forEach((locationDoc) => {
                        const locationData = locationDoc.data();
                        console.log(
                          "Localização atualizada para motorista:",
                          locationData
                        );
                        setLocation({
                          lat: locationData.latitude,
                          lng: locationData.longitude,
                        });
                      });
                    }
                  );
                }
              }
            }
          }
        } catch (error) {
          console.error("Erro ao buscar localização do motorista:", error);
        }
      };

      fetchChildLocation();
    }

    // Limpar os ouvintes em tempo real ao desmontar
    return () => {
      if (unsubscribeLocation) {
        unsubscribeLocation();
      }
      if (unsubscribeDriver) {
        unsubscribeDriver();
      }
    };
  }, [isAuthenticated, userRole, user]);

  // Mostrar a tela de carregamento enquanto os dados de autenticação são carregados
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={{ marginTop: 10 }}>Carregando...</Text>
      </View>
    );
  }

  // Mostrar o perfil do motorista se o papel do usuário for motorista
  if (userRole === "motorista") {
    return <DriverProfile />;
  }

  // Renderizar o conteúdo principal para pais
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          position: "absolute",
          top: 30,
          left: 20,
          zIndex: 10,
        }}
      >
        <MenuButton />
      </View>
      {location ? (
        <GoogleMapComponent lat={location.lat} lng={location.lng} />
      ) : (
        <Text>Localização ainda não disponível...</Text>
      )}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          backgroundColor: "#f8f8f8",
          width: "100%",
          height: "30%",
          alignItems: "center",
          padding: 20,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: isChildOnTheWay ? "#0000ff" : "#666",
          }}
        >
          {isChildOnTheWay
            ? "Seu filho está a caminho."
            : "Seu filho não está na carrinha."}
        </Text>
      </View>
    </View>
  );
};

export default HomeScreen;
