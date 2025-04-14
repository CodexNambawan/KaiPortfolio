// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyABf0dVoSRubWaEUWDPnoPQRaQ_dyx-82k",
  authDomain: "kai-s-portfolio.firebaseapp.com",
  projectId: "kai-s-portfolio",
  storageBucket: "kai-s-portfolio.firebasestorage.app",
  messagingSenderId: "1084062450329",
  appId: "1:1084062450329:web:30115ac2f04115b7502e08",
  measurementId: "G-83VR2KHY3N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();


// Sign-in logic triggered by button click
const allowedEmails = ["kai.portfolio2025@gmail.com", "genibah@gmail.com"];

document.getElementById("google-signin").addEventListener("click", () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;

      if (!allowedEmails.includes(user.email)) {
        alert("Unauthorized account.");
        signOut(auth);
        return;
      }

    })
    .catch((error) => {
      console.error("Google Sign-in error:", error);
      alert("Authentication failed. Try again.");
    });
});

// Check auth state on page load
onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("User is signed in:", user.displayName);
      // Optional: redirect or update UI
      window.location.href = "/adminpage";
    } else {
      console.log("No user signed in");
    }
  });