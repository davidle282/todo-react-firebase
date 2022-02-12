// Import the functions you need from the SDKs you need

import firebase from "firebase/compat/app";
import 'firebase/compat/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDh9r4FVAtOOJy1ZUiNPddq8N6yJFogGZA",
  authDomain: "todo-list-e5cb2.firebaseapp.com",
  projectId: "todo-list-e5cb2",
  storageBucket: "todo-list-e5cb2.appspot.com",
  messagingSenderId: "373794893762",
  appId: "1:373794893762:web:84548226435af1a861b05b",
  measurementId: "G-D9KF292F4C"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;