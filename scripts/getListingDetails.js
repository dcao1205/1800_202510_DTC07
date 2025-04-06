import { auth, db } from './firebase_cred.js';

/**
 * Retrieves the listing ID from the current URL query string.
 * @returns {string|null} The listing ID if present, otherwise null.
 */
// Function to get query parameters from URL
function getListingIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id"); // Retrieves ?id=listingID from the URL
}

/**
 * Fetches the listing data from Firestore and displays it on the page.
 * Displays error messages if the listing ID is missing or not found.
 * @returns {Promise<void>}
 */
// Function to fetch and display the listing
async function displayListing() {
    // Get the listing ID from URL
    const listingId = getListingIdFromURL();

    // If no ID found, show error message on the page
    if (!listingId) {
        console.error("No listing ID found in URL.");
        document.getElementById("selected-listing").innerHTML = "<p>Listing not found.</p>";
        return;
    }

    try {
        // Reference the Firestore document for the given listing ID
        const docRef = db.collection("listings").doc(listingId);
        const docSnap = await docRef.get();

        // If listing doesn't exist in database
        if (!docSnap.exists) {
            console.error("Listing does not exist.");
            document.getElementById("selected-listing").innerHTML = "<p>Listing not found.</p>";
            return;
        }

        // Extract data from document
        const listing = docSnap.data();

        // Populate HTML elements with listing data
        document.getElementById("listing-title").innerText = listing.title || "No Title";
        document.getElementById("listing-author").innerText = `Author: ${listing.author || "Unknown"}`;
        document.getElementById("listing-price").innerText = `Price: $${listing.price || "N/A"}`;
        document.getElementById("listing-quality").innerText = `Quality: ${listing.quality || "Unknown"}`;
        document.getElementById("listing-description").innerText = listing.description || "No description available.";
        document.getElementById("listing-username").innerText = `Username: ${listing.username}` || "No description available.";

        // Set the listing image
        document.querySelector('.card-img-top').src = listing.imageUrl;

    } catch (error) {
        // Handle and display error on the page
        console.error("Error fetching listing:", error);
        document.getElementById("selected-listing").innerHTML = "<p>Error loading listing.</p>";
    }
}

/**
 * Executes listing display logic once the DOM is fully loaded.
 */
// Run the function when the page loads
document.addEventListener("DOMContentLoaded", displayListing);
