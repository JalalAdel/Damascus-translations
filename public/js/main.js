// main.js - This is correct.

// Import the functions you need from the SDKs
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js';

// Your web app's Firebase configuration
const firebaseConfig = {
  // IMPORTANT: Make sure you have your REAL keys here from the Firebase Console
  apiKey: "AIzaSyA4bgEulJPrZYXgdKZFxo6ssShyUz_xGgE", // This looks like a placeholder, double check it!
  authDomain: "damascus-translations.firebaseapp.com",
  projectId: "damascus-translations",
  storageBucket: "damascus-translations.appspot.com",
  messagingSenderId: "150876826458",
  appId: "1:150876826458:web:217bcf8dde8f51792c2163",
  measurementId: "G-VHJ0C1EL7E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);