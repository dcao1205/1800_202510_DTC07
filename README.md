
# Project Name

## Overview
Summarize your project's purpose, problem solved, key features, user benefits, development context, and main technologies used.

Example:

Our team, DTC-07, is developing a platform exclusively designed for students, offering enhanced features with a modern, simple user interface to make buying and selling second-hand textbooks easier.

Developed for the COMP 1800 course, applying User-Centred Design practices, agile project management processes, and Firebase backend services.

---

## Features

Example:
- Create and customize a profile page
- Adding/Deleting custom listings
- Search for and filter/sort for a listing you want
- Save listings to your account for later
- Message the owner of a listing or delete a message you have already sent
- View and respond to messages people have sent you

---

## Technologies Used

Example:
- **Frontend**: HTML, CSS, JavaScript, Bootstrap
- **Backend**: Firebase for hosting
- **Database**: Firestore, Firebase Storage

---

## Usage

Example:
1. Open your browser and visit `https://comp1800-61585.web.app/`.
2. Create an account and fill out user information according to instructions
3. Type a search term in the search bar to find matching listings
4. Click "contact seller" to message the seller
5. Click the "Add" button in the navbar to add a custom listing

---

## Project Structure

```
TextLibre/
├── README.md
├── .gitignore
├── firebase.json
├── firestore.indexes.json
├── firestore.rules
├── storage.rules
├── src/
│   ├── 404.html
│   ├── createListing.html
│   ├── createMessage.html
│   ├── editPersonalInfo.html
│   ├── homePage.html
│   ├── index.html
│   ├── listing_page.html
│   ├── listings.html
│   ├── myListings.html
│   ├── replyMessage.html
│   ├── saveListings.html
│   ├── signin.html
│   ├── signup.html
│   ├── userInfoPage.html
│   ├── viewMessage.html
│   ├── viewSentMessages.html
│   ├── scripts/
│   │   ├── createMessage.js
│   │   ├── sendMessage.js
│   │   ├── fbSignin.js
│   │   ├── fbSignup.js
│   │   ├── firebase_cred.js
│   │   ├── footer.js
│   │   ├── getListingDetails.js
│   │   ├── getListing.js
│   │   ├── getMyListings.js
│   │   ├── getSavedListings.js
│   │   ├── homePage.js
│   │   ├── loadLatestListings.js
│   │   ├── loadUserInfo.js
│   │   ├── loggedInHeader.js
│   │   ├── loggedOutFooter.js
│   │   ├── loggedOutHeader.js
│   │   ├── profileHeader.js
│   │   ├── reply.js
│   │   ├── reports.js
│   │   ├── saveListing.js
│   │   ├── storeListing.js
│   │   ├── storePersonalInfo.js
│   │   ├── userHeader.js
│   │   ├── viewMessages.js
│   │   └── viewSentMessages.js
│   ├── styles/
│       ├── homepage.css
│       ├── listings.css
│       └── style.css
│   ├── templates/
│       ├── footer.html
│       ├── loggedOutFooter.html
│       ├── loggedOutHeader.html
│       ├── loggedInFooter.html
│       ├── loggedInHeader.html
│       └── userHeader.html
│   └── unused/
│       ├── otherUserInfo.js
│       ├── otherUserInfo.html
│       ├── userPageTemplate.html
│       └── indexFormer.html

```

---

## Contributors
- **Derek Cao** - BCIT CST Student with a passion for creating user-friendly applications. Fun fact: Loves solving Rubik's Cubes in under a minute.
- **Woojin S** - BCIT CST Student with a passion for creating user-friendly applications. Fun fact: Loves solving Rubik's Cubes in under a minute.
- **Tracy Chung** - BCIT CST Student with a passion for creating user-friendly applications. Fun fact: Loves solving Rubik's Cubes in under a minute.

---

## Acknowledgments

Example:
- Ui design done using [Bootstrap](https://getbootstrap.com).

---

## Limitations and Future Work
### Limitations

Example:
- Currently, the app does not support editing listings
- No way to review a seller after a transaction
- The user interface can be further enhanced for ease of use and accessbility.

### Future Work

Example: 
- Add support for editing listings
- Allow users to search for more than just book name
- Add the ability to leave reviews on a seller's page
- Read indicators on messages
- Allow more school supplies than just textbooks to be sold on the site

---

## License

Example:
This project is licensed under the MIT License. See the LICENSE file for details.
