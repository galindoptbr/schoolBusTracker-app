import React from "react";
import useAuth from "../../hooks/useAuth";
import { View, Text, ActivityIndicator } from "react-native";
import { Redirect } from "expo-router";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  if (user === undefined) {
    // Renderiza um indicador de carregamento até que saibamos se há um usuário logado
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/auth/login" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
