import { db } from './firebase_cred.js';

document.getElementById('message').addEventListener('submit', function (e) {

    e.preventDefault();

    // Get values from form
    const user = firebase.auth().currentUser;
    // const toSeller = document.getElementById('to-seller').value;
    const subject = document.getElementById('subject').value;
    const messageText = document.getElementById('message-text').value.trim();

    // Store values as a single message object if all values exist
    if (user && toSeller && subject && messageText) {
        const message = {
            to: '{receiver_user_id}',
            subject: subject,
            message: messageText,
            from: user.uid,
            time: firebase.firestore.FieldValue.serverTimestamp()
        };

        // Send data to Firebase
        db.collection('messages').add(message);

        // Show success message
        alert('Message Sent!');

        // Reset form
        this.reset();

    } else {
        alert('Please fill in all information')
    }
})