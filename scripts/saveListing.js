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
 * Sets up click event listener for save listing button
 * - Gets current listing ID from URL
 * - Attaches click handler to save button
 */
function setupSaveButton() {
    // Get save button element from DOM
    const button = document.getElementById("save-listing2");
    
    // Get listing ID from URL
    const listingId = getListingId(); // Replace this with the actual listing ID

    // If button exists, add click event listener
    if (button) {
        button.addEventListener("click", () => {
            // Call saveListing function when clicked
            saveListing(listingId);
        });
    }
}

// Set up save button when DOM content is loaded
document.addEventListener("DOMContentLoaded", setupSaveButton);