import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
// These should be set in your .env file
const firebaseConfig = {
  apiKey: "AIzaSyB36ai39QRo9P27ZDH1qjeTal-T7ozKu2o",
  authDomain: "originelectric-c8236.firebaseapp.com",
  projectId: "originelectric-c8236",
  storageBucket: "originelectric-c8236.firebasestorage.app",
  messagingSenderId: "666942140438",
  appId: "1:666942140438:web:4bb19af5a190d9ef188537",
  measurementId: "G-H5MDX54MFM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
