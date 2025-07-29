// lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDDh-VNYnV8Xd94t1wPuZ18KC--WU21yuQ",
  authDomain: "crossword-battle-d0f4b.firebaseapp.com",
  databaseURL: "https://crossword-battle-d0f4b-default-rtdb.firebaseio.com",
  projectId: "crossword-battle-d0f4b",
  storageBucket: "crossword-battle-d0f4b.firebasestorage.app",
  messagingSenderId: "320279214396",
  appId: "1:320279214396:web:5f50c74b06e62a9943c639",
  measurementId: "G-Z7VLHVCWB2"
};


const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
