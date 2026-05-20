import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAoaYtXuwnDKyf9aFW7lcvYgnRA9TPvMPc",
  authDomain: "checkmente-cf629.firebaseapp.com",
  projectId: "checkmente-cf629",
  storageBucket: "checkmente-cf629.firebasestorage.app",
  messagingSenderId: "871574659856",
  appId: "1:871574659856:web:af7650054abb0b2441bb95"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);