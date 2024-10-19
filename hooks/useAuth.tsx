import { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth } from "../services/firebaseConfig";

const useAuth = () => {
  const [user, setUser] = useState<User | null>(null); // Adicionar o estado do usuário
  const [error, setError] = useState<string | null>(null);

  // Monitorar o estado do usuário
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Limpar o listener quando o componente desmontar
    return () => unsubscribe();
  }, []);

  const signup = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return {
    user, // Agora temos a propriedade `user` que pode ser usada em `ProtectedRoute`
    signup,
    login,
    error,
  };
};

export default useAuth;
