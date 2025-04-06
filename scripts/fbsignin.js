import { auth } from './firebase_cred.js';

/**
 * Handles login form submission
 * - Sets authentication persistence based on "Remember Me" selection
 * - Authenticates user with email/password
 * - Redirects to home page on success
 * - Displays error messages on failure
 *
 * @param {Event} e - The form submission event
 */
document.getElementById('loginForm').addEventListener('submit', function (e) {
    // Prevent default form submission behavior
    e.preventDefault();

    // Get form input values
    const email = document.getElementById('inputEmail').value;
    const password = document.getElementById('inputPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    // Determine authentication persistence based on "Remember Me" checkbox
    // LOCAL persistence maintains login state across browser sessions
    // SESSION persistence only maintains login for current browser session
    const persistence = rememberMe ?
        firebase.auth.Auth.Persistence.LOCAL :
        firebase.auth.Auth.Persistence.SESSION;
    
    // Set authentication persistence and attempt sign-in
    auth.setPersistence(persistence)
        .then(() => {
            // Sign in with provided credentials
            return auth.signInWithEmailAndPassword(email, password);
        })
        .then((userCredential) => {
            // Successful login handler
            console.log("User signed in:", userCredential.user);
            
            // Store user ID in sessionStorage for application use
            sessionStorage.setItem('userId', userCredential.user.uid);
            
            // Redirect to home page
            window.location.href = "homePage.html";
        })
        .catch((error) => {
            // Error handler for failed login attempts
            const errorMessage = document.getElementById('errorMessage');
            
            // Display error message to user
            errorMessage.textContent = error.message;
            errorMessage.style.display = "block";
            
            // Log detailed error to console
            console.error("Error signing in:", error);
        });
});

/**
 * Sends a password reset email when "Forgot Password" is clicked.
 * @param {Event} e - The click event on the forgot password button
 */
document.getElementById('forgotPassword').addEventListener('click', function (e) {
    // Prevent default anchor behavior
    e.preventDefault();

    // Get email from input field
    const email = document.getElementById('inputEmail').value;

    // Validate email exists
    if (!email) {
        const errorMessage = document.getElementById('errorMessage');
        errorMessage.textContent = "Please enter your email address first.";
        errorMessage.style.display = "block";
        return;
    }

    // Attempt to send password reset email
    auth.sendPasswordResetEmail(email)
        .then(() => {
            // Show success message
            const errorMessage = document.getElementById('errorMessage');
            
            // Change styling to indicate success
            errorMessage.className = "alert alert-success mt-3";
            errorMessage.textContent = "Password reset email sent. Check your inbox.";
            errorMessage.style.display = "block";
        })
        .catch((error) => {
            // Show error message
            const errorMessage = document.getElementById('errorMessage');
            
            // Maintain error styling
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
    // Check if user is already authenticated
    if (user) {
        console.log("User already signed in:", user);
        
        // Store user ID in sessionStorage
        sessionStorage.setItem('userId', user.uid);
        
        // Redirect to home page
        window.location.href = "homePage.html";
    }
});