import { db } from './firebase_cred.js';

function getQueryParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name) || ""; //if none, empty string
}

function displayCardsDynamically(collection, searchText) {
    let cardTemplate = document.getElementById("bookCardTemplate");
    let container = document.getElementById(collection + "-go-here");

    db.collection(collection).get()
        .then(allBooks => {
            allBooks.forEach(doc => {
                var title = doc.data().title;
                var price = "$" + doc.data().price;
                var imageUrl = doc.data().imageUrl || "https://picsum.photos/250/250";

                if (title.toLowerCase().includes(searchText.toLowerCase())) {
                    let newcard = cardTemplate.content.cloneNode(true);

                    newcard.querySelector('.card-title').innerHTML = title;
                    newcard.querySelector('.card-price').innerHTML = price;
                    newcard.querySelector('.card-img-top').src = imageUrl;

                    container.appendChild(newcard);
                }
            });
        });
}

const searchQuery = getQueryParameter("query");

displayCardsDynamically("listings", searchQuery);