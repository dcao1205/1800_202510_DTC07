import { auth, db } from './firebase_cred.js';

/**
 * Fetches and displays listings created by the currently signed-in user.
 * If user is not logged in or no listings are found, appropriate messages are shown.
 * @returns {Promise<void>}
 */
async function displayMyListings() {
    const user = auth.currentUser;
    // Check if user is logged in
    if (!user) {
        console.error("User not logged in.");
        return;
    }

    try {
        // Get user document to retrieve their username
        const userDoc = await db.collection("users").doc(user.uid).get();
        if (!userDoc.exists) {
            console.error("User document not found.");
            return;
        }

        const currentUsername = userDoc.data().username;
        if (!currentUsername) {
            console.error("Username not found in user document.");
            return;
        }

        // Query Firestore for listings by this username
        const listingsQuery = await db.collection("listings")
            .where("username", "==", currentUsername)
            .get();

        const listingsContainer = document.getElementById("my-listings-container"); // or rename it if you want
        listingsContainer.innerHTML = ""; // Clear old results

        // If no listings found, show messag
        if (listingsQuery.empty) {
            listingsContainer.innerHTML = "<p class='text-center'>You haven't posted any listings yet.</p>";
            return;
        }

        // Loop through each listing and display it
        listingsQuery.forEach((doc) => {
            const listing = doc.data();
            const listingId = doc.id;

            // Create listing card
            const listingElement = document.createElement("div");
            listingElement.classList.add("col");
            listingElement.id = `listing-${listingId}`;

            listingElement.innerHTML = `
                <div class="card h-100 w-100">
                    <img src="${listing.imageUrl || 'https://picsum.photos/250/250'}" 
                    class="card-img-top" style="object-fit: cover; aspect-ratio: 1 / 1;"
                    alt="Textbook Image">
                    <div class="card-body d-flex flex-column justify-content-between">
                        <div>
                        <h5 class="card-title text-truncate">${listing.title}</h5>
                        <p class="card-text">$${listing.price}</p>
                    </div>
                    <div class="d-grid gap-2 mt-3">
                        <a href="listingPage.html?id=${listingId}" class="btn btn-primary">View Details</a>
                        <button class="btn btn-danger delete-btn">Delete Listing</button>
                    </div>
                </div>
            </div>
        `;
            // Append to container
            listingsContainer.appendChild(listingElement);

            // Attach event listener to delete button
            listingElement.querySelector(".delete-btn").addEventListener("click", () => {
                deleteListing(listingId, listing.title);
            });
        });

    } catch (error) {
        console.error("Error retrieving saved listings:", error);
    }
}

/**
 * Deletes a listing from Firestore and removes it from the DOM.
 * @param {string} listingId - The ID of the listing document to delete
 * @param {string} listingTitle - The title of the listing (for confirmation message)
 * @returns {Promise<void>}
 */
async function deleteListing(listingId, listingTitle) {
    const confirmation = confirm(`Are you sure you want to delete "${listingTitle}"?`);
    if (!confirmation) return;

    try {
        // Delete from Firestore
        await db.collection("listings").doc(listingId).delete();
        // Remove element from DOM
        document.getElementById(`listing-${listingId}`).remove();
        console.log(`Listing "${listingTitle}" deleted successfully`);
    } catch (error) {
        console.error("Error deleting listing:", error);
    }
}

/**
 * Triggers listing display when user authentication is confirmed.
 * @param {firebase.User|null} user - The currently signed-in user
 */
auth.onAuthStateChanged((user) => {
    if (user) {
        displayMyListings();
    }
});
