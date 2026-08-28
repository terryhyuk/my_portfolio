// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBEc2zlAqSGQz47BWh1HjGahmWil1zVYU8",
    authDomain: "myportfolio-26d7c.firebaseapp.com",
    projectId: "myportfolio-26d7c",
    storageBucket: "myportfolio-26d7c.firebasestorage.app",
    messagingSenderId: "1065146976861",
    appId: "1:1065146976861:web:7e22e12dc1333f866a1bb4",
    measurementId: "G-ZSLVF1T5SL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const storage = getStorage(app);