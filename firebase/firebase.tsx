// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD-wYoJ8IqL4dIU32cPxWI9YLwWIiuWfTM",
  authDomain: "metalive-348103.firebaseapp.com",
  projectId: "metalive-348103",
  storageBucket: "metalive-348103.appspot.com",
  messagingSenderId: "837344305223",
  appId: "1:837344305223:web:02cf9327bdefe91a2d1162",
  measurementId: "G-6H38G91K70",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
