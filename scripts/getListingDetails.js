import { auth, db } from './firebase_cred.js';

/**
 * Extracts the listing ID from the URL query parameters
 * @returns {string|null} The listing ID if found in URL, otherwise null
 */
function getListingIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    // Return the value of the 'id' parameter
    return params.get("id"); 
}

/**
 * Fetches and displays a single listing based on ID from URL
 * @async
 * @returns {Promise<void>}
 */
async function displayListing() {
    // Get the listing ID from URL
    const listingId = getListingIdFromURL();

    // Check if listing ID exists
    if (!listingId) {
        console.error("No listing ID found in URL.");
        document.getElementById("selected-listing").innerHTML = "<p>Listing not found.</p>";
        return;
    }

    try {
        // Create reference to the specific listing document
        const docRef = db.collection("listings").doc(listingId);
        const docSnap = await docRef.get();

        // Check if document exists
        if (!docSnap.exists) {
            console.error("Listing does not exist.");
            document.getElementById("selected-listing").innerHTML = "<p>Listing not found.</p>";
            return;
        }

        // Get the listing data from the document
        const listing = docSnap.data();

        // Update DOM elements with listing data
        document.getElementById("listing-title").innerText = listing.title || "No Title";
        document.getElementById("listing-author").innerText = `Author: ${listing.author || "Unknown"}`;
        document.getElementById("listing-price").innerText = `Price: $${listing.price || "N/A"}`;
        document.getElementById("listing-quality").innerText = `Quality: ${listing.quality || "Unknown"}`;
        document.getElementById("listing-description").innerText = listing.description || "No description available.";
        document.getElementById("listing-username").innerText = `Username: ${listing.username}` || "No description available.";

        // Set the listing image
        document.querySelector('.card-img-top').src = listing.imageUrl;

    } catch (error) {
        // Handle any errors that occur during the process
        console.error("Error fetching listing:", error);
        document.getElementById("selected-listing").innerHTML = "<p>Error loading listing.</p>";
    }
}

// Execute the displayListing function when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", displayListing);