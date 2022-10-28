import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBh7uUttEbzrk0gOA9HlXk48VvtOpF6xc8",
  authDomain: "entregable2-poi.firebaseapp.com",
  databaseURL: "https://entregable2-poi-default-rtdb.firebaseio.com",
  projectId: "entregable2-poi",
  storageBucket: "entregable2-poi.appspot.com",
  messagingSenderId: "943899363209",
  appId: "1:943899363209:web:610cb07c1bf45b8b444358",
  measurementId: "G-3W1C196XJW"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();