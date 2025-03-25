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

    // Create modal container for message popup
    createMessageModal();

    // Add event listener to the delete button
    document.querySelector('.btn-delete').addEventListener('click', deleteButton);
});

// AI help to create pop up modal container using Bootstrap
function createMessageModal() {
    // Create the modal HTML
    const modalHTML = `
    <div class="modal fade" id="messageModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="messageModalLabel">Message Details</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <span class="fw-bold">From: </span><span id="modalFrom"></span>
                    </div>
                    <div class="mb-3">
                        <span class="fw-bold">Date: </span><span id="modalDate"></span>
                    </div>
                    <div class="mb-3">
                        <span class="fw-bold">Subject: </span><span id="modalSubject"></span>
                    </div>
                    <div class="mb-3">
                        <span class="fw-bold">Message: </span>
                        <div id="modalContent" class="p-3 border rounded bg-light mt-2"></div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Back</button>
                    <button type="button" class="btn btn-primary" id="replyButton">Reply</button>
                </div>
            </div>
        </div>
    </div>
    `;

    // Add modal to document body
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Add event listener for the reply button
    document.getElementById('replyButton').addEventListener('click', function () {
        const messageId = this.getAttribute('data-message-id'); // custom data-message-id attribute from the button -> unique id
        const username = document.getElementById('modalFrom').textContent; // sender's username from the modal
        const subject = document.getElementById('modalSubject').textContent; // message subject from the modal

        // Store the needed data for reply page
        localStorage.setItem("selectedMessageUsername", username);
        localStorage.setItem("selectedMessageSubject", subject);
        localStorage.setItem("selectedMessageId", messageId);

        // Navigate to reply page
        window.location.href = "reply_message.html";
    });
}

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
                read: messageDoc.data().read || false,
                content: messageDoc.data().message || "No content available."
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
    // HTML container for received messages
    const messagesContainer = document.getElementById('receivedMessages');

    if (!messagesContainer) {
        console.error("Messages container not found!");
        return;
    }

    // Clear any existing content --> is there a more efficient method?
    messagesContainer.innerHTML = '';

    // If there are no messages
    if (messages.length == 0) {
        messagesContainer.innerHTML = "<p class='text-center py-4'>No messages to display.</p>";
        return;
    }

    // Loop through each message data
    messages.forEach(message => {
        const messageElement = document.createElement('div'); // Container holding each message
        // Different styles depending on status
        if (message.read) {
            messageElement.className = 'bg-success-subtle p-3 align-items-center rounded-5 d-flex fs-5 my-3 message'; // Read
        } else {
            messageElement.className = 'bg-primary-subtle p-3 align-items-center rounded-5 d-flex fs-5 my-3 message'; // New
        }
        // Status (New or Read)
        const status = message.read ?
            `<span class="bg-success text-white p-2 rounded-3">Read</span>` : // If true
            `<span class="bg-primary text-white p-2 rounded-3">New</span>`; // If false
        // Fill in message data -> AI help to use regular expressions in replace method.
        messageElement.innerHTML = `
            <input class="form-check-input me-3" type="checkbox" id="${message.id}">
            ${status}
            <span class="ms-3 me-2 fw-bold">From:</span>
            <span class="fw-medium text-nowrap overflow-hidden">${message.from}</span>
            <span class="ms-3 me-2 fw-bold">Date:</span>
            <span class="fw-medium text-nowrap overflow-hidden">${message.time}</span>
            <span class="ms-3 me-2 fw-bold">Subject:</span>
            <span class="fw-medium text-nowrap overflow-hidden">${message.subject}</span>
            <span><button id="${message.id}" type="button" class="ms-3 me-2 fw-bold open-btn" 
                data-from="${message.from}" 
                data-time="${message.time}" 
                data-subject="${message.subject}" 
                data-content="${message.content.replace(/"/g, '&quot;')}">Open</button></span>
        `;
        messagesContainer.prepend(messageElement); // Newer messages to the top
    });

    // Add event listeners for Open buttons
    openButtonEventListeners();
}

function openButtonEventListeners() {
    const openButtons = document.querySelectorAll('.open-btn'); // Select all "Open" buttons

    // Functionality for all "Open" buttons
    openButtons.forEach(button => {
        button.addEventListener('click', async function () {
            // Obtain values from made up attributes from each button
            const messageId = this.id;
            const from = this.getAttribute('data-from');
            const time = this.getAttribute('data-time');
            const subject = this.getAttribute('data-subject');
            const content = this.getAttribute('data-content');

            // Update message read status in Firestore
            await db.collection("messages").doc(messageId).update({
                read: true
            });

            // Find the parent message element (the message being selected by clicking Open) and update its appearance
            const messageElement = this.closest('.message');
            messageElement.classList.remove('bg-primary-subtle');
            messageElement.classList.add('bg-success-subtle');

            // Update the status "Read"/"New"
            const status = messageElement.querySelector('span.bg-primary');
            if (status) {
                status.classList.remove('bg-primary');
                status.classList.add('bg-success');
                status.textContent = 'Read';
            }

            // Populate modal with message data
            document.getElementById('modalFrom').textContent = from;
            document.getElementById('modalDate').textContent = time;
            document.getElementById('modalSubject').textContent = subject;
            document.getElementById('modalContent').textContent = content;
            document.getElementById('replyButton').setAttribute('data-message-id', messageId);

            // Show the modal. AI help.
            const messageModal = new bootstrap.Modal(document.getElementById('messageModal')); // creates a new instance
            messageModal.show(); // uses that instance to display the modal
        });
    });

    function deleteButton() {

    }
}

async function deleteButton() {
    // Get all checked checkboxes
    const checkedInputs = document.querySelectorAll('input[type="checkbox"]:checked');

    // Exit function if nothing selected
    if (checkedInputs.length === 0) {
        alert('No messages selected for deletion');
        return;
    }

    try {
        const user = auth.currentUser;
        const userId = user.uid;

        // Collect message IDs to delete. AI help.
        const messageIdsToDelete = Array.from(checkedInputs).map(input => input.id);

        // Get the user document reference
        const userDocRef = db.collection("users").doc(userId);
        const userDoc = await userDocRef.get();
        const userData = userDoc.data();

        // Remove message IDs from user's receivedMessages array
        const updatedReceivedMessages = userData.receivedMessages.filter(
            messageId => !messageIdsToDelete.includes(messageId)
        );

        // Delete individual messages from messages collection
        const deleteMessages = messageIdsToDelete.map(messageId => 
            db.collection("messages").doc(messageId).delete()
        );

        // Wait for all message deletions to complete
        await Promise.all(deleteMessages);

        // Update user document with new receivedMessages array
        await userDocRef.update({
            receivedMessages: updatedReceivedMessages
        });

        // Remove deleted messages from the UI
        messageIdsToDelete.forEach(messageId => {
            const messageElement = document.getElementById(messageId).closest('.message');
            if (messageElement) {
                messageElement.remove();
            }
        });

        alert(`${messageIdsToDelete.length} message(s) deleted successfully`);
    } catch (error) {
        console.error('Error deleting messages:', error);
        alert('Failed to delete messages');
    }
}