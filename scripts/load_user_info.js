import { auth, db } from './firebase_cred.js';

document.addEventListener("DOMContentLoaded", () => {
    auth.onAuthStateChanged(async (user) => {
        if (!user) {
            console.error("User not logged in.");
            return;
        }

        try {
            const userDoc = await db.collection("users").doc(user.uid).get();
            if (!userDoc.exists) {
                console.warn("No user document found.");
                return;
            }

            const userData = userDoc.data();

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
