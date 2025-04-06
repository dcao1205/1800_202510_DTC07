import { auth, db } from './firebase_cred.js';

/**
 * Fetches and displays the user's saved listings from Firestore.
 * Cleans up invalid listing references if some have been deleted.
 * @returns {Promise<void>}
 */
async function displaySavedListings() {
    const user = auth.currentUser;
    // Check if user is logged in
    if (!user) {
        console.error("User not logged in.");
        return;
    }

    const userRef = db.collection("users").doc(user.uid);

    try {
        const userDoc = await userRef.get();
        // Exit if no saved listings found
        if (!userDoc.exists || !userDoc.data().savedListings) {
            console.log("No saved listings found.");
            return;
        }

        let savedListings = userDoc.data().savedListings;
        const listingsContainer = document.getElementById("saved-listings-container");

        listingsContainer.innerHTML = ""; // Clear existing listings

        let validListings = [];

        // Loop through each saved listing ID
        for (const listingId of savedListings) {
            const listingRef = db.collection("listings").doc(listingId);
            const listingDoc = await listingRef.get();

            // Skip and log if listing no longer exists
            if (!listingDoc.exists) {
                console.log(`Listing ${listingId} does not exist. Removing from saved listings.`);
                continue;
            }

            validListings.push(listingId);
            const listing = listingDoc.data();
            // Build and insert listing card HTML
            const cardHTML = `
                <div class="col d-flex">
                    <div class="card h-100 w-100">
                        <img src="${listing.imageUrl || 'https://picsum.photos/250/250'}"
                            class="card-img-top"
                            style="object-fit: cover; aspect-ratio: 1 / 1;"
                            alt="Textbook Image">
                        <div class="card-body d-flex flex-column justify-content-between">
                            <div>
                                <h5 class="card-title text-truncate">${listing.title}</h5>
                                <p class="card-text">$${listing.price}</p>
                            </div>
                            <a href="listingPage.html?id=${listingId}" class="btn btn-primary mt-3">View Details</a>
                        </div>
                    </div>
                </div>
            `;
            listingsContainer.innerHTML += cardHTML;
        }

        // If any invalid listings were removed, update the saved listings array
        if (validListings.length !== savedListings.length) {
            await userRef.update({ savedListings: validListings });
        }

    } catch (error) {
        console.error("Error retrieving saved listings:", error);
    }
}

/**
 * Displays saved listings once the user is authenticated.
 * @param {firebase.User|null} user - The currently signed-in user
 */
auth.onAuthStateChanged((user) => {
    if (user) {
        displaySavedListings();
    }
});
