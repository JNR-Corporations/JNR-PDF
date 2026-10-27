importScripts(
  "https://www.gstatic.com/firebasejs/13.1.0/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/13.1.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyALqaHTdZcIpK12JUpzfOqeKWDvVSEmQA0",
  authDomain: "jnr-pdfs.firebaseapp.com",
  projectId: "jnr-pdfs",
  storageBucket: "jnr-pdfs.firebasestorage.app",
  messagingSenderId: "531369487369",
  appId: "1:531369487369:web:25bffdcf668b9329441cd8",
  measurementId: "G-K57VL32MEK"
});

const messaging = firebase.messaging();