import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import ParentProfile from "../../components/ParentProfile";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../services/firebase";
import useAuth from "../../hooks/useAuth";

const ParentProfilePage: React.FC = () => {
  const { user, loading } = useAuth();
  const [profileData, setProfileData] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    children?: { name: string; age: number }[];
  } | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setProfileData(docSnap.data());
          } else {
            console.error("Documento não encontrado para o usuário.");
          }
        } catch (error) {
          console.error("Erro ao buscar dados do perfil:", error);
        }
      }
    };

    if (!loading && user) {
      fetchProfileData().catch((error) => {
        console.error("Erro ao executar fetchProfileData:", error);
      });
    }
  }, [user, loading]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!profileData) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Erro ao carregar os dados do perfil.</Text>
      </View>
    );
  }

  return (
    <ParentProfile
      name={profileData.name || ""}
      email={profileData.email || ""}
      phone={profileData.phone || ""}
      address={profileData.address || ""}
      childList={profileData.children || []}
    />
  );
};

export default ParentProfilePage;
