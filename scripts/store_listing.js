import { db, storage } from './firebase_cred.js';

document.addEventListener('DOMContentLoaded', function () {

    let imageFile = null;

    document.getElementById('imageUpload').addEventListener('change', function (event) {
        imageFile = event.target.files[0];
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('imagePreview').innerHTML = `<img src="${e.target.result}" alt="Uploaded Image">`;
        };
        reader.readAsDataURL(imageFile);
    });

    const form = document.getElementsByClassName('create')[0];

    if (form) {
        console.log("form found")

        form.addEventListener('submit', async function (event) {
            event.preventDefault();

            console.log("here")

            const submitButton = document.querySelector('.btn-submit');
            const originalButtonText = submitButton.innerHTML;
            submitButton.innerHTML = 'Saving...';
            submitButton.disabled = true;

            try {

                console.log("saving")
                const user = firebase.auth().currentUser;
                const title = document.getElementById('title').value;
                const author = document.getElementById('author').value;
                const price = parseFloat(document.getElementById('price').value);
                const quality = document.getElementById('quality').value;
                const description = document.getElementById('description').value;

                let imageUrl = null;
                if (imageFile) {
                    const storageRef = storage.ref(`listingImgs/${imageFile.name}`);
                    const snapshot = await storageRef.put(imageFile);
                    imageUrl = await snapshot.ref.getDownloadURL();
                }
                // Find the listing creator's username
                const userDoc = await db.collection('users').doc(`${user.uid}`).get();
                if (userDoc.exists) {
                    const username = userDoc.data().username;

                    const listing = {
                        username: username,
                        title,
                        author,
                        price,
                        quality,
                        description,
                        imageUrl,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                    };
                    // Save to Firestore
                    await db.collection('listings').add(listing);

                    // Show success message
                    alert('Listing created successfully!');
                    document.getElementById('imagePreview').innerHTML = "";
                    window.location.href = "my_listings.html";
                }
            } catch (error) {
                console.error('Error creating listing:', error);
                alert('Error creating listing: ' + error.message);
            } finally {
                // Reset button state
                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = false;
            }
        });
    } else {
        console.error("Form with ID 'create' not found");
    }

});