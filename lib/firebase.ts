import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAP3epqLVnMRKmVy9jZpMXdcH0X5FfPvqo",
  authDomain: "crossword-puzzle-540e7.firebaseapp.com",
  databaseURL: "https://crossword-puzzle-540e7-default-rtdb.firebaseio.com",
  projectId: "crossword-puzzle-540e7",
  storageBucket: "crossword-puzzle-540e7.firebasestorage.app",
  messagingSenderId: "363995489820",
  appId: "1:363995489820:web:fbf83d10a67f35c60061d9"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);




