import { useState, useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth, db } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";

interface UserData {
  name?: string;
  email?: string;
}

const useAuth = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          setIsAuthenticated(true);
          setUser(currentUser);

          // Buscar dados adicionais do usuário na coleção do Firestore
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            setUserData(userDocSnap.data() as UserData);
          }
        } else {
          setIsAuthenticated(false);
          setUser(null);
          setUserData(null);
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
        setError("Erro ao buscar dados do usuário.");
      } finally {
        setLoading(false); // Atualizando para indicar que o carregamento foi finalizado
      }
    });

    return () => unsubscribe();
  }, []);

  return {
    loading,
    isAuthenticated,
    user,
    userData,
    error,
  };
};

export default useAuth;
