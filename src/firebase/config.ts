import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBuN_9ueMwVXJZyQ2ju8D9poCt80x_hcl4",
    authDomain: "sharifit-9fdd1.firebaseapp.com",
    projectId: "sharifit-9fdd1",
    storageBucket: "sharifit-9fdd1.firebasestorage.app",
    messagingSenderId: "710754079830",
    appId: "1:710754079830:web:945bc43a010bda03e917f7",
    measurementId: "G-1FN5GER1DE"
  };
  

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };