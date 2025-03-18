import { db } from './firebase_cred.js';

function getQueryParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name) || ""; //if none, empty string
}

function displayCardsDynamically(collection, searchText) {
    let cardTemplate = document.getElementById("bookCardTemplate");
    let container = document.getElementById(collection + "-go-here");

    container.innerHTML = ""

    db.collection(collection).get()
        .then(allBooks => {
            allBooks.forEach(doc => {
                var title = doc.data().title;
                var price = "$" + doc.data().price;
                var quality = doc.data().quality
                var imageUrl = doc.data().imageUrl || "https://picsum.photos/250/250";
                var listingId = doc.id;

                let maxPrice = parseFloat(document.getElementById("priceFilter").value);
                let selectedQualities = Array.from(document.querySelectorAll(".qualityFilter:checked"))
                    .map(cb => cb.value);

                // Filtering conditions
                let matchesSearch = title.toLowerCase().includes(searchText.toLowerCase());
                let matchesPrice = parseInt(doc.data().price) <= maxPrice;
                let matchesQuality = selectedQualities.length === 0 || selectedQualities.includes(quality);
                console.log("quality ="+quality)
                console.log("selected qualities")
                console.log(selectedQualities)

                if (matchesSearch && matchesPrice && matchesQuality) {
                    let newcard = cardTemplate.content.cloneNode(true);

                    newcard.querySelector('.card-title').innerHTML = title;
                    newcard.querySelector('.card-price').innerHTML = price;
                    newcard.querySelector('.card-quality').innerHTML = `Condition: ${quality}`;
                    newcard.querySelector('.card-img-top').src = imageUrl;

                    newcard.querySelector('.btn-primary').href = `textbook_page.html?id=${listingId}`;

                document.getElementById(collection+"-go-here").appendChild(newcard);
            }})
        })
        
}

document.getElementById("applyFilters").addEventListener("click", () => {
    console.log("clicked")
    displayCardsDynamically("listings", getQueryParameter("query"));
});

const searchQuery = getQueryParameter("query");

displayCardsDynamically("listings", searchQuery);