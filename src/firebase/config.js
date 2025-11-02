// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC-5y60hzXGjDBGkxQEl7qapZd3CpCKgkQ",
  authDomain: "taller-radar.firebaseapp.com",
  projectId: "taller-radar",
  storageBucket: "taller-radar.firebasestorage.app",
  messagingSenderId: "289593938572",
  appId: "1:289593938572:web:179324dd7c68425c2ee1a9",
  measurementId: "G-LJ7XJL7YE5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// eslint-disable-next-line no-unused-vars
export const db = getFirestore(app);
export const auth = getAuth(app);
