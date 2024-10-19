import { useEffect, useState } from "react"; // Importar useState para controle do carregamento
import { Image, Platform } from "react-native";
import { useRouter } from "expo-router";
import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import useAuth from "@/hooks/useAuth";

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);

  useEffect(() => {
    if (user === undefined) {
      // Se o estado do usuário ainda não foi determinado, mantemos o carregamento
      setIsAuthLoaded(false);
    } else {
      setIsAuthLoaded(true);
    }
  }, [user]);

  useEffect(() => {
    if (isAuthLoaded && !user) {
      router.replace("/auth/login");
    }
  }, [isAuthLoaded, user]);

  if (!isAuthLoaded) {
    // Se o estado da autenticação ainda está carregando, podemos mostrar uma tela de carregamento
    return (
      <ThemedView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={{
            height: 178,
            width: 290,
            bottom: 0,
            left: 0,
            position: "absolute",
          }}
        />
      }
    >
      <ThemedView
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
        }}
      >
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
    </ParallaxScrollView>
  );
}
