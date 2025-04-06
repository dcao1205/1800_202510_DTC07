import { auth, db } from './firebase_cred.js';

/**
 * Saves a listing to the user's saved listings in Firestore
 * @param {string} listingId - The ID of the listing to save
 * @returns {Promise<void>} - Promise that resolves when operation completes
 */
async function saveListing(listingId) {
    // Get currently authenticated user
    const user = auth.currentUser;
    
    // Check if user is logged in
    if (!user) {
        alert("You need to be logged in to save listings.");
        return;
    }

    // Create reference to user's document in Firestore
    const userRef = db.collection("users").doc(user.uid);
    
    try {
        // Get user document from Firestore
        const userDoc = await userRef.get();
        
        // Get existing saved listings or initialize empty array
        let savedListings = userDoc.exists ? userDoc.data().savedListings || [] : [];

        // Check if listing is already saved
        if (!savedListings.includes(listingId)) {
            // Add new listing to saved listings
            savedListings.push(listingId);
            
            // Update user document with new saved listings array
            await userRef.update({ savedListings });
            
            // Show success message
            alert("Listing saved successfully!");
        } else {
            // Listing already exists in saved listings
            alert("Listing is already saved.");
        }
    } catch (error) {
        // Handle any errors that occur
        console.error("Error saving listing:", error);
        alert("Failed to save listing.");
    }
}

/**
 * Removes a listing from the user's saved listings
 * @param {string} listingId - The ID of the listing to remove
 */
async function deleteSavedListing(listingId) {
    const user = auth.currentUser;
    if (!user) {
        alert("You need to be logged in to remove saved listings.");
        return;
    }

    const userRef = db.collection("users").doc(user.uid);
    try {
        const userDoc = await userRef.get();
        let savedListings = userDoc.exists ? userDoc.data().savedListings || [] : [];

        // Filter out the listing to be deleted
        const updatedListings = savedListings.filter(id => id !== listingId);

        await userRef.update({ savedListings: updatedListings });
        alert("Listing removed from saved listings.");
    } catch (error) {
        console.error("Error deleting listing:", error);
        alert("Failed to remove listing.");
    }
}

/**
 * Retrieves the listing ID from URL query parameters
 * @returns {string|null} - The listing ID or null if not found
 */
function getListingId() {
    // Parse URL query parameters
    const params = new URLSearchParams(window.location.search);
    
    // Return the 'id' parameter value
    return params.get("id");
}

/**
 * Sets up click event listeners for save and delete buttons
 */
function setupSaveAndDeleteButtons() {
    const saveButton = document.getElementById("save-listing2");
    const deleteButton = document.getElementById("delete-listing2");
    const listingId = getListingId();

    if (saveButton) {
        saveButton.addEventListener("click", () => saveListing(listingId));
    }

    if (deleteButton) {
        deleteButton.addEventListener("click", () => deleteSavedListing(listingId));
    }
}

// Run setup when page is ready
document.addEventListener("DOMContentLoaded", setupSaveAndDeleteButtons);