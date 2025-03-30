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
    const deleteBtn = document.querySelector('.btn-delete');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', deleteButton);
    } else {
        console.error("Delete button not found");
    }
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
                </div>
            </div>
        </div>
    </div>
    `;

    // Add modal to document body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

async function populateUserInfo(user) {
    try {
        console.log("Current user:", user.uid);
        
        // Get user document from Firestore
        const userDoc = await db.collection("users").doc(user.uid).get();

        if (!userDoc.exists) {
            console.error("User document does not exist for UID:", user.uid);
            return;
        }

        // Obtain current user data from fields
        const userData = userDoc.data();
        console.log("User data:", userData);
        
        // Check if sentMessages exists
        if (!userData.sentMessages) {
            console.warn("User has no sentMessages field in their document");
        }

        // Load the messages
        await loadMessages(userData);

    } catch (error) {
        console.error("Error populating user info:", error);
    }
}

async function loadMessages(userData) {
    try {
        // Retrieve current user messages
        const sentMessages = userData.sentMessages || [];
        console.log("Messages sent:", sentMessages);

        // If no messages, display empty state immediately
        if (sentMessages.length === 0) {
            displayMessages([]);
            return;
        }

        // Fetch each message sent and store it in an array to be displayed
        const sentMessagesData = [];
        for (const messageId of sentMessages) {
            try {
                const messageDoc = await db.collection("messages").doc(messageId).get();
                
                if (!messageDoc.exists) {
                    console.warn(`Message with ID ${messageId} does not exist`);
                    continue;
                }
                
                const messageData = messageDoc.data();
                if (!messageData) {
                    console.warn(`No data for message with ID ${messageId}`);
                    continue;
                }
                
                sentMessagesData.push({
                    id: messageId,
                    from: messageData.from || 'Unknown',
                    time: messageData.time ? messageData.time.toDate().toLocaleString() : 'No date available',
                    subject: messageData.subject || 'No subject',
                    read: messageData.read || false,
                    content: messageData.message || "No content available."
                });
            } catch (err) {
                console.error(`Error processing message ${messageId}:`, err);
            }
        }

        console.log("Processed message data:", sentMessagesData);
        // Display the sent messages data
        displayMessages(sentMessagesData);

    } catch (error) {
        console.error("Error loading messages:", error);
        // Still display empty state in case of error
        displayMessages([]);
    }
}

function displayMessages(messages) {
    // HTML container for sent messages
    const messagesContainer = document.getElementById('sentMessages');

    if (!messagesContainer) {
        console.error("Messages container not found! Creating one...");
        // Create the container if it doesn't exist
        const mainContainer = document.querySelector('main') || document.body;
        const newMessagesContainer = document.createElement('div');
        newMessagesContainer.id = 'sentMessages';
        newMessagesContainer.className = 'container mt-4';
        mainContainer.appendChild(newMessagesContainer);
        
        // Now use the newly created container
        return displayMessages(messages);
    }

    // Clear any existing content --> is there a more efficient method?
    messagesContainer.innerHTML = '';

    // If there are no messages
    if (messages.length === 0) {
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
        // Fill in message data -> AI help to use regular expressions in replace method.
        messageElement.innerHTML = `
            <input class="form-check-input me-3" type="checkbox" id="${message.id}">
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
        button.addEventListener('click', function () {
            // Obtain values from made up attributes from each button
            const from = this.getAttribute('data-from');
            const time = this.getAttribute('data-time');
            const subject = this.getAttribute('data-subject');
            const content = this.getAttribute('data-content');

            // Populate modal with message data
            document.getElementById('modalFrom').textContent = from;
            document.getElementById('modalDate').textContent = time;
            document.getElementById('modalSubject').textContent = subject;
            document.getElementById('modalContent').textContent = content;
            
            // Show the modal
            const messageModal = new bootstrap.Modal(document.getElementById('messageModal'));
            messageModal.show();
        });
    });
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
        if (!user) {
            console.error("No user is logged in");
            alert('User authentication error');
            return;
        }
        
        const userId = user.uid;

        // Collect message IDs to delete
        const messageIdsToDelete = Array.from(checkedInputs).map(input => input.id);

        // Get the user document reference
        const userDocRef = db.collection("users").doc(userId);
        const userDoc = await userDocRef.get();
        
        if (!userDoc.exists) {
            console.error("User document does not exist");
            alert('User data not found');
            return;
        }
        
        const userData = userDoc.data();
        
        if (!userData.sentMessages) {
            console.error("sentMessages field is missing in user document");
            alert('User message data not found');
            return;
        }

        // Remove message IDs from user's sentMessages array
        const updatedSentMessages = userData.sentMessages.filter(
            messageId => !messageIdsToDelete.includes(messageId)
        );

        // Delete individual messages from messages collection
        const deleteMessages = messageIdsToDelete.map(messageId => 
            db.collection("messages").doc(messageId).delete()
        );

        // Wait for all message deletions to complete
        await Promise.all(deleteMessages);

        // Update user document with new sentMessages array
        await userDocRef.update({
            sentMessages: updatedSentMessages
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