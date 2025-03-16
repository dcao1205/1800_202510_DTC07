import { db } from './firebase_cred.js';

function displayCardsDynamically(collection) {
    let cardTemplate = document.getElementById("bookCardTemplate")

    db.collection(collection).get()
        .then(allBooks => {
            allBooks.forEach(doc => {
                var title = doc.data().title;
                var price = "$"+doc.data().price;
                var imageUrl = doc.data().imageUrl || "https://picsum.photos/250/250";

                //var docID = doc.id;
                let newcard = cardTemplate.content.cloneNode(true);

                newcard.querySelector('.card-title').innerHTML = title;
                newcard.querySelector('.card-price').innerHTML = price;
                newcard.querySelector('.card-img-top').src = imageUrl;

                document.getElementById(collection+"-go-here").appendChild(newcard);
            })
        })
}

displayCardsDynamically("listings")