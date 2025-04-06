import { auth, db } from './firebase_cred.js';

/**
 * Saves a listing ID to the current user's savedListings array in Firestore.
 * Prevents duplicates and handles auth validation.
 * @param {string} listingId - The ID of the listing to be saved
 * @returns {Promise<void>}
 */
async function saveListing(listingId) {
    const user = auth.currentUser;
    // Ensure user is logged in
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

/**
 * Retrieves the current listing ID from the page's URL.
 * @returns {string|null} The listing ID if found, otherwise null.
 */
function getListingId() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

/**
 * Attaches a click event listener to the save button.
 * When clicked, it triggers saving the listing for the current user.
 */
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
