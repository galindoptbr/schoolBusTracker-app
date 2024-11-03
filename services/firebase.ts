import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  Auth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Configuração do Firebase - substitua os valores pelos seus
const firebaseConfig = {
  apiKey: "AIzaSyCVZCR6TR4naNmloO13S2ZZahQQm-cGSKk",
  authDomain: "schoolbustracker-744ff.firebaseapp.com",
  projectId: "schoolbustracker-744ff",
  storageBucket: "schoolbustracker-744ff.appspot.com",
  messagingSenderId: "231080355576",
  appId: "1:231080355576:web:160f914f0625f2fd0d",
  measurementId: "G-MJP3RERDCN",
};

// Inicializando o Firebase, garantindo que só seja inicializado uma vez
const app: FirebaseApp = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();

// Inicializando o Firebase Auth com persistência
let auth: Auth; // Adiciona a tipagem explícita para o Auth do Firebase
if (!getApps().length) {
  auth = initializeAuth(app);
  setPersistence(auth, browserLocalPersistence)
    .then(() => {
      console.log("Persistência configurada com sucesso");
    })
    .catch((error) => {
      console.error("Erro ao configurar persistência", error);
    });
} else {
  auth = getAuth(app);
}

// Inicializando os outros serviços do Firebase
const db = getFirestore(app);
const storage = getStorage(app);

// Exportando os serviços
export { auth, db, storage };
