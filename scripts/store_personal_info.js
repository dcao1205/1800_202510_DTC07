import { db } from './firebase_cred.js';

// Select the form element
const form = document.querySelector('.create');

if (form) {
  console.log("Form found");

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    console.log("Submitting form...");

    const submitButton = document.querySelector('.btn-submit');
    const originalButtonText = submitButton.innerHTML;
    submitButton.innerHTML = 'Saving...';
    submitButton.disabled = true;

    try {
      console.log("Creating profile...");

      const username = document.getElementById('username').value;
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const phonenumber = document.getElementById('phonenumber').value;
      const location = document.getElementById('location').value;
      const institution = document.getElementById('institution').value;
      const aboutme = document.getElementById('aboutme').value;

      const userProfile = {
        username,
        name,
        email,
        phonenumber,
        location,
        institution,
        aboutme,
        createdAt: new Date()
      };

      // Add new document to Firestore
      db.collection('users').add(userProfile)
        .then(() => {
          alert('Profile created successfully!');
          form.reset();
        })
        .catch((error) => {
          console.error('Error creating profile:', error);
          alert('Error creating profile: ' + error.message);
        })
        .finally(() => {
          submitButton.innerHTML = originalButtonText;
          submitButton.disabled = false;
        });
    } catch (error) {
      console.error('Error in submission process:', error);
      alert('Error in submission process: ' + error.message);
      submitButton.innerHTML = originalButtonText;
      submitButton.disabled = false;
    }
  });
} else {
  console.error("Form with class 'create' not found");
}
