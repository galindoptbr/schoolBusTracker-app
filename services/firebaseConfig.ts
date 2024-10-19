import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Configuração do Firebase - substitua os valores pelos seus
const firebaseConfig = {
  apiKey: "AIzaSyCVZCR6TR4naNmloO13S2ZZahQQm-cGSKk",
  authDomain: "schoolbustracker-744ff.firebaseapp.com",
  projectId: "schoolbustracker-744ff",
  storageBucket: "schoolbustracker-744ff.appspot.com",
  messagingSenderId: "231080355576",
  appId: "1:231080355576:web:160f914f0625f2fd6bfd0d",
  measurementId: "G-MJP3RERDCN",
};

// Inicializando o Firebase
const app = initializeApp(firebaseConfig);

// Inicializando os serviços do Firebase
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Exportando os serviços
export { auth, db, storage };
