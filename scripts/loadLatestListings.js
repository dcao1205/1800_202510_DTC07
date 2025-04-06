import { db } from './firebase_cred.js';

async function loadLatestListings() {
    const container = document.getElementById('latest-listings-container');
    if (!container) return;

    try {
        const snapshot = await db.collection("listings")
            .orderBy("createdAt", "desc")
            .limit(10)
            .get();

        if (snapshot.empty) {
            container.innerHTML = '<p class="text-center">No listings available.</p>';
            return;
        }

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
            container.innerHTML += card;
        });
    } catch (error) {
        console.error("Failed to load latest listings:", error);
    }
}

document.addEventListener('DOMContentLoaded', loadLatestListings);
