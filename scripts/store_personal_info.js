import { auth, db } from './firebase_cred.js';

// Ensure script runs only after the DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector('.create');

  if (!form) {
    console.error("❌ Form with class 'create' not found.");
    return;
  }

  console.log("✅ Form found");

  // Check if the user is authenticated BEFORE allowing them to update
  auth.onAuthStateChanged((user) => {
    if (!user) {
      console.error("❌ No authenticated user found.");
      alert("You need to be logged in to edit your profile.");
      window.location.href = "signin.html";
    } else {
      console.log("✅ User detected:", user.uid);

      form.addEventListener('submit', async function (event) {
        event.preventDefault();
        console.log("🟢 Submitting form...");

        const submitButton = document.querySelector('.btn-submit');
        const originalButtonText = submitButton.innerHTML;
        submitButton.innerHTML = 'Saving...';
        submitButton.disabled = true;

        try {
          // Get user input values
          const username = document.getElementById('username').value.trim();
          const name = document.getElementById('name').value.trim();
          const email = document.getElementById('email').value.trim();
          const phonenumber = document.getElementById('phonenumber').value.trim();
          const location = document.getElementById('location').value.trim();
          const institution = document.getElementById('institution').value.trim();
          const aboutme = document.getElementById('aboutme').value.trim();

          const userProfile = {
            username,
            name,
            email,
            phonenumber,
            location,
            institution,
            aboutme,
            updatedAt: new Date()
          };

          // Update user profile in Firestore
          await db.collection('users').doc(user.uid).set(userProfile, { merge: true });

          alert("✅ Profile updated successfully!");
          form.reset();

          // Redirect to homepage after updating profile
          window.location.href = "homepage2.html";

        } catch (error) {
          console.error("❌ Error updating profile:", error);
          alert("Error updating profile: " + error.message);
        } finally {
          submitButton.innerHTML = originalButtonText;
          submitButton.disabled = false;
        }
      });
    }
  });
});
