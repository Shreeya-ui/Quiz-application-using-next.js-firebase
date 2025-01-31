import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Firestore

const firebaseConfig = {
  apiKey: "AIzaSyCI19xswVXzMKmGCdDIUAgugnd1yNaXMzI",
  authDomain: "quiz-application-1d21e.firebaseapp.com",
  projectId: "quiz-application-1d21e",
  storageBucket: "quiz-application-1d21e.firebasestorage.app",
  messagingSenderId: "502946779944",
  appId: "1:502946779944:web:a2b368ca732061da4ab61d",
  measurementId: "G-9SK68N00C7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app); // Initialize Firestore
