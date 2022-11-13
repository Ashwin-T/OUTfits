// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCsnYkuH9BFxQ6oMgV-NAZuuQmpNt9ZpaQ",
  authDomain: "app-outfits.firebaseapp.com",
  projectId: "app-outfits",
  storageBucket: "app-outfits.appspot.com",
  messagingSenderId: "165444808402",
  appId: "1:165444808402:web:855ff43d7182a402ef070b",
  measurementId: "G-2JH7EL36B4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export {app, analytics}