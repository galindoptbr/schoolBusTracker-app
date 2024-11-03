import React from "react";
import { TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/Ionicons";

const MenuButton: React.FC = () => {
  const router = useRouter();

  const handleMenu = () => {
    router.push("/menu");
  };

  return (
    <TouchableOpacity
      onPress={handleMenu}
      style={{
        marginTop: 60,
        paddingVertical: 8,
        paddingHorizontal: 8,
        backgroundColor: "#f5f5f5",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderRadius: 8,
      }}
    >
      <View>
        <Icon name="menu" size={30} color="#52525b" />
      </View>
    </TouchableOpacity>
  );
};

export default MenuButton;
