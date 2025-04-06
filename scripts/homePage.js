import { auth, db } from './firebase_cred.js';

/**
 * Waits for the DOM to load, then checks auth state and sets up logout handlers.
 */
document.addEventListener('DOMContentLoaded', () => {
    const accountNameSmall = document.getElementById("accountNameSmall");
    const accountNameLarge = document.getElementById("accountNameLarge");
    const logoutBtn = document.getElementById("logoutBtn");
    const logoutBtnLarge = document.getElementById("logoutBtnLarge");

    // Check if elements exist before using them
    if (logoutBtnLarge) {
        logoutBtnLarge.addEventListener("click", (e) => {
            e.preventDefault();
            logoutUser();
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            logoutUser();
        });
    }

    /**
     * Monitors Firebase authentication state and updates UI accordingly.
     * @param {firebase.User|null} user - Currently signed-in user or null
     */
    auth.onAuthStateChanged((user) => {
        if (user) {
            // User is signed in
            console.log("User is signed in:", user);

            // display name is just email, maybe we can ask for user display name in the future?
            const userEmail = user.email;
            const displayName = userEmail ? userEmail.split('@')[0] : "User";

            // Only update elements if they exist
            if (accountNameSmall) accountNameSmall.textContent = displayName;
            if (accountNameLarge) accountNameLarge.textContent = displayName;
            fetchMessageCount();
        } else {
            console.log("No user signed in");
            window.location.href = "signin.html";
        }
    });
    /**
     * Signs out the current user and redirects to the sign-in page.
     */
    function logoutUser() {
        auth.signOut()
            .then(() => {
                console.log("User signed out successfully");
                window.location.href = "signin.html";
            })
            .catch((error) => {
                console.error("Error signing out:", error);
                alert("Error signing out. Please try again.");
            });
    }
});

/**
 * Fetches the number of messages received by the current user and updates the UI.
 * @returns {Promise<void>}
 */
async function fetchMessageCount() {
    const messageCountElement = document.getElementById('messageCount');

    // Display loading state
    if (messageCountElement) {
        messageCountElement.textContent = 'Loading messages...';
    }

    try {
        // Get the current user
        const currentUser = auth.currentUser;
        if (!currentUser) {
            throw new Error('User not authenticated');
        }

        // Get user ID
        const userId = currentUser.uid;

        // Reference to the user document in Firestore
        const userDocRef = db.collection('users').doc(userId);

        // Fetch the user document
        const doc = await userDocRef.get();

        if (!doc.exists) {
            throw new Error('User document not found');
        }

        // Get the receivedMessages array
        const userData = doc.data();
        // Get array length (or 0 if array doesn't exist)
        const count = (userData.receivedMessages || []).length;

        // Update the UI with the message count
        if (messageCountElement) {
            messageCountElement.innerHTML = `You have <span>${count}</span> message(s).`;
        }

    } catch (error) {
        console.error('Error fetching message count:', error);
        if (messageCountElement) {
            messageCountElement.textContent = error.message === 'User not authenticated'
                ? 'Please sign in to view messages'
                : 'Unable to load messages';
        }
    }
}

/**
 * Updates the message count element with a given count.
 * @param {number} count - Number of messages to display
 */
function updateMessageCountDisplay(count) {
    const messageCountElement = document.getElementById('messageCount');
    if (messageCountElement) {
        messageCountElement.textContent = `You have ${count} messages.`;
    }
}

/**
 * Displays a custom error message in the message count element.
 * @param {string} errorMessage - Error message to display
 */
function displayError(errorMessage) {
    const messageCountElement = document.getElementById('messageCount');
    if (messageCountElement) {
        messageCountElement.textContent = `Error: ${errorMessage}`;
    }
}

/**
 * Displays a loading message in the message count element.
 */
function displayLoading() {
    const messageCountElement = document.getElementById('messageCount');
    if (messageCountElement) {
        messageCountElement.textContent = 'Loading messages...';
    }
}