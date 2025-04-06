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

/**
 * Creates a Bootstrap modal for displaying full message content
 * Modal contains fields for: From, Date, Subject, and Message content
 */
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

/**
 * Fetches and displays user information and messages
 * @param {Object} user - Firebase user object
 */
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

/**
 * Loads message data from Firestore
 * @param {Object} userData - User document data
 */
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

/**
 * Displays messages in the UI
 * @param {Array} messages - Array of message objects to display
 */
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

        // Apply yellow background using Bootstrap's warning color
        messageElement.className = 'bg-warning-subtle p-3 rounded-5 fs-5 my-3 message';

        // Status badge - keep track of read status but make all yellow
        const status = message.read ?
            `<span class="bg-warning text-dark p-2 rounded-3">Read</span>` :
            `<span class="bg-warning text-dark p-2 rounded-3">New</span>`;

        // Fill in message data with improved layout and consistent yellow styling
        messageElement.innerHTML = `
            <div class="d-flex align-items-center w-100">
                <input class="form-check-input me-3 flex-shrink-0" type="checkbox" id="${message.id}">
                <div class="d-flex flex-grow-1 flex-wrap overflow-hidden">
                    <div class="d-flex me-3 flex-nowrap">
                        <span class="fw-bold me-2">From:</span>
                        <span class="fw-medium text-truncate">${message.from}</span>
                    </div>
                    <div class="d-flex me-3 flex-nowrap">
                        <span class="fw-bold me-2">Date:</span>
                        <span class="fw-medium text-truncate">${message.time}</span>
                    </div>
                    <div class="d-flex me-3 flex-nowrap">
                        <span class="fw-bold me-2">Subject:</span>
                        <span class="fw-medium text-truncate">${message.subject}</span>
                    </div>
                </div>
                <div class="ms-auto flex-shrink-0">
                    <button id="${message.id}" type="button" class="btn btn-outline-primary open-btn" 
                        data-from="${message.from}" 
                        data-time="${message.time}" 
                        data-subject="${message.subject}" 
                        data-content="${message.content.replace(/"/g, '&quot;')}">Open</button>
                </div>
            </div>
        `;
        messagesContainer.prepend(messageElement); // Newer messages to the top
    });

    // Add event listeners for Open buttons
    openButtonEventListeners();
}

/**
 * Adds click handlers to all Open buttons in messages
 */
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

/**
 * Handles message deletion process
 */
async function deleteButton() {
    const checkedInputs = document.querySelectorAll('input[type="checkbox"]:checked');

    // Exit function if nothing selected
    if (checkedInputs.length === 0) {
        alert('No messages selected for deletion');
        return;
    }

    try {
        const user = await getCurrentUser();
        if (!user) return;

        // Find all selected messages
        const messageIdsToDelete = Array.from(checkedInputs).map(input => input.id);
        const userData = await getUserData(user.uid);
        if (!userData) return;

        // Update the user's message list
        await updateUserMessageList(user.uid, userData, messageIdsToDelete);

        // Confirm deletion
        const confirmation = confirm('Are you sure you want to delete?');
        if (!confirmation) return;

        // Check and potentially delete messages from Firebase
        await checkAndDeleteMessages(messageIdsToDelete, userData);

        // Update the UI
        removeMessagesFromUI(messageIdsToDelete);

        alert(`${messageIdsToDelete.length} message(s) removed from your list successfully`);

    } catch (error) {
        console.error(error);
        alert('Failed to delete messages');
    }
}

/**
 * Gets current authenticated user
 * @returns {Object|null} Firebase user object or null if not logged in
 */
async function getCurrentUser() {
    const user = auth.currentUser;
    if (!user) {
        console.error("No user is logged in");
        return null;
    }
    return user;
}

/**
 * Gets user document data from Firestore
 * @param {string} userId - User UID
 * @returns {Object|null} User document data or null if not found
 */
async function getUserData(userId) {
    const userDocRef = db.collection("users").doc(userId);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
        console.error("User document does not exist");
        return null;
    }

    return userDoc.data();
}

/**
 * Updates user's message list in Firestore by removing deleted messages
 * @param {string} userId - User UID
 * @param {Object} userData - Current user document data
 * @param {Array} messageIdsToDelete - Array of message IDs to remove
 * @returns {boolean} True if successful, false otherwise
 */
async function updateUserMessageList(userId, userData, messageIdsToDelete) {
    // Determine if we're on the sent or received messages page
    const isSentPage = document.getElementById('sentMessages') !== null;
    const messageListField = isSentPage ? 'sentMessages' : 'receivedMessages';

    if (!userData[messageListField]) {
        console.error(`${messageListField} field is missing in user document`);
        alert('User message data not found');
        return false;
    }

    // Remove message IDs from user's message array
    const updatedMessagesList = userData[messageListField].filter(
        messageId => !messageIdsToDelete.includes(messageId)
    );

    // Update user document with new messages array
    await db.collection("users").doc(userId).update({
        [messageListField]: updatedMessagesList
    });

    return true;
}
/**
 * Checks if messages should be deleted from Firestore and deletes them if unreferenced
 * @param {Array} messageIdsToDelete - Array of message IDs to check
 */
async function checkAndDeleteMessages(messageIdsToDelete) {
    const isSentPage = document.getElementById('sentMessages') !== null;

    for (const messageId of messageIdsToDelete) {
        try {
            const messageInfo = await getMessageInfo(messageId);
            if (!messageInfo) continue;

            const otherUserId = isSentPage ? messageInfo.receiverId : messageInfo.senderId;
            if (!otherUserId) {
                await deleteMessage(messageId);
                continue;
            }

            const isReferenced = await messageExists(
                messageId,
                otherUserId,
                isSentPage ? 'receivedMessages' : 'sentMessages'
            );

            if (!isReferenced) {
                await deleteMessage(messageId);
            }
        } catch (error) {
            console.error(error);
        }
    }
}

/**
 * Gets message document from Firestore
 * @param {string} messageId - Message document ID
 * @returns {Object|null} Message data or null if not found
 */
async function getMessageInfo(messageId) {
    const messageDoc = await db.collection("messages").doc(messageId).get();

    if (!messageDoc.exists) {
        console.warn(`Message with ID ${messageId} does not exist`);
        return null;
    }

    return messageDoc.data();
}

/**
 * Checks if a message exists in another user's message list
 * @param {string} messageId - Message ID to check
 * @param {string} otherUserId - Other user's UID
 * @param {string} messageField - Field to check ('sentMessages' or 'receivedMessages')
 * @returns {boolean} True if message exists in other user's list, false otherwise
 */
async function messageExists(messageId, otherUserId, messageField) {
    try {
        const otherUserDoc = await db.collection("users").doc(otherUserId).get();

        if (!otherUserDoc.exists) {
            console.warn(`Other user document with ID ${otherUserId} does not exist`);
            return false;
        }

        const otherUserData = otherUserDoc.data();
        const otherUserMessages = otherUserData[messageField] || [];

        return otherUserMessages.includes(messageId);
    } catch (error) {
        console.error(error);
        return false; // Assume not referenced in case of error
    }
}

/**
 * Deletes a message document from Firestore
 * @param {string} messageId - Message document ID to delete
 */
async
async function deleteMessage(messageId) {
    await db.collection("messages").doc(messageId).delete();
    console.log(`Message ${messageId} deleted from Firebase`);
}

/**
 * Removes message elements from the UI
 * @param {Array} messageIdsToDelete - Array of message IDs to remove
 */
function removeMessagesFromUI(messageIdsToDelete) {
    messageIdsToDelete.forEach(messageId => {
        const messageElement = document.getElementById(messageId).closest('.message');
        if (messageElement) {
            messageElement.remove();
        }
    });
}