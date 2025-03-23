import { auth, db } from './firebase_cred.js';

// Function to fetch and display saved listings
async function displayMyListings() {
    const user = auth.currentUser;
    if (!user) {
        console.error("User not logged in.");
        return;
    }

    try {
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


        const listingsQuery = await db.collection("listings")
            .where("username", "==", currentUsername)
            .get();

        const listingsContainer = document.getElementById("my-listings-container"); // or rename it if you want
        listingsContainer.innerHTML = ""; // Clear old results

        if (listingsQuery.empty) {
            listingsContainer.innerHTML = "<p class='text-center'>You haven't posted any listings yet.</p>";
            return;
        }

        listingsQuery.forEach((doc) => {
            const listing = doc.data();
            const listingId = doc.id;

            const cardHTML = `
                <div class="col">
                    <div class="card h-100">
                        <img src="${listing.imageUrl || 'https://picsum.photos/250/250'}" class="card-img-top" alt="Textbook Image">
                        <div class="card-body">
                            <h5 class="card-title">${listing.title}</h5>
                            <p class="card-text">$${listing.price}</p>
                            <a href="textbook_page.html?id=${listingId}" class="btn btn-primary">View Details</a>
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
        displayMyListings();
    }
});
