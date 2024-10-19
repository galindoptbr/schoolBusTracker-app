import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import useAuth from "../../hooks/useAuth";
import { Link } from "expo-router";

const Login: React.FC = () => {
  const { login, error, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    login(email, password);
  };

  // Adiciona um log temporário para ver o estado do usuário
  console.log("User logged in:", user);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Login</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ height: 40, width: '80%', borderColor: "gray", borderWidth: 1, marginBottom: 10, padding: 10 }}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ height: 40, width: '80%', borderColor: "gray", borderWidth: 1, marginBottom: 20, padding: 10 }}
      />
      <Button title="Entrar" onPress={handleLogin} />
      {error && <Text style={{ color: "red", marginTop: 10 }}>{error}</Text>}
      <View style={{ marginTop: 20, alignItems: "center" }}>
        <Text>ainda na possui um cadastro</Text>
        <Link href="/auth/signup" style={{ color: "blue", marginTop: 10 }}>
          Cadastre-se
        </Link>
      </View>
    </View>
  );
};

export default Login;
