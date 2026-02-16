import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDlBcgUPG2FH_xpZbNgyJwqMtsodDqjRgc",
  authDomain: "lucky-money-36a2f.firebaseapp.com",
  projectId: "lucky-money-36a2f",
  storageBucket: "lucky-money-36a2f.firebasestorage.app",
  messagingSenderId: "1047592793574",
  appId: "1:1047592793574:web:9cde8e7483f9f58ce7d227",
};

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
