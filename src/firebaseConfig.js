import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA4bgEulJPrZYXgdKZFxo6ssShyUz_xGgE",
  authDomain: "damascus-translations.firebaseapp.com",
  projectId: "damascus-translations",
  storageBucket: "damascus-translations.appspot.com",
  messagingSenderId: "150876826458",
  appId: "1:150876826458:web:217bcf8dde8f51792c2163",
  measurementId: "G-VHJ0C1EL7E"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
