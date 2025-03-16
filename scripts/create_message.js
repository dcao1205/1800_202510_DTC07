import { db } from './firebase_cred.js';

document.addEventListener('DOMContentLoaded', function () {

    // HARD-CODED FOR TESTING! Edit to dynamically change.
    const listingDocId = '0YjN1YLxKt3frr5xBViT'; 
    
    // Get the listing data
    db.collection('listings').doc(listingDocId).get()
        .then((doc) => {
            if (doc.exists) {
                const listingData = doc.data();
                
                // Store the user_id in a data attribute on the button itself
                const messageButton = document.getElementById("create-message");
                messageButton.setAttribute('data-user-id', listingData.user_id);
            } else {
                console.error("No such document!");
            }
        })
        .catch((error) => {
            console.error("Error getting document:", error);
        });
    
    
    document.getElementById("create-message").addEventListener("click", function () {
        // Get the user ID from the button being clicked on
        const userId = this.getAttribute('data-user-id');
        
        // Store textbook creator's ID to find and update the "To:" create message field
        localStorage.setItem("selectedSellerId", userId);
        
        window.location.href = "create_message.html";
    });
});