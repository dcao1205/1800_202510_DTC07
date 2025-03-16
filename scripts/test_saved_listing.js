import { auth, db } from './firebase_cred.js';

// Function to save listing under user UID
async function saveListing(listingId) {
    const user = auth.currentUser;
    if (!user) {
        alert("You need to be logged in to save listings.");
        return;
    }

    const userRef = db.collection("users").doc(user.uid);
    try {
        const userDoc = await userRef.get();
        let savedListings = userDoc.exists ? userDoc.data().savedListings || [] : [];

        // Add listing if not already saved
        if (!savedListings.includes(listingId)) {
            savedListings.push(listingId);
            await userRef.update({ savedListings });
            alert("Listing saved successfully!");
        } else {
            alert("Listing is already saved.");
        }
    } catch (error) {
        console.error("Error saving listing:", error);
        alert("Failed to save listing.");
    }
}

// Function to retrieve the listing ID from the URL
function getListingId() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}


// Function to attach event listener to button
function setupSaveButton() {
    const button = document.getElementById("save-listing2");
    const listingId = getListingId(); // Replace this with the actual listing ID

    if (button) {
        button.addEventListener("click", () => {
            saveListing(listingId);
        });
    }
}

// Run the function when the page loads
document.addEventListener("DOMContentLoaded", setupSaveButton);
