import { auth } from './firebase_cred.js';

/**
 * Handles signup form submission with comprehensive validation
 * - Validates password match, length, and terms acceptance
 * - Creates new user account via Firebase Authentication
 * - Provides visual feedback throughout the process
 */
document.getElementById('signupForm').addEventListener('submit', function (e) {
    // Prevent default form submission behavior
    e.preventDefault();

    // Retrieve form input values
    const email = document.getElementById('signUpEmail').value;
    const password = document.getElementById('signUpPassword').value;
    const confirmPassword = document.getElementById('signUpConfirmPassword').value;
    const termsAccepted = document.getElementById('termsCheck').checked;
    const statusMessage = document.getElementById('statusMessage');

    // Validate password confirmation match
    if (password !== confirmPassword) {
        statusMessage.className = "alert alert-danger mt-3";
        statusMessage.textContent = "Passwords do not match.";
        statusMessage.style.display = "block";
        return;
    }

    // Validate minimum password length requirement
    if (password.length < 6) {
        statusMessage.className = "alert alert-danger mt-3";
        statusMessage.textContent = "Password must be at least 6 characters long.";
        statusMessage.style.display = "block";
        return;
    }

    // Validate terms and conditions acceptance
    if (!termsAccepted) {
        statusMessage.className = "alert alert-danger mt-3";
        statusMessage.textContent = "You must accept the terms and conditions.";
        statusMessage.style.display = "block";
        return;
    }

    /**
     * Attempt to create new user account
     * - Uses Firebase auth createUserWithEmailAndPassword method
     * - Handles both success and error cases with appropriate UI feedback
     */
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Account creation success handler
            statusMessage.className = "alert alert-success mt-3";
            statusMessage.textContent = "Account created successfully!";
            statusMessage.style.display = "block";

            // Log user data to console for debugging
            console.log("User registered:", userCredential.user);

            // Redirect to home page after 2 seconds to allow success message display
            setTimeout(() => {
                window.location.href = "homePage.html";
            }, 2000);
        })
        .catch((error) => {
            // Account creation error handler
            statusMessage.className = "alert alert-danger mt-3";
            statusMessage.textContent = error.message;
            statusMessage.style.display = "block";
            
            // Log detailed error to console for debugging
            console.error("Error creating user:", error);
        });
});

/**
 * Authentication state observer
 * - Checks if user is already authenticated when page loads
 * - Redirects authenticated users to profile editing page
 * - Maintains application state consistency
 */
auth.onAuthStateChanged((user) => {
    if (user) {
        // Log existing user info for debugging
        console.log("User already signed in:", user);
        
        // Redirect authenticated users to profile editing page
        window.location.href = "editPersonalInfo.html";
    }
});