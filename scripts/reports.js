import { db } from './firebase_cred.js';

function openReportModal(listingId) {
    document.getElementById("reportModal").style.display = "block";
    document.getElementById("reportSubmit").dataset.listingId = listingId;
}

function closeReportModal() {
    document.getElementById("reportModal").style.display = "none";
}

function submitReport() {
    let listingId = document.getElementById("reportSubmit").dataset.listingId;
    let reason = document.getElementById("reportReason").value;
    let details = document.getElementById("reportDetails").value;

    if (!reason) {
        alert("Please select a reason.");
        return;
    }

    db.collection("reports").add({
        listingId: listingId,
        reason: reason,
        details: details,
        timestamp: new Date()
    }).then(() => {
        alert("Report submitted successfully.");
        closeReportModal();
    }).catch(error => {
        console.error("Error submitting report: ", error);
        alert("Error submitting report. Please try again.");
    });
}

// Attach event listeners for report buttons
document.addEventListener("click", (event) => {
    if (event.target.classList.contains("report-btn")) {
        openReportModal(event.target.dataset.listingId);
    }
});

document.getElementById("reportSubmit").addEventListener("click", submitReport);
document.getElementById("reportClose").addEventListener("click", closeReportModal);
