import { auth } from './firebase_cred.js';

/**
 * Handles user login form submission and sets session/local persistence.
 * @param {Event} e - The form submission event
 */
document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('inputEmail').value;
    const password = document.getElementById('inputPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    //if remember me is checked, store data locally 
    const persistence = rememberMe ?
        firebase.auth.Auth.Persistence.LOCAL :
        firebase.auth.Auth.Persistence.SESSION;
    
    auth.setPersistence(persistence)
        .then(() => {
            return auth.signInWithEmailAndPassword(email, password);
        })
        .then((userCredential) => {
            // Successful login
            console.log("User signed in:", userCredential.user);
            sessionStorage.setItem('userId', user.uid);
            window.location.href = "homePage.html";
        })
        .catch((error) => {
            // Handle errors
            const errorMessage = document.getElementById('errorMessage');
            errorMessage.textContent = error.message;
            errorMessage.style.display = "block";
            console.error("Error signing in:", error);
        });
});

/**
 * Sends a password reset email when "Forgot Password" is clicked.
 * @param {Event} e - The click event on the forgot password button
 */
document.getElementById('forgotPassword').addEventListener('click', function (e) {
    e.preventDefault();

    const email = document.getElementById('inputEmail').value;

    if (!email) {
        const errorMessage = document.getElementById('errorMessage');
        errorMessage.textContent = "Please enter your email address first.";
        errorMessage.style.display = "block";
        return;
    }

    auth.sendPasswordResetEmail(email)
        .then(() => {
            // Show success message
            const errorMessage = document.getElementById('errorMessage');
            errorMessage.className = "alert alert-success mt-3";
            errorMessage.textContent = "Password reset email sent. Check your inbox.";
            errorMessage.style.display = "block";
        })
        .catch((error) => {
            // Show error message
            const errorMessage = document.getElementById('errorMessage');
            errorMessage.className = "alert alert-danger mt-3";
            errorMessage.textContent = error.message;
            errorMessage.style.display = "block";
        });
});

/**
 * Automatically redirects if user is already signed in.
 * @param {firebase.User} user - The currently signed-in user
 */
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log("User already signed in:", user);
        sessionStorage.setItem('userId', user.uid);
        window.location.href = "homePage.html";
    }
});