// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB5LzIRDhOxEWfs8kAkVWrpnRygU_QxXFo",
    authDomain: "uzinee-emotion-diary.firebaseapp.com",
    projectId: "uzinee-emotion-diary",
    storageBucket: "uzinee-emotion-diary.firebasestorage.app",
    messagingSenderId: "616816556491",
    appId: "1:616816556491:web:163c8959f4ddd5b2595e4e",
    measurementId: "G-3K6LZVYLDQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firebaseDB = getFirestore(app);
