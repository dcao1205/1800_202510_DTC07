import { auth, db } from './firebase_cred.js';

// Wait for DOM to be fully loaded
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

    // Check authentication state
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

// Function to fetch message count from Firebase using async/await. AI Help
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

// Function to update the message count display
function updateMessageCountDisplay(count) {
    const messageCountElement = document.getElementById('messageCount');
    if (messageCountElement) {
        messageCountElement.textContent = `You have ${count} messages.`;
    }
}

// Function to display error message
function displayError(errorMessage) {
    const messageCountElement = document.getElementById('messageCount');
    if (messageCountElement) {
        messageCountElement.textContent = `Error: ${errorMessage}`;
    }
}

// Function to display loading state
function displayLoading() {
    const messageCountElement = document.getElementById('messageCount');
    if (messageCountElement) {
        messageCountElement.textContent = 'Loading messages...';
    }
}