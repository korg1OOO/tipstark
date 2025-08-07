// src/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";

// Replace with your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyANc2NFgtPu0wNdF8OphSKpU9dXYUUImVI",
  authDomain: "tip-a-creator.firebaseapp.com",
  projectId: "tip-a-creator",
  storageBucket: "tip-a-creator.firebasestorage.app",
  messagingSenderId: "170547090236",
  appId: "1:170547090236:web:f42d13ef64179cdf838439"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(app, { experimentalForceLongPolling: true });