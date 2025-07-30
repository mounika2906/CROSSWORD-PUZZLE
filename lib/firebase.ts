// lib/firebase.ts
// import { initializeApp } from "firebase/app";
// import { getDatabase } from "firebase/database";

// const firebaseConfig = {
//   apiKey: "AIzaSyDDh-VNYnV8Xd94t1wPuZ18KC--WU21yuQ",
//   authDomain: "crossword-battle-d0f4b.firebaseapp.com",
//   databaseURL: "https://crossword-battle-d0f4b-default-rtdb.firebaseio.com",
//   projectId: "crossword-battle-d0f4b",
//   storageBucket: "crossword-battle-d0f4b.firebasestorage.app",
//   messagingSenderId: "320279214396",
//   appId: "1:320279214396:web:5f50c74b06e62a9943c639",
//   measurementId: "G-Z7VLHVCWB2"
// };


// const app = initializeApp(firebaseConfig);
// export const db = getDatabase(app);


// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyAP3epqLVnMRKmVy9jZpMXdcH0X5FfPvqo",
//   authDomain: "crossword-puzzle-540e7.firebaseapp.com",
//   projectId: "crossword-puzzle-540e7",
//   storageBucket: "crossword-puzzle-540e7.firebasestorage.app",
//   messagingSenderId: "363995489820",
//   appId: "1:363995489820:web:fbf83d10a67f35c60061d9"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// export const db = getDatabase(app);

// const firebaseConfig = {
//   apiKey: "AIzaSyAP3epqLVnMRKmVy9jZpMXdcH0X5FfPvqo",
//   authDomain: "crossword-puzzle-540e7.firebaseapp.com",
//   databaseURL: "https://crossword-puzzle-540e7-default-rtdb.firebaseio.com", // ✅ Required for Realtime DB
//   projectId: "crossword-puzzle-540e7",
//   storageBucket: "crossword-puzzle-540e7.appspot.com", // ✅ Correct format
//   messagingSenderId: "363995489820",
//   appId: "1:363995489820:web:fbf83d10a67f35c60061d9"
// };


import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAP3epqLVnMRKmVy9jZpMXdcH0X5FfPvqo",
  authDomain: "crossword-puzzle-540e7.firebaseapp.com",
  databaseURL: "https://crossword-puzzle-540e7-default-rtdb.firebaseio.com", // ✅ Add this line
  projectId: "crossword-puzzle-540e7",
  storageBucket: "crossword-puzzle-540e7.appspot.com", // ✅ Fix typo here
  messagingSenderId: "363995489820",
  appId: "1:363995489820:web:fbf83d10a67f35c60061d9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Make sure this is exported correctly
export const db = getDatabase(app);

