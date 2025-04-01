import { db } from './firebase_cred.js';

function getQueryParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name) || ""; //if none, empty string
}

function displayCardsDynamically(collection, searchText) {
    let cardTemplate = document.getElementById("bookCardTemplate");
    let container = document.getElementById(collection + "-go-here");

    container.innerHTML = "";

    db.collection(collection).get()
        .then(allBooks => {
            let booksArray = [];
            
            allBooks.forEach(doc => {
                var title = doc.data().title;
                var price = doc.data().price;
                var quality = doc.data().quality;
                var datePosted = doc.data().createdAt
                var imageUrl = doc.data().imageUrl || "https://picsum.photos/250/250";
                var listingId = doc.id;
                var sellerUsername = doc.data().username;

                let maxPrice = parseFloat(document.getElementById("priceFilter").value);
                let selectedQualities = Array.from(document.querySelectorAll(".qualityFilter:checked"))
                    .map(cb => cb.value);

                // Filtering conditions
                let matchesSearch = title.toLowerCase().includes(searchText.toLowerCase());
                let matchesPrice = parseInt(price) <= maxPrice;
                let matchesQuality = selectedQualities.length === 0 || selectedQualities.includes(quality);

                if (matchesSearch && matchesPrice && matchesQuality) {
                    booksArray.push({
                        title: title,
                        price: price,
                        quality: quality,
                        datePosted: datePosted,
                        imageUrl: imageUrl,
                        listingId: listingId,
                        sellerUsername: sellerUsername
                    });
                }
            });

            // Sort the array based on selected criteria
            const sortBy = document.querySelector('input[name="sortOption"]:checked').value;
            const sortDirection = document.querySelector('input[name="sortDirection"]:checked').value;
            
            booksArray.sort((a, b) => {
                let comparison = 0;
                
                if (sortBy === 'price') {
                    comparison = parseFloat(a.price) - parseFloat(b.price);
                } else if (sortBy === 'quality') {
                    // Sort by quality ranking
                    const qualityRank = {
                        'New': 4,
                        'Like New': 3,
                        'Used': 2,
                        'Worn': 1
                    };
                    comparison = qualityRank[a.quality] - qualityRank[b.quality];
                } else if (sortBy === 'datePosted') {
                    comparison = a.datePosted - b.datePosted;
                }
                
                // Reverse for descending order if needed
                return sortDirection === 'desc' ? -comparison : comparison;
            });

            // Render the sorted and filtered cards
            booksArray.forEach(book => {
                let newcard = cardTemplate.content.cloneNode(true);

                newcard.querySelector('.card-title').innerHTML = book.title;
                newcard.querySelector('.card-price').innerHTML = "$" + book.price;
                newcard.querySelector('.card-quality').innerHTML = `Condition: ${book.quality}`;
                newcard.querySelector('.card-img-top').src = book.imageUrl;
                newcard.querySelector('.btn-primary').href = `listing_page.html?id=${book.listingId}`;
                newcard.querySelector('.report-btn').dataset.listingId = book.listingId;
                
                let contactButton = newcard.querySelector('.create-message');
                contactButton.dataset.sellerUsername = book.sellerUsername;

                container.appendChild(newcard);
            });
            
            // Show message if no results
            if (booksArray.length === 0) {
                container.innerHTML = '<div class="col-12 text-center"><p>No matching listings found. Try adjusting your filters.</p></div>';
            }
        })
        .catch(error => {
            console.error("Error getting listings: ", error);
            container.innerHTML = '<div class="col-12 text-center"><p>Error loading listings. Please try again later.</p></div>';
        });
}

document.getElementById("applyFilters").addEventListener("click", () => {
    console.log("clicked")
    displayCardsDynamically("listings", getQueryParameter("query"));
});

document.querySelectorAll('input[name="sortOption"], input[name="sortDirection"]').forEach(radio => {
    radio.addEventListener('change', () => {
        displayCardsDynamically("listings", getQueryParameter("query"));
    });
});

const searchQuery = getQueryParameter("query");

displayCardsDynamically("listings", searchQuery);

document.addEventListener('DOMContentLoaded', function () {
    function attachEventListeners() {
        document.querySelectorAll(".create-message").forEach(button => {
            button.addEventListener("click", function () {
                try {
                    let username = button.dataset.sellerUsername; // Get username from dataset
                    if (!username) {
                        console.error("Seller username not found.");
                        return;
                    }

                    localStorage.setItem("selectedSellerUsername", username);
                    window.location.href = "create_message.html";
                } catch (error) {
                    console.error("Error processing username:", error);
                    window.location.href = "create_message.html";
                }
            });
        });
    }

    setTimeout(attachEventListeners, 1000);
});