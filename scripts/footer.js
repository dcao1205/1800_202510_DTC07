document.addEventListener('DOMContentLoaded', function() {
    fetch('./templates/footer.html')
      .then(response => response.text())
      .then(data => {
        document.getElementById('footer-container').innerHTML = data;
        // Attach event listeners after the footer is loaded
        attachFooterEventListeners();
      });
});

function attachFooterEventListeners() {
    // Notification bell handler
    document.getElementById("btn-bell").addEventListener("click", function () {
        var notificationModal = new bootstrap.Modal(document.getElementById("notificationModal"));
        notificationModal.show();
    });

    // Create listing handler
    document.getElementById("btn-add").addEventListener("click", function () {
        window.location.href = "create_listing.html";
    });

    // Home button handler
    document.getElementById("btn-home").addEventListener("click", function () {
        window.location.href = "homepage2.html";
    });
}