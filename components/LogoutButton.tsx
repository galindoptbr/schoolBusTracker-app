import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { signOut } from "firebase/auth";
import { useRouter } from "expo-router";
import Ionicons from "react-native-vector-icons/Ionicons"; // Importando Ionicons do react-native-vector-icons
import { auth } from "../services/firebase"; // Use a instância exportada do Firebase

const LogoutButton: React.FC = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login"); // Redireciona para a página de login após logout
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <TouchableOpacity
      onPress={handleLogout}
      style={{ flexDirection: "row", alignItems: "center", marginTop: 16 }}
    >
      <View style={{ marginRight: 8 }}>
        {/* Substituição do ícone MaterialIcons por Ionicons */}
        <Ionicons name="log-out-outline" size={25} color="black" />
      </View>
      <Text style={{ fontSize: 18, color: "black" }}>Deslogar</Text>
    </TouchableOpacity>
  );
};

export default LogoutButton;
