import { auth } from './firebase_cred.js';

document.getElementById('signupForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('signUpEmail').value;
    const password = document.getElementById('signUpPassword').value;
    const confirmPassword = document.getElementById('signUpConfirmPassword').value;
    const termsAccepted = document.getElementById('termsCheck').checked;
    const statusMessage = document.getElementById('statusMessage');

    if (password !== confirmPassword) {
        statusMessage.className = "alert alert-danger mt-3";
        statusMessage.textContent = "Passwords do not match.";
        statusMessage.style.display = "block";
        return;
    }

    if (password.length < 6) {
        statusMessage.className = "alert alert-danger mt-3";
        statusMessage.textContent = "Password must be at least 6 characters long.";
        statusMessage.style.display = "block";
        return;
    }

    if (!termsAccepted) {
        statusMessage.className = "alert alert-danger mt-3";
        statusMessage.textContent = "You must accept the terms and conditions.";
        statusMessage.style.display = "block";
        return;
    }

    // Create user with email and password
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Successfully created user
            statusMessage.className = "alert alert-success mt-3";
            statusMessage.textContent = "Account created successfully!";
            statusMessage.style.display = "block";

            console.log("User registered:", userCredential.user);

            setTimeout(() => {
                window.location.href = "homepage2.html";
            }, 2000);
        })
        .catch((error) => {
            statusMessage.className = "alert alert-danger mt-3";
            statusMessage.textContent = error.message;
            statusMessage.style.display = "block";
            console.error("Error creating user:", error);
        });
});


auth.onAuthStateChanged((user) => {
    if (user) {
        console.log("User already signed in:", user);
        window.location.href = "homepage2.html";
    }
});