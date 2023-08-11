import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBn7TwslIpj9Dev90Xt7UtBtC0oB7HVdDQ",
  authDomain: "kilombo-f0e07.firebaseapp.com",
  projectId: "kilombo-f0e07",
  storageBucket: "kilombo-f0e07.appspot.com",
  messagingSenderId: "545833235181",
  appId: "1:545833235181:web:d8cddcea5fe47e385352e4"
};

// const firebaseConfig = {
//   apiKey: "AIzaSyB0Tbh3NQjFPBMNSnd1YVLUKaU80rUPBik",
//   authDomain: "kilombo-test.firebaseapp.com",
//   projectId: "kilombo-test",
//   storageBucket: "kilombo-test.appspot.com",
//   messagingSenderId: "131984964014",
//   appId: "1:131984964014:web:aaa216a27c4477408d703f"
// };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth()
const storage = getStorage(app);

export { db, auth, storage } 