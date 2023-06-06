import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBn7TwslIpj9Dev90Xt7UtBtC0oB7HVdDQ",
  authDomain: "kilombo-f0e07.firebaseapp.com",
  projectId: "kilombo-f0e07",
  storageBucket: "kilombo-f0e07.appspot.com",
  messagingSenderId: "545833235181",
  appId: "1:545833235181:web:d8cddcea5fe47e385352e4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth()
export { db, auth } 