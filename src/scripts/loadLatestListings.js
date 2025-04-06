import { db } from './firebase_cred.js';

/**
 * Loads and displays the latest 10 listings sorted by creation time.
 * Appends listing cards to the #latest-listings-container element.
 * @returns {Promise<void>}
 */
async function loadLatestListings() {
    const container = document.getElementById('latest-listings-container');
    if (!container) return;

    try {
        // Query Firestore for the 10 most recent listings
        const snapshot = await db.collection("listings")
            .orderBy("createdAt", "desc")
            .limit(10)
            .get();

        // If no listings found, display fallback message
        if (snapshot.empty) {
            container.innerHTML = '<p class="text-center">No listings available.</p>';
            return;
        }

        // Loop through each listing document and generate card HTML
        snapshot.forEach(doc => {
            const listing = doc.data();
            const listingId = doc.id;

            const card = `
                <div class="col d-flex">
                    <div class="card h-100 w-100">
                        <img src="${listing.imageUrl || 'https://picsum.photos/250/250'}"
                        class="card-img-top object-fit-cover"
                        style="aspect-ratio: 1 / 1; width: 100%; height: auto;"
                        alt="${listing.title}">

                        <div class="card-body">
                            <h5 class="card-title">${listing.title}</h5>
                            <p class="card-text">$${listing.price}</p>
                            <a href="listingPage.html?id=${listingId}" class="btn btn-primary">View Details</a>
                        </div>
                    </div>
                </div>
            `;
            // Append card to the container
            container.innerHTML += card;
        });
    } catch (error) {
        console.error("Failed to load latest listings:", error);
    }
}
/**
 * Runs the latest listings loader once the DOM is ready.
 */
document.addEventListener('DOMContentLoaded', loadLatestListings);
