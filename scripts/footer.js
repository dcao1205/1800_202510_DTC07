// Notification modal handler
document.getElementById("btn-bell").addEventListener("click", function () {
    var notificationModal = new bootstrap.Modal(document.getElementById("notificationModal"));
    notificationModal.show();
});

// Create listing handler
document.getElementById("btn-add").addEventListener("click", function () {
    window.location.href = "create_listing.html";
});


// Create Home Button handler
document.getElementById("btn-home").addEventListener("click", function () {
    window.location.href = "homepage2.html";
});