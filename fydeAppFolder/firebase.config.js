import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';


// Your web app's Firebase configuration
const firebaseConfig = {
   apiKey: "AIzaSyDki5ab4qeNdtrM97TVZfUDALg2R-KyiU8",
   authDomain: "fide-app-2ab56.firebaseapp.com",
   projectId: "fide-app-2ab56",
   storageBucket: "fide-app-2ab56.appspot.com",
   messagingSenderId: "737117945164",
   appId: "1:737117945164:web:ec40990e46f9f59a1363e9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
   persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export const db = getFirestore(app);
export const storage = getStorage(app);
