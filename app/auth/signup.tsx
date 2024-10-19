import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import useAuth from "../../hooks/useAuth";
import { Link } from "expo-router";

const Signup: React.FC = () => {
  const { signup, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = () => {
    signup(email, password);
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Cadastrar-se
      </Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{
          height: 40,
          width: "80%",
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 10,
          padding: 10,
        }}
      />
      <TextInput
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          height: 40,
          width: "80%",
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 20,
          padding: 10,
        }}
      />
      <Button title="Cadastrar" onPress={handleSignup} />
      {error && <Text style={{ color: "red", marginTop: 10 }}>{error}</Text>}
      <View style={{ marginTop: 20, alignItems: "center" }}>
        <Text>se ja possui um cadastro</Text>
        <Link href="/auth/login" style={{ color: "blue", marginTop: 10 }}>
          Faca Login
        </Link>
      </View>
    </View>
  );
};

export default Signup;
