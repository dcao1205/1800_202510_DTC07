import { db } from './firebase_cred.js';

/**
 * Helper function to get query parameters from URL
 * @param {string} name - The query parameter name to retrieve
 * @returns {string} - The value of the query parameter or empty string if not found
 */
function getQueryParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name) || ""; // Return empty string if parameter doesn't exist
}

/**
 * Displays book cards dynamically based on filters and sorting options
 * @param {string} collection - The Firestore collection name to query
 * @param {string} searchText - The search text to filter by title
 */
function displayCardsDynamically(collection, searchText) {
    // Get card template and container elements
    let cardTemplate = document.getElementById("bookCardTemplate");
    let container = document.getElementById(collection + "-go-here");

    // Clear existing content
    container.innerHTML = "";

    // Fetch all documents from the specified collection
    db.collection(collection).get()
        .then(allBooks => {
            let booksArray = [];
            
            // Process each book document
            allBooks.forEach(doc => {
                // Extract book data from document
                var title = doc.data().title;
                var price = doc.data().price;
                var quality = doc.data().quality;
                var datePosted = doc.data().createdAt;
                var imageUrl = doc.data().imageUrl || "https://picsum.photos/250/250"; // Default image if none provided
                var listingId = doc.id;
                var sellerUsername = doc.data().username;

                // Get current filter values
                let maxPrice = parseFloat(document.getElementById("priceFilter").value);
                let selectedQualities = Array.from(document.querySelectorAll(".qualityFilter:checked"))
                    .map(cb => cb.value);

                // Determine if book matches all current filters
                let matchesSearch = title.toLowerCase().includes(searchText.toLowerCase());
                let matchesPrice = parseInt(price) <= maxPrice;
                let matchesQuality = selectedQualities.length === 0 || selectedQualities.includes(quality);

                // Add to array if it matches all filters
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

            // Sort the filtered array based on selected criteria
            const sortBy = document.querySelector('input[name="sortOption"]:checked').value;
            const sortDirection = document.querySelector('input[name="sortDirection"]:checked').value;
            
            booksArray.sort((a, b) => {
                let comparison = 0;
                
                // Determine sort comparison based on selected option
                if (sortBy === 'price') {
                    comparison = parseFloat(a.price) - parseFloat(b.price);
                } else if (sortBy === 'quality') {
                    // Use quality ranking for sorting
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
                
                // Adjust for sort direction (ascending/descending)
                return sortDirection === 'desc' ? -comparison : comparison;
            });

            // Render each book card to the DOM
            booksArray.forEach(book => {
                let newcard = cardTemplate.content.cloneNode(true);

                // Populate card with book data
                newcard.querySelector('.card-title').innerHTML = book.title;
                newcard.querySelector('.card-price').innerHTML = "$" + book.price;
                newcard.querySelector('.card-quality').innerHTML = `Condition: ${book.quality}`;
                newcard.querySelector('.card-img-top').src = book.imageUrl;
                newcard.querySelector('.btn-primary').href = `listingPage.html?id=${book.listingId}`;
                newcard.querySelector('.report-btn').dataset.listingId = book.listingId;
                
                // Set up contact button with seller username
                let contactButton = newcard.querySelector('.create-message');
                contactButton.dataset.sellerUsername = book.sellerUsername;

                // Add card to container
                container.appendChild(newcard);
            });
            
            // Show message if no results found
            if (booksArray.length === 0) {
                container.innerHTML = '<div class="col-12 text-center"><p>No matching listings found. Try adjusting your filters.</p></div>';
            }
        })
        .catch(error => {
            console.error("Error getting listings: ", error);
            container.innerHTML = '<div class="col-12 text-center"><p>Error loading listings. Please try again later.</p></div>';
        });
}

// Event listener for filter application button
document.getElementById("applyFilters").addEventListener("click", () => {
    console.log("Filters applied");

    // Close Bootstrap collapse sections if they are open
    const filterSection = document.getElementById("filterSection");
    const sortSection = document.getElementById("sortSection");

    if (filterSection && filterSection.classList.contains("show")) {
        new bootstrap.Collapse(filterSection, { toggle: false }).hide();
    }

    if (sortSection && sortSection.classList.contains("show")) {
        new bootstrap.Collapse(sortSection, { toggle: false }).hide();
    }

    displayCardsDynamically("listings", getQueryParameter("query"));
});

// Event listeners for sort option changes
document.querySelectorAll('input[name="sortOption"], input[name="sortDirection"]').forEach(radio => {
    radio.addEventListener('change', () => {
        displayCardsDynamically("listings", getQueryParameter("query"));
    });
});

// Get initial search query and display listings
const searchQuery = getQueryParameter("query");
displayCardsDynamically("listings", searchQuery);

// Set up event listeners for contact buttons after DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    /**
     * Attaches event listeners to all contact buttons
     */
    function attachEventListeners() {
        document.querySelectorAll(".create-message").forEach(button => {
            button.addEventListener("click", function () {
                try {
                    // Get seller username from button's dataset
                    let username = button.dataset.sellerUsername;
                    if (!username) {
                        console.error("Seller username not found.");
                        return;
                    }

                    // Store username and navigate to message page
                    localStorage.setItem("selectedSellerUsername", username);
                    window.location.href = "createMessage.html";
                } catch (error) {
                    console.error("Error processing username:", error);
                    window.location.href = "createMessage.html";
                }
            });
        });
    }

    // Delay attaching listeners to ensure dynamic content is loaded
    setTimeout(attachEventListeners, 1000);
});