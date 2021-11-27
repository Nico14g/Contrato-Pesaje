import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAHokW9uQo6JUTACyeN7YlDH-UWrTRR58Q",
  authDomain: "contrato-pesaje.firebaseapp.com",
  projectId: "contrato-pesaje",
  storageBucket: "contrato-pesaje.appspot.com",
  messagingSenderId: "889331894546",
  appId: "1:889331894546:web:047f6e7facaf9eeab04bcb",
};

export const fb = initializeApp(firebaseConfig);
