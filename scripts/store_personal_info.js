import { auth, db } from './firebase_cred.js';

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector('.create');

  if (!form) {
    console.error("Form with class 'create' not found.");
    return;
  }

  console.log("Form found");

  auth.onAuthStateChanged(async (user) => {
    if (!user) {
      console.error("No authenticated user found.");
      alert("You need to be logged in to edit your profile.");
      window.location.href = "signin.html";
      return;
    }

    console.log("User detected:", user.uid);

    try {
      // Fetch user data from Firestore
      const userDoc = await db.collection("users").doc(user.uid).get();

      if (userDoc.exists) {
        const userData = userDoc.data();
        console.log("Retrieved user data:", userData);

        // Populate form fields
        document.getElementById('username').value = userData.username || "";
        document.getElementById('name').value = userData.name || "";
        document.getElementById('email').value = userData.email || "";
        document.getElementById('phonenumber').value = userData.phonenumber || "";
        document.getElementById('location').value = userData.location || "";
        document.getElementById('institution').value = userData.institution || "";
        document.getElementById('aboutme').value = userData.aboutme || "";
        document.getElementById('emailhidding').checked = userData.emailhidding || false;
      } else {
        console.warn("No user profile found in Firestore.");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }

    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      console.log("Submitting form...");

      const submitButton = document.querySelector('.btn-submit');
      submitButton.innerHTML = 'Checking username...';
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
        const emailhidding = document.getElementById('emailhidding').checked;


        const usernameQuery = await db.collection('users').where('username', '==', username).get();
        let usernameTaken = false;

        usernameQuery.forEach(doc => {
          if (doc.id !== auth.currentUser.uid) {
            usernameTaken = true;
          }
        });

        if (usernameTaken) {
          alert("This username is already taken. Please choose a different one.");
          submitButton.innerHTML = 'Save';
          submitButton.disabled = false;
          return;
        }

        const userProfile = {
          username,
          name,
          email,
          phonenumber,
          location,
          institution,
          aboutme,
          emailhidding,
          updatedAt: new Date()
        };

        // Update user profile in Firestore
        await db.collection('users').doc(user.uid).set(userProfile, { merge: true });

        alert("Profile updated successfully.");
        form.reset();

        // Redirect to homepage after updating profile
        window.location.href = "homepage2.html";

      } catch (error) {
        console.error("Error updating profile:", error);
        alert("Error updating profile: " + error.message);
      } finally {
        submitButton.innerHTML = 'Save';
        submitButton.disabled = false;
      }
    });
  });
});
