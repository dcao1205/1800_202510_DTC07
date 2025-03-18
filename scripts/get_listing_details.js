import { auth, db } from './firebase_cred.js';


// Function to get query parameters from URL
function getListingIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id"); // Retrieves ?id=listingID from the URL
}

// Function to fetch and display the listing
async function displayListing() {
    const listingId = getListingIdFromURL();

    if (!listingId) {
        console.error("No listing ID found in URL.");
        document.getElementById("selected-listing").innerHTML = "<p>Listing not found.</p>";
        return;
    }

    try {
        const docRef = db.collection("listings").doc(listingId);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            console.error("Listing does not exist.");
            document.getElementById("selected-listing").innerHTML = "<p>Listing not found.</p>";
            return;
        }

        const listing = docSnap.data();

        document.getElementById("listing-title").innerText = listing.title || "No Title";
        document.getElementById("listing-author").innerText = `Author: ${listing.author || "Unknown"}`;
        document.getElementById("listing-price").innerText = `Price: $${listing.price || "N/A"}`;
        document.getElementById("listing-quality").innerText = `Quality: ${listing.quality || "Unknown"}`;
        document.getElementById("listing-description").innerText = listing.description || "No description available.";
        document.getElementById("listing-username").innerText = `Username: ${listing.username}` || "No description available.";

    } catch (error) {
        console.error("Error fetching listing:", error);
        document.getElementById("selected-listing").innerHTML = "<p>Error loading listing.</p>";
    }
}

// Run the function when the page loads
document.addEventListener("DOMContentLoaded", displayListing);
