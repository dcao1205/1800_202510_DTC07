const firebaseConfig = {
    apiKey: "AIzaSyA797NC0_Y9K6SG99kZVjtFMggvhX0h4AU",
    authDomain: "comp1800-61585.firebaseapp.com",
    projectId: "comp1800-61585",
    storageBucket: "comp1800-61585.firebasestorage.app",
    messagingSenderId: "1079137365057",
    appId: "1:1079137365057:web:a54a2b7cc46541964c2ac0",
    measurementId: "G-6537V1H8K9"
};

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const db = firebase.firestore();
export const storage = firebase.storage();