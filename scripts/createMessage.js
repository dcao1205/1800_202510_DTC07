import { db } from './firebase_cred.js';

/**
 * Sets up click handler to extract username and redirect to message page.
 */
document.addEventListener('DOMContentLoaded', function () {
    // Get the message button element
    const messageButton = document.getElementById("create-message");

    messageButton.addEventListener("click", function () {
        try {
            // Get the username element
            const usernameElement = document.getElementById("listing-username");

            let username = "";

            if (usernameElement) {
                const fullText = usernameElement.textContent || usernameElement.innerText;
                console.log("Full text content:", fullText);

                // Obtain just the username
                if (fullText.includes("Username:")) {
                    username = fullText.split("Username:")[1].trim();
                } else if (fullText.includes(":")) {
                    username = fullText.split(":")[1].trim();
                } else {
                    username = fullText.trim();
                }

                console.log("Extracted username:", username);
            } else {
                console.error("Username element not found");
            }

            // Set the localStorage value
            console.log("Setting localStorage with value:", username);
            localStorage.setItem("selectedSellerUsername", username);

            window.location.href = "createMessage.html";
        } catch (error) {
            console.error("Error processing username:", error);

            window.location.href = "createMessage.html";
        }
    });
});