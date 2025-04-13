import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import {
  doc,
  updateDoc,
  arrayUnion,
  getDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "../services/firebase";
import useAuth from "../hooks/useAuth";

interface Child {
  name: string;
  age: number;
  driverId?: string;
}

interface ParentProfileProps {
  name: string;
  email: string;
  phone: string;
  address: string;
  childList: { name: string; age: number; driverId?: string }[];
}

const ParentProfile: React.FC<ParentProfileProps> = ({
  name,
  email,
  phone,
  address,
  childList,
}) => {
  const { user } = useAuth();
  const router = useRouter();
  const [newChildName, setNewChildName] = useState<string>("");
  const [newChildAge, setNewChildAge] = useState<number | "">("");
  const [selectedDriver, setSelectedDriver] = useState<string>("");
  const [driversList, setDriversList] = useState<{ id: string; name: string }[]>(
    []
  );
  const [isFetchingDrivers, setIsFetchingDrivers] = useState<boolean>(true);
  const [showPicker, setShowPicker] = useState<boolean>(false); // Controle de exibição do Picker
  const [currentPhone, setCurrentPhone] = useState<string>(phone);
  const [currentAddress, setCurrentAddress] = useState<string>(address);
  const [updatedPhone, setUpdatedPhone] = useState<string>("");
  const [updatedAddress, setUpdatedAddress] = useState<string>("");
  const [profileChildren, setProfileChildren] = useState<Child[]>(childList);

  useEffect(() => {
    setCurrentPhone(phone);
    setCurrentAddress(address);
    setProfileChildren(childList);
  }, [phone, address, childList]);

  useEffect(() => {
    const fetchDrivers = async () => {
      setIsFetchingDrivers(true); // Iniciar carregamento
      try {
        const querySnapshot = await getDocs(collection(db, "drivers"));
        const drivers = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        }));
        setDriversList(drivers);
      } catch (error) {
        console.error("Erro ao buscar motoristas:", error);
      } finally {
        setIsFetchingDrivers(false); // Finalizar carregamento
      }
    };

    fetchDrivers();
  }, []);

  const handleAddChild = async () => {
    if (user && newChildName && newChildAge !== "") {
      const docRef = doc(db, "users", user.uid);
      await updateDoc(docRef, {
        children: arrayUnion({
          name: newChildName,
          age: newChildAge,
          driverId: selectedDriver,
        }),
      });
      setNewChildName("");
      setNewChildAge("");
      setSelectedDriver("");

      // Recarregar os dados do documento após adicionar um filho
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const updatedData = docSnap.data();
        setProfileChildren(updatedData.children || []);
      }
    }
  };

  const handleUpdateProfile = async () => {
    if (user) {
      try {
        const docRef = doc(db, "users", user.uid);

        // Atualizar telefone e endereço no Firestore
        await updateDoc(docRef, {
          phone: updatedPhone,
          address: updatedAddress,
        });

        // Atualizar a exibição dos dados
        setCurrentPhone(updatedPhone);
        setCurrentAddress(updatedAddress);

        // Limpar os inputs
        setUpdatedPhone("");
        setUpdatedAddress("");
      } catch (error) {
        console.error("Erro ao atualizar perfil:", error);
      }
    }
  };

  // Função para voltar para a página inicial
  const handleGoBack = () => {
    router.push("/");
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f3f4f6",
        padding: 20,
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
          marginTop: 40,
        }}
      >
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
          Perfil de Pai/Mãe
        </Text>
        <View style={{ marginBottom: 16 }}>
          <Text style={{ marginBottom: 8 }}>
            <Text style={{ fontWeight: "bold" }}>Nome:</Text> {name}
          </Text>
          <Text style={{ marginBottom: 8 }}>
            <Text style={{ fontWeight: "bold" }}>Email:</Text> {email}
          </Text>
          <Text style={{ marginBottom: 8 }}>
            <Text style={{ fontWeight: "bold" }}>Telefone:</Text>{" "}
            {currentPhone || "N/A"}
          </Text>
          <Text style={{ marginBottom: 8 }}>
            <Text style={{ fontWeight: "bold" }}>Endereço:</Text>{" "}
            {currentAddress || "N/A"}
          </Text>
        </View>
        <Text style={{ fontSize: 20, fontWeight: "600", marginBottom: 10 }}>
          Filhos
        </Text>
        {profileChildren.map((child, index) => (
          <Text key={index} style={{ marginBottom: 8 }}>
            <Text style={{ fontWeight: "bold" }}>Nome:</Text> {child.name} |{" "}
            <Text style={{ fontWeight: "bold" }}>Idade:</Text> {child.age}
          </Text>
        ))}
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 10 }}>
            Atualizar dados
          </Text>
          <TextInput
            placeholder="Atualizar Telefone"
            value={updatedPhone}
            onChangeText={setUpdatedPhone}
            style={{
              height: 40,
              borderColor: "#d1d5db",
              borderWidth: 1,
              borderRadius: 5,
              padding: 10,
              marginBottom: 10,
            }}
          />
          <TextInput
            placeholder="Atualizar Endereço"
            value={updatedAddress}
            onChangeText={setUpdatedAddress}
            style={{
              height: 40,
              borderColor: "#d1d5db",
              borderWidth: 1,
              borderRadius: 5,
              padding: 10,
              marginBottom: 20,
            }}
          />
          <TouchableOpacity
            onPress={handleUpdateProfile}
            style={{
              backgroundColor: "#3b82f6",
              paddingVertical: 10,
              borderRadius: 5,
              marginBottom: 20,
            }}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Atualizar Perfil
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 10 }}>
            Adicionar Filho
          </Text>
          <TextInput
            placeholder="Nome do filho"
            value={newChildName}
            onChangeText={setNewChildName}
            style={{
              height: 40,
              borderColor: "#d1d5db",
              borderWidth: 1,
              borderRadius: 5,
              padding: 10,
              marginBottom: 10,
            }}
          />
          <TextInput
            placeholder="Idade do filho"
            value={newChildAge.toString()}
            onChangeText={(value) => setNewChildAge(Number(value) || "")}
            keyboardType="numeric"
            style={{
              height: 40,
              borderColor: "#d1d5db",
              borderWidth: 1,
              borderRadius: 5,
              padding: 10,
              marginBottom: 10,
            }}
          />
          <TouchableOpacity
            onPress={() => setShowPicker(!showPicker)} // Alterna a exibição do Picker
            style={{
              backgroundColor: "#d1d5db",
              borderRadius: 5,
              paddingVertical: 10,
              paddingHorizontal: 12,
              marginBottom: 10,
            }}
          >
            <Text style={{ color: "#333" }}>
              {selectedDriver
                ? driversList.find((driver) => driver.id === selectedDriver)?.name
                : "Selecione um Motorista"}
            </Text>
          </TouchableOpacity>
          {showPicker && (
            <Picker
              selectedValue={selectedDriver}
              onValueChange={(itemValue: string) => {
                setSelectedDriver(itemValue);
                setShowPicker(false); // Oculta o Picker após a seleção
              }}
              style={{
                height: 40,
                borderColor: "#d1d5db",
                borderWidth: 1,
                borderRadius: 5,
                marginBottom: 20,
              }}
            >
              <Picker.Item label="Selecione um Motorista" value="" />
              {driversList.map((driver) => (
                <Picker.Item key={driver.id} label={driver.name} value={driver.id} />
              ))}
            </Picker>
          )}
          <TouchableOpacity
            onPress={handleAddChild}
            style={{
              backgroundColor: "#22c55e",
              paddingVertical: 10,
              borderRadius: 5,
              marginBottom: 20,
            }}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Adicionar Filho
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleGoBack}
            style={{
              backgroundColor: "#6b7280",
              paddingVertical: 10,
              borderRadius: 5,
            }}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Voltar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default ParentProfile;
