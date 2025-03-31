import { auth, db } from './firebase_cred.js';

// Function to fetch and display saved listings
async function displaySavedListings() {
    const user = auth.currentUser;
    if (!user) {
        console.error("User not logged in.");
        return;
    }

    const userRef = db.collection("users").doc(user.uid);

    try {
        const userDoc = await userRef.get();
        if (!userDoc.exists || !userDoc.data().savedListings) {
            console.log("No saved listings found.");
            return;
        }

        const savedListings = userDoc.data().savedListings;
        const listingsContainer = document.getElementById("saved-listings-container");

        listingsContainer.innerHTML = ""; // Clear existing listings

        savedListings.forEach(async (listingId) => {
            const listingRef = db.collection("listings").doc(listingId);
            const listingDoc = await listingRef.get();

            if (!listingDoc.exists) {
                console.warn(`Listing ${listingId} does not exist.`);
                return;
            }

            const listing = listingDoc.data();
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
                            <a href="textbook_page.html?id=${listingId}" class="btn btn-primary mt-3">View Details</a>
                        </div>
                    </div>
                </div>
            `;


            listingsContainer.innerHTML += cardHTML;
        });

    } catch (error) {
        console.error("Error retrieving saved listings:", error);
    }
}

// Run function when user is authenticated
auth.onAuthStateChanged((user) => {
    if (user) {
        displaySavedListings();
    }
});
