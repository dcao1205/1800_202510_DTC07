import { db } from './firebase_cred.js';

/**
 * Opens the report modal and sets the listing ID for the report
 * @param {string} listingId - The ID of the listing being reported
 */
function openReportModal(listingId) {
    // Display the modal
    document.getElementById("reportModal").style.display = "block";
    // Store the listing ID in the submit button's dataset
    document.getElementById("reportSubmit").dataset.listingId = listingId;
}

/**
 * Closes the report modal and clears any existing form data
 */
function closeReportModal() {
    // Hide the modal
    document.getElementById("reportModal").style.display = "none";
    // Optional: Clear form fields when closing
    document.getElementById("reportReason").value = "";
    document.getElementById("reportDetails").value = "";
}

/**
 * Submits a report to Firebase with the provided information
 */
function submitReport() {
    // Get report data from form and modal
    let listingId = document.getElementById("reportSubmit").dataset.listingId;
    let reason = document.getElementById("reportReason").value;
    let details = document.getElementById("reportDetails").value;

    // Validate required fields
    if (!reason) {
        alert("Please select a reason.");
        return;
    }

    // Submit report to Firebase
    db.collection("reports").add({
        listingId: listingId,
        reason: reason,
        details: details,
        timestamp: new Date() // Record when the report was made
    }).then(() => {
        // Success handling
        alert("Report submitted successfully.");
        closeReportModal();
    }).catch(error => {
        // Error handling
        console.error("Error submitting report: ", error);
        alert("Error submitting report. Please try again.");
    });
}

// EVENT LISTENERS //

// Delegated event listener for report buttons (works for dynamically added elements)
document.addEventListener("click", (event) => {
    if (event.target.classList.contains("report-btn")) {
        openReportModal(event.target.dataset.listingId);
    }
});

// Submit button for report form
document.getElementById("reportSubmit").addEventListener("click", submitReport);

// Close button for report modal
document.getElementById("reportClose").addEventListener("click", closeReportModal);

// Optional: Close modal when clicking outside of it
window.addEventListener("click", (event) => {
    if (event.target === document.getElementById("reportModal")) {
        closeReportModal();
    }
});