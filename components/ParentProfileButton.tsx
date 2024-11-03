import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "react-native-vector-icons/Ionicons"; // Importando Ionicons do react-native-vector-icons

const ParentProfileButton: React.FC = () => {
  const router = useRouter();

  const handleProfile = () => {
    router.push("/parentprofilepage");
  };

  return (
    <TouchableOpacity
      onPress={handleProfile}
      style={{ flexDirection: "row", alignItems: "center", marginTop: 16 }}
    >
      <View style={{ marginRight: 8 }}>
        {/* Substituição do ícone por Ionicons */}
        <Ionicons name="person-outline" size={25} color="black" />
      </View>
      <Text style={{ fontSize: 18, color: "black" }}>Perfil</Text>
    </TouchableOpacity>
  );
};

export default ParentProfileButton;
