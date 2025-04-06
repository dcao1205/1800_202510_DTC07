/**
 * Retrieves stored values from localStorage and populates reply fields on page load.
 * Also handles "Back" button to return to message view.
 */
document.addEventListener('DOMContentLoaded', function () {
    // Get the stored username and subject from localStorage
    const recipient = localStorage.getItem("selectedMessageUsername");
    const subject = localStorage.getItem("selectedMessageSubject");

    // Get the input elements
    const toSellerInput = document.getElementById("to-seller");
    const subjectInput = document.getElementById("subject");

    // Populate the input fields if values exist in localStorage
    if (recipient) {
        toSellerInput.value = recipient;
    }

    if (subject) {
        // If the subject doesn't start with "Re:", add it
        if (subject && !subject.startsWith("Re:")) {
            subjectInput.value = "Re: " + subject;
        } else {
            subjectInput.value = subject;
        }
    }

    // Add event listener to the back button
    const backButton = document.querySelector('.btn-outline-secondary');
    backButton.addEventListener('click', function () {
        window.location.href = "viewMessage.html"; // Only go back to view_message for reply message page
    });
});