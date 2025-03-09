import { auth } from './firebase_cred.js';

const accountNameSmall = document.getElementById("accountNameSmall");
const accountNameLarge = document.getElementById("accountNameLarge");
const logoutBtn = document.getElementById("logoutBtn");
const logoutBtnLarge = document.getElementById("logoutBtnLarge");

// Check authentication state
auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        console.log("User is signed in:", user);

        // display name is just email, maybe we can ask for user display name in the future?
        const userEmail = user.email;
        const displayName = userEmail.split('@')[0];

        accountNameSmall.textContent = displayName;
        accountNameLarge.textContent = displayName;
    } else {
        console.log("No user signed in");
        window.location.href = "signin.html";
    }
});

function logoutUser() {
    auth.signOut()
        .then(() => {
            console.log("User signed out successfully");
            window.location.href = "signin.html";
        })
        .catch((error) => {
            console.error("Error signing out:", error);
            alert("Error signing out. Please try again.");
        });
}

// logoutBtn.addEventListener("click", (e) => {
//     e.preventDefault();
//     logoutUser();
// });

logoutBtnLarge.addEventListener("click", (e) => {
    e.preventDefault();
    logoutUser();
});