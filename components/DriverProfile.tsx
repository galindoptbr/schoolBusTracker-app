import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import useAuth from "../hooks/useAuth";
import LocationTracker from "./LocationTracker";
import LogoutButton from "./LogoutButton";

interface Child {
  name: string;
  age: number;
  checkedIn: boolean;
  driverId?: string;
}

const DriverProfile: React.FC = () => {
  const { user } = useAuth();
  const [childrenList, setChildrenList] = useState<Child[]>([]);
  const [isSharingLocation, setIsSharingLocation] = useState<boolean>(false);

  useEffect(() => {
    const fetchChildren = async () => {
      if (user) {
        try {
          // Buscar todos os documentos na coleção "users"
          const usersQuery = collection(db, "users");
          const usersSnapshot = await getDocs(usersQuery);

          const associatedChildren: Child[] = [];

          // Iterar por cada documento dos pais para buscar crianças com driverId igual ao do motorista
          usersSnapshot.forEach((doc) => {
            const data = doc.data();
            if (Array.isArray(data.children)) {
              data.children.forEach(
                (child: { name: string; age: number; driverId?: string }) => {
                  if (child.driverId === user.uid) {
                    associatedChildren.push({
                      name: child.name,
                      age: child.age,
                      checkedIn: false, // Inicialmente não marcado
                    });
                  }
                }
              );
            }
          });

          setChildrenList(associatedChildren);
        } catch (error) {
          console.error("Erro ao buscar crianças:", error);
        }
      }
    };

    fetchChildren();
  }, [user]);

  const handleCheckIn = async (childIndex: number) => {
    if (user) {
      try {
        const updatedChildren = [...childrenList];
        updatedChildren[childIndex].checkedIn = true;
        setChildrenList(updatedChildren);

        // Iniciar o compartilhamento de localização
        setIsSharingLocation(true);

        // Atualizar o estado no Firestore para indicar que a viagem começou
        const driverDocRef = doc(db, "drivers", user.uid);
        await updateDoc(driverDocRef, {
          isSharingLocation: true,
        });
      } catch (error) {
        console.error("Erro ao dar check-in na criança:", error);
      }
    }
  };

  const handleEndTrip = async () => {
    // Finalizar o compartilhamento de localização
    setIsSharingLocation(false);

    // Remover o check-in de todas as crianças
    const updatedChildren = childrenList.map((child) => ({
      ...child,
      checkedIn: false,
    }));
    setChildrenList(updatedChildren);

    // Atualizar o estado no Firestore para indicar que a viagem terminou
    if (user) {
      const driverDocRef = doc(db, "drivers", user.uid);
      await updateDoc(driverDocRef, {
        isSharingLocation: false,
      });
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f3f4f6",
        padding: 20,
      }}
    >
      <LogoutButton />
      <View
        style={{
          width: "100%",
          maxWidth: 400,
          padding: 20,
          backgroundColor: "white",
          borderRadius: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          Perfil do Motorista
        </Text>
        <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 10 }}>
          Lista de Crianças
        </Text>
        <FlatList
          data={childrenList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <Text style={{ flex: 1, fontSize: 16 }}>
                <Text style={{ fontWeight: "bold" }}>Nome:</Text> {item.name} |{" "}
                <Text style={{ fontWeight: "bold" }}>Idade:</Text> {item.age}
              </Text>
              <TouchableOpacity
                onPress={() => handleCheckIn(index)}
                style={{
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  borderRadius: 5,
                  backgroundColor: item.checkedIn ? "#22c55e" : "#3b82f6",
                }}
                disabled={item.checkedIn}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  {item.checkedIn ? "Presente" : "Dar Check-in"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
        {isSharingLocation && (
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 10 }}>
              Localização Atual
            </Text>
            <LocationTracker />
          </View>
        )}
        <TouchableOpacity
          onPress={handleEndTrip}
          style={{
            marginTop: 20,
            backgroundColor: "#ef4444",
            paddingVertical: 10,
            borderRadius: 5,
          }}
        >
          <Text
            style={{ color: "white", fontWeight: "bold", textAlign: "center" }}
          >
            Finalizar Viagem
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DriverProfile;
