import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import useAuth from "../../hooks/useAuth";
import ParentProfileButton from "../../components/ParentProfileButton";
import LogoutButton from "../../components/LogoutButton";
import { useRouter } from "expo-router";
import Ionicons from "react-native-vector-icons/Ionicons"; // Importando Ionicons do react-native-vector-icons

const MenuPage: React.FC = () => {
  const { userData, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 24 }}>
      {/* Header da Página */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottomWidth: 2,
          borderBottomColor: "#e4e4e7",
          paddingBottom: 8,
          marginTop: 40,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 8 }}>
          {userData?.name || "Usuário"}
        </Text>
        <TouchableOpacity onPress={() => router.push("/")}>
          {/* Alteração do ícone para Ionicons */}
          <Ionicons name="chevron-back-outline" size={30} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Conteúdo Principal */}
      <ParentProfileButton />
      <LogoutButton />
    </View>
  );
};

export default MenuPage;
