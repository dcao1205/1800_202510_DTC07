import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth-compat.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore-compat.js";
import { firebaseConfig } from "./firebase_cred.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.getElementById("signupForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("signUpEmail").value;
    const password = document.getElementById("signUpPassword").value;
    const confirmPassword = document.getElementById("signUpConfirmPassword").value;
    const statusMessage = document.getElementById("statusMessage");

    if (password !== confirmPassword) {
        statusMessage.style.display = "block";
        statusMessage.className = "alert alert-danger";
        statusMessage.innerText = "Passwords do not match.";
        console.log("⚠️ Passwords do not match.");
        return;
    }

    console.log("🟢 Creating user...");

    createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            const user = userCredential.user;
            console.log("✅ User created:", user.uid);

            // Create a blank user profile in Firestore
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                createdAt: new Date()
            });

            console.log("🟢 Profile created in Firestore. Redirecting...");

            // Redirect user to edit personal info page
            window.location.replace = "edit_personal_info.html";
        })
        .catch((error) => {
            console.error("❌ Error creating user:", error);
            statusMessage.style.display = "block";
            statusMessage.className = "alert alert-danger";
            statusMessage.innerText = error.message;
        });
});

console.log("Firebase initialized successfully.");
console.log("Auth instance:", auth);
console.log("Current user:", auth.currentUser);
