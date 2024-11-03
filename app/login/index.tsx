import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "expo-router";
import { auth } from "../../services/firebase";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>(""); // Tipagem explícita da string
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/"); // Redireciona para a página inicial após o login
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message); // Usar a mensagem de erro se `error` for uma instância de `Error`
      } else {
        setError("Erro ao fazer login. Verifique suas credenciais.");
      }
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#f3f4f6",
      }}
    >
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
          Login
        </Text>
        {error ? (
          <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>
        ) : null}
        <View style={{ marginBottom: 15 }}>
          <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 5 }}>
            Email
          </Text>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={{
              height: 40,
              borderColor: "#d1d5db",
              borderWidth: 1,
              borderRadius: 5,
              padding: 10,
            }}
            keyboardType="email-address"
            autoCapitalize="none" // Prevenir capitalização automática
            autoCorrect={false} // Desabilitar autocorreção para garantir precisão ao digitar e-mails
          />
        </View>
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 5 }}>
            Senha
          </Text>
          <TextInput
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={{
              height: 40,
              borderColor: "#d1d5db",
              borderWidth: 1,
              borderRadius: 5,
              padding: 10,
            }}
          />
        </View>
        <TouchableOpacity
          onPress={handleLogin}
          style={{
            backgroundColor: "#3b82f6",
            paddingVertical: 12,
            borderRadius: 5,
          }}
        >
          <Text
            style={{ color: "white", textAlign: "center", fontWeight: "bold" }}
          >
            Entrar
          </Text>
        </TouchableOpacity>
        <View style={{ marginTop: 20, alignItems: "center" }}>
          <Text>Não tem uma conta?</Text>
          <TouchableOpacity
            onPress={() => router.push("/signup")}
            style={{ marginTop: 10 }}
          >
            <Text style={{ color: "#3b82f6" }}>Cadastre-se</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Login;
