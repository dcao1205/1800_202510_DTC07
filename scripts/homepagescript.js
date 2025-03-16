import { auth } from './firebase_cred.js';

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const accountNameSmall = document.getElementById("accountNameSmall");
    const accountNameLarge = document.getElementById("accountNameLarge");
    const logoutBtn = document.getElementById("logoutBtn");
    const logoutBtnLarge = document.getElementById("logoutBtnLarge");

    // Check if elements exist before using them
    if (logoutBtnLarge) {
        logoutBtnLarge.addEventListener("click", (e) => {
            e.preventDefault();
            logoutUser();
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            logoutUser();
        });
    }

    // Check authentication state
    auth.onAuthStateChanged((user) => {
        if (user) {
            // User is signed in
            console.log("User is signed in:", user);

            // display name is just email, maybe we can ask for user display name in the future?
            const userEmail = user.email;
            const displayName = userEmail ? userEmail.split('@')[0] : "User";

            // Only update elements if they exist
            if (accountNameSmall) accountNameSmall.textContent = displayName;
            if (accountNameLarge) accountNameLarge.textContent = displayName;
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
});