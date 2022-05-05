import { initializeApp } from "firebase/app";
import { initializeFirestore, CACHE_SIZE_UNLIMITED } from "firebase/firestore";
//import { getAuth } from "firebase/auth";
import { getStorage, ena } from "firebase/storage";
import { Settings } from "react-native";
import firestore from "@react-native-firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAHokW9uQo6JUTACyeN7YlDH-UWrTRR58Q",
  authDomain: "contrato-pesaje.firebaseapp.com",
  projectId: "contrato-pesaje",
  storageBucket: "contrato-pesaje.appspot.com",
  messagingSenderId: "889331894546",
  appId: "1:889331894546:web:047f6e7facaf9eeab04bcb",
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
};

export const firebase = initializeApp(firebaseConfig);

//export const auth = getAuth(firebase);
export const db = initializeFirestore(firebase, {
  experimentalForceLongPolling: true, // this line
  useFetchStreams: false, // and this line
});

export const storage = getStorage();

//const usersCollection = firestore().collection("category");
//usersCollection.onSnapshot((a) => a.forEach((doc) => console.log(doc.data())));
