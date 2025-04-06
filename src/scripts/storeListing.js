import { db, storage } from './firebase_cred.js';

// Wait for the DOM to be fully loaded before executing the script
document.addEventListener('DOMContentLoaded', function () {
    // Variable to store the selected image file
    let imageFile = null;

    // Event listener for image upload input
    document.getElementById('imageUpload').addEventListener('change', function (event) {
        // Get the first selected file
        imageFile = event.target.files[0];
        
        // Create a FileReader to preview the image
        const reader = new FileReader();
        
        // When the file is loaded, display it in the preview area
        reader.onload = function (e) {
            document.getElementById('imagePreview').innerHTML = `<img src="${e.target.result}" alt="Uploaded Image">`;
        };
        
        // Read the file as a data URL
        reader.readAsDataURL(imageFile);
    });

    // Get the form element with class 'create'
    const form = document.getElementsByClassName('create')[0];

    // Check if the form exists
    if (form) {
        // Add submit event listener to the form
        form.addEventListener('submit', async function (event) {
            // Prevent the default form submission behavior
            event.preventDefault();

            // Get the submit button and store its original state
            const submitButton = document.querySelector('.btn-submit');
            const originalButtonText = submitButton.innerHTML;
            
            // Update button to show loading state
            submitButton.innerHTML = 'Saving...';
            submitButton.disabled = true;

            try {
                console.log("saving");
                
                // Get current authenticated user
                const user = firebase.auth().currentUser;
                
                // Get form values
                const title = document.getElementById('title').value;
                const author = document.getElementById('author').value;
                const price = parseFloat(document.getElementById('price').value);
                const quality = document.getElementById('quality').value;
                const description = document.getElementById('description').value;

                // Validate price input
                if (isNaN(price) || price < 0) {
                    alert("Price must be a non-negative number.");
                    submitButton.innerHTML = originalButtonText;
                    submitButton.disabled = false;
                    return;
                }

                // Handle image upload if a file was selected
                let imageUrl = null;
                if (imageFile) {
                    // Create a reference to the storage location
                    const storageRef = storage.ref(`listingImgs/${imageFile.name}`);
                    
                    // Upload the file to Firebase Storage
                    const snapshot = await storageRef.put(imageFile);
                    
                    // Get the download URL for the uploaded image
                    imageUrl = await snapshot.ref.getDownloadURL();
                }

                // Ask for user confirmation before submitting
                const confirmUpdate = confirm("Are you sure you want to submit your listings?");
                if (!confirmUpdate) {
                    console.log("User cancelled the update.");
                    return;
                } 

                // Get the user's document from Firestore to access their username
                const userDoc = await db.collection('users').doc(`${user.uid}`).get();
                
                if (userDoc.exists) {
                    const username = userDoc.data().username;

                    // Create listing object with all necessary fields
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
                    
                    // Save the listing to Firestore
                    await db.collection('listings').add(listing);

                    // Show success message and redirect
                    alert('Listing created successfully!');
                    document.getElementById('imagePreview').innerHTML = "";
                    window.location.href = "myListings.html";
                }
            } catch (error) {
                // Handle any errors that occur during the process
                console.error('Error creating listing:', error);
                alert('Error creating listing: ' + error.message);
            } finally {
                // Reset the button to its original state regardless of success/failure
                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = false;
            }
        });
    } else {
        // Log an error if the form wasn't found
        console.error("Form with class 'create' not found");
    }
});