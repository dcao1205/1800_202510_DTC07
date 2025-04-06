import { auth, db } from './firebase_cred.js';
/**
 * Waits for the DOM to load and then loads user profile info if authenticated.
 */
document.addEventListener("DOMContentLoaded", () => {
    /**
     * Listens to authentication state changes and loads user data from Firestore.
     * @param {firebase.User|null} user - The currently signed-in user or null
     * @returns {Promise<void>}
     */
    auth.onAuthStateChanged(async (user) => {
        if (!user) {
            console.error("User not logged in.");
            return;
        }

        try {
            // Fetch user document from Firestore
            const userDoc = await db.collection("users").doc(user.uid).get();
            if (!userDoc.exists) {
                console.warn("No user document found.");
                return;
            }

            const userData = userDoc.data();

            // Safely populate HTML elements with user data or fallback
            document.getElementById('username').textContent = userData.username || '';
            document.getElementById('name').textContent = userData.name || '';
            document.getElementById('email').textContent = userData.emailhidding ? "Hidden" : (userData.email || '');
            document.getElementById('phonenumber').textContent = userData.phonenumber || '';
            document.getElementById('location').textContent = userData.location || '';
            document.getElementById('institution').textContent = userData.institution || '';
            document.getElementById('aboutme').textContent = userData.aboutme || '';
            document.getElementById('profileImage').src = userData.profileImage || 'default.png';
        } catch (error) {
            console.error("Error loading user info:", error);
        }
    });
});
