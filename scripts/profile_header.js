import { auth, db } from './firebase_cred.js';

document.addEventListener('DOMContentLoaded', async function () {
    // Get all navigation buttons
    const navButtons = document.querySelectorAll('.nav-btn');
    const messageBtn = document.getElementById('messages');

    // Add click event listener to each button
    navButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Remove active class from all buttons
            navButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            this.classList.add('active');
        });
    });

    // Replace default homepage with message page when the message button is clicked
    messageBtn.addEventListener('click', async function () {
        const user = auth.currentUser;

        if (!user) {
            console.error("No user is logged in.");
            alert("Please log in to view messages.");
            return;
        }

        try {
            const userDoc = await db.collection("users").doc(user.uid).get();

            if (!userDoc.exists) {
                console.warn("User document does not exist.");
                alert("User data not found.");
                return;
            }

            const userData = userDoc.data();
            console.log("User Data:", userData);

            // Retrieve current user messages
            const receivedMessages = userData.receivedMessages || [];
            const sentMessages = userData.sentMessages || [];
            console.log("Message IDs:", receivedMessages, sentMessages);

            // Fetch each message document and store it in an array
            const receivedMessagesData = [];
            for (const messageId of receivedMessages) {
                const messageDoc = await db.collection("messages").doc(messageId).get();
                if (messageDoc.exists) {
                    receivedMessagesData.push({
                        id: messageId,
                        from: messageDoc.data().from,
                        time: messageDoc.data().time.toDate().toLocaleString(),
                        subject: messageDoc.data().subject
                    });
                } else {
                    console.log(`Message with ID ${messageId} does not exist`);
                }
            }

            console.log("Full message data:", receivedMessagesData);
            displayMessages(receivedMessagesData);

        } catch (error) {
            console.error("Error populating message page:", error);
            alert('Error loading messages.');
        }
    });
});

// Function to display messages in the UI
function displayMessages(messages) {
    const messagesContainer = document.getElementById('change');

    // Clear the previous content
    messagesContainer.innerHTML = "";

    // If there are no messages
    if (messages.length === 0) {
        messagesContainer.innerHTML = "<p>No messages to display.</p>";
        return;
    }

    // Base template
    messagesContainer.className = "container mb-5 bg-body-secondary pb-3 rounded mt-5";
    const messagesHeader = document.createElement('div');
    messagesHeader.innerHTML = `
        <div class="position-relative d-flex justify-content-center">
            <div class="position-absolute start-0 top-50 translate-middle-y d-flex gap-3 ms-5">
                <button id="delete-btn">DELETE</button>
                <button id="read-btn">READ</button>
            </div>
            <h1 class="py-2">Your Messages</h1>
        </div>
        <div id="messages-list"></div>
    `;

    // Where dynamic messages get appended to
    const messagesList = messagesHeader.querySelector("#messages-list");

    // Loop through each message data --> MISSING NEW/READ FORMAT
    messages.forEach(message => {
        const messageElement = document.createElement('div');
        messageElement.className = 'bg-primary-subtle p-3 align-items-center rounded-5 d-flex fs-5 my-3';
        messageElement.innerHTML = `
            <input type="checkbox" class="me-3 ms-1 selected">
            <span class="bg-primary text-white p-2 rounded-3">New</span>
            <span class="ms-3 me-2 fw-bold">From:</span>
            <span class="fw-medium">${message.from}</span>
            <span class="ms-3 me-2 fw-bold">Date:</span>
            <span class="fw-medium text-nowrap overflow-hidden">${message.time}</span>
            <span class="ms-3 me-2 fw-bold">Subject:</span>
            <span class="fw-medium text-nowrap overflow-hidden">${message.subject}</span>
        `;
        messagesList.appendChild(messageElement);
    });

    messagesContainer.appendChild(messagesHeader);
}