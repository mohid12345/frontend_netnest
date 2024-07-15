import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth, GoogleAuthProvider} from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyA1qYbm0ETiJ02V4P4tvKLI3bjpbMOjFrc",
  authDomain: "netnest-eeb8f.firebaseapp.com",
  projectId: "netnest-eeb8f",
  storageBucket: "netnest-eeb8f.appspot.com",
  messagingSenderId: "28604244918",
  appId: "1:28604244918:web:4801174c7c1b808b60d717",
  measurementId: "G-MX767X2PFR"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider()
export {auth, provider}