import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "../../services/firebase";

const Signup: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isParent, setIsParent] = useState(false);
  const [isDriver, setIsDriver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignUp = async () => {
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Salvar informações do usuário no Firestore usando setDoc com o UID do usuário
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name,
        email,
        phone: "", // Podemos adicionar campos vazios que poderão ser preenchidos depois
        address: "",
        children: [],
        role: isParent ? "pai" : isDriver ? "motorista" : "indefinido",
      });

      // Se o usuário for um motorista, adicionar também à coleção "drivers"
      if (isDriver) {
        await setDoc(doc(db, "drivers", user.uid), {
          uid: user.uid,
          name,
          email,
        });
      }

      router.push("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocorreu um erro desconhecido.");
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
          Cadastre-se
        </Text>
        {error ? (
          <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>
        ) : null}
        <View style={{ marginBottom: 15 }}>
          <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 5 }}>
            Nome Completo
          </Text>
          <TextInput
            placeholder="Nome Completo"
            value={name}
            onChangeText={setName}
            style={{
              height: 40,
              borderColor: "#d1d5db",
              borderWidth: 1,
              borderRadius: 5,
              padding: 10,
            }}
          />
        </View>
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
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 5 }}>
            Tipo de Perfil
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setIsParent(!isParent);
                if (!isParent) setIsDriver(false); // Desmarca motorista se selecionar pai
              }}
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <View
                style={{
                  height: 20,
                  width: 20,
                  borderRadius: 3,
                  borderWidth: 1,
                  borderColor: "#d1d5db",
                  marginRight: 10,
                  backgroundColor: isParent ? "#3b82f6" : "white",
                }}
              />
              <Text>Pai/Mãe</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              onPress={() => {
                setIsDriver(!isDriver);
                if (!isDriver) setIsParent(false); // Desmarca pai se selecionar motorista
              }}
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <View
                style={{
                  height: 20,
                  width: 20,
                  borderRadius: 3,
                  borderWidth: 1,
                  borderColor: "#d1d5db",
                  marginRight: 10,
                  backgroundColor: isDriver ? "#3b82f6" : "white",
                }}
              />
              <Text>Motorista</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          onPress={handleSignUp}
          style={{
            backgroundColor: "#3b82f6",
            paddingVertical: 12,
            borderRadius: 5,
          }}
        >
          <Text
            style={{ color: "white", textAlign: "center", fontWeight: "bold" }}
          >
            Cadastrar
          </Text>
        </TouchableOpacity>
        <View style={{ marginTop: 20, alignItems: "center" }}>
          <Text>Já possui uma conta?</Text>
          <TouchableOpacity
            onPress={() => router.push("/login")}
            style={{ marginTop: 10 }}
          >
            <Text style={{ color: "#3b82f6" }}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Signup;
