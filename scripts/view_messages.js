import { auth, db } from './firebase_cred.js';

document.addEventListener('DOMContentLoaded', async function () {
    // Get the current user
    const user = auth.currentUser;

    if (!user) {
        // Wait for auth state to change if user is not immediately available
        auth.onAuthStateChanged(async function (user) {
            if (user) {
                await populateUserInfo(user);
            } else {
                console.error("No user is logged in.");
                window.location.href = "login.html";
            }
        });
    } else {
        // Begin chain of functions to fetch and load user messages
        await populateUserInfo(user);
    }

});

async function populateUserInfo(user) {
    try {
        // Get user document from Firestore
        const userDoc = await db.collection("users").doc(user.uid).get();

        if (!userDoc.exists) {
            console.error("User document does not exist.");
            return;
        }

        // Obtain current user data from fields
        const userData = userDoc.data();

        // Load the messages
        await loadMessages(userData);

    } catch (error) {
        console.error("Error populating user info:", error);
    }
}

async function loadMessages(userData) {
    try {
        // Retrieve current user messages
        const receivedMessages = userData.receivedMessages || [];
        console.log("Messages received:", receivedMessages);

        // Fetch each message received and store it in an array to be displayed
        const receivedMessagesData = [];
        for (const messageId of receivedMessages) {
            const messageDoc = await db.collection("messages").doc(messageId).get();
            receivedMessagesData.push({
                id: messageId,
                from: messageDoc.data().from,
                time: messageDoc.data().time.toDate().toLocaleString(),
                subject: messageDoc.data().subject,
                read: messageDoc.data().read || false
            });
        }

        console.log("Message data:", receivedMessagesData);
        // Display the received messages data
        displayMessages(receivedMessagesData);

    } catch (error) {
        console.error("Error loading messages:", error);
    }
}

function displayMessages(messages) {
    // HTML container to prepend received messages
    const messagesContainer = document.getElementById('receivedMessages');

    if (!messagesContainer) {
        console.error("Messages container not found!");
        return;
    }

    // Clear any existing content
    messagesContainer.innerHTML = '';

    // If there are no messages
    if (messages.length === 0) {
        messagesContainer.innerHTML = "<p class='text-center py-4'>No messages to display.</p>";
        return;
    }

    // Loop through each message data
    messages.forEach(message => {
        const messageElement = document.createElement('div');
        if (message.read) {
            messageElement.className = 'bg-success-subtle p-3 align-items-center rounded-5 d-flex fs-5 my-3 message';
        } else {
            messageElement.className = 'bg-primary-subtle p-3 align-items-center rounded-5 d-flex fs-5 my-3 message';
        }
        // Status badge (New or Read)
        const status = message.read ?
            `<span class="bg-success text-white p-2 rounded-3">Read</span>
            
            `:
            `<span class="bg-primary text-white p-2 rounded-3">New</span>`;
        // Fill in message data
        messageElement.innerHTML = `
            <input class="form-check-input me-3" type="checkbox" id="input-${message.id}">
            ${status}
            <span class="ms-3 me-2 fw-bold">From:</span>
            <span class="fw-medium text-nowrap overflow-hidden">${message.from}</span>
            <span class="ms-3 me-2 fw-bold">Date:</span>
            <span class="fw-medium text-nowrap overflow-hidden">${message.time}</span>
            <span class="ms-3 me-2 fw-bold">Subject:</span>
            <span class="fw-medium text-nowrap overflow-hidden">${message.subject}</span>
            <span><button id="${message.id}" type="button" class="ms-3 me-2 fw-bold open-btn">Open</button></span>
        `;
        messagesContainer.prepend(messageElement);
    });

    // Add event listeners for Open buttons
    openButtonEventListeners();
}

function openButtonEventListeners() {
    const openButtons = document.querySelectorAll('.open-btn');
    // AI help to retrieve message data from the selected message
    openButtons.forEach(button => {
        button.addEventListener('click', async function () {
            // Find the parent message element (the message being click on with "Open")
            const messageElement = this.closest('.message');

            // Extract the username (sender) from the message element
            const fromSpans = messageElement.querySelectorAll('span');
            let username = null;
            let subject = null;

            // Look through spans to find the one after "From:"
            for (let i = 0; i < fromSpans.length; i++) {
                if (fromSpans[i].textContent === 'From:' && i + 1 < fromSpans.length) {
                    username = fromSpans[i + 1].textContent;
                    break;
                }
            }

            // Find subject as well from "Subject:"
            for (let i = 0; i < fromSpans.length; i++) {
                if (fromSpans[i].textContent === 'Subject:' && i + 1 < fromSpans.length) {
                    subject = fromSpans[i + 1].textContent;
                    break;
                }
            }

            if (username) {
                // Store the username and subject for use on the reply page
                localStorage.setItem("selectedMessageUsername", username);
                localStorage.setItem("selectedMessageSubject", subject);
                localStorage.setItem("selectedMessageId", this.id);

                // Change status of message to read and display different colours
                await db.collection("messages").doc(this.id).update({
                    read: true
                })

                // Navigate to the reply page
                window.location.href = "reply_message.html";
            } else {
                console.error("Could not find username in the message");
            }
        });
    });
}