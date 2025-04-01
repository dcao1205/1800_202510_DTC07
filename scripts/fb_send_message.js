import { db } from './firebase_cred.js';

// Populate the "To:" input
document.addEventListener('DOMContentLoaded', function () {
    // Get the stored seller username localStorage
    const sellerUsername = localStorage.getItem("selectedSellerUsername");

    // Get the input elements
    const toSellerInput = document.getElementById("to-seller");

    // Populate the input fields if values exist in localStorage
    if (sellerUsername) {
        toSellerInput.value = sellerUsername;
    }

    // Add event listener to the back button
    const backButton = document.querySelector('.btn-outline-secondary');
    backButton.addEventListener('click', function () {
        window.history.back(); // AI help to find method
    });
});

document.getElementById('message').addEventListener('submit', async function (e) {
    e.preventDefault();

    // Get values from form
    const user = firebase.auth().currentUser;
    const toSeller = document.getElementById('to-seller').value;
    const subject = document.getElementById('subject').value;
    const messageText = document.getElementById('message-text').value.trim();

    // Check if user is logged in first
    if (!user) {
        alert('You must be logged in to send a message');
        return;
    }

    // Store values as a single message object if all values exist
    if (toSeller && subject && messageText) {

        try {
            const userDoc = await db.collection("users").doc(user.uid).get();
            const userData = userDoc.data();
            const username = userData.username;
            console.log("Username:", username);

            const confirmUpdate = confirm("Are you sure you want to send the message?");
            if (!confirmUpdate) {
                console.log("User cancelled the update.");
                return;
            }

            const message = {
                to: toSeller,
                subject: subject,
                message: messageText,
                from: username,
                senderID: user.uid,
                read: false,
                time: firebase.firestore.FieldValue.serverTimestamp()
            };

            // Send data to Firebase
            const docRef = await db.collection('messages').add(message);
            const result = docRef.id;

            // Update the message document with its own ID
            await docRef.update({ id: result });

            // Update the sender's sentMessages array
            await db.collection('users').doc(user.uid).update({
                sentMessages: firebase.firestore.FieldValue.arrayUnion(result)
            });

            // Find and update the recipient user's receivedMessages array
            const recipientUser = await db.collection('users').where('username', '==', toSeller).get();

            if (!recipientUser.empty) {
                const recipientDoc = recipientUser.docs[0];
                await recipientDoc.ref.update({
                    receivedMessages: firebase.firestore.FieldValue.arrayUnion(result)
                });


            } else {
                console.error("Recipient not found");
            }

            // Show success message
            alert('Message Sent!');

            // Redirect back to last visited page
            window.history.back();
        } catch (error) {
            console.error("Error adding or updating document: ", error);
            alert('Error sending message');
        }
    } else {
        alert('Please fill in all information');
    }
});

