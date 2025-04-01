document.addEventListener('DOMContentLoaded', function () {
    const footer = document.getElementById('footer-container');

    if (footer) {
        footer.innerHTML = `
<footer class="text-center text-white mt-auto" style="background-color: #727980;">
    <nav class="container p-2">
        <section class="d-flex justify-content-between">
            <!-- Home (Profile page) button -->
            <div id="home" class="d-flex flex-column align-items-center">
                <a id="btn-home" href="homepage2.html" class="text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor"
                        class="bi bi-house-fill" viewBox="0 0 16 16">
                        <path
                            d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293z" />
                        <path d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293z" />
                    </svg>
                </a>
                <p class="mb-0 small">Home</p>
            </div>
            <!-- My Listings button -->
            <div id="myListings" class="d-flex flex-column align-items-center">
                <a id="btn-myListings" href="my_listings.html" class="text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width="28"
                        height="28" stroke-width="2">
                        <path d="M9 6l11 0"></path>
                        <path d="M9 12l11 0"></path>
                        <path d="M9 18l11 0"></path>
                        <path d="M5 6l0 .01"></path>
                        <path d="M5 12l0 .01"></path>
                        <path d="M5 18l0 .01"></path>
                    </svg>
                </a>
                <p class="mb-0 small">Listings</p>
            </div>
            <!-- Add listing button -->
            <div id="create-listing" class="d-flex flex-column align-items-center">
                <a id="btn-add" href="create_listing.html" class="text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width="28"
                        height="28" stroke-width="2">
                        <path d="M12.5 21h-7.5a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v7.5">
                        </path>
                        <path d="M3 10h18"></path>
                        <path d="M10 3v18"></path>
                        <path d="M16 19h6"></path>
                        <path d="M19 16v6"></path>
                    </svg>
                </a>
                <p class="mb-0 small">Add</p>
            </div>
            <!-- Message button (previously notification) -->
            <div id="notification-bell" class="d-flex flex-column align-items-center">
                <a id="btn-messages" href="view_message.html" class="text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" 
                        stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" 
                        width="28" height="28" stroke-width="2"> 
                        <path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z"></path> 
                        <path d="M3 7l9 6l9 -6"></path> 
                    </svg> 
                </a>
                <p class="mb-0 small">Messages</p>
            </div>
        </section>
    </nav>
</footer>
        `;
    } else {
        console.error("Footer container not found!");
    }
    attachFooterEventListeners()
});

function attachFooterEventListeners() {
    // Notification bell handler
    document.getElementById("btn-bell").addEventListener("click", function () {
        var notificationModal = new bootstrap.Modal(document.getElementById("notificationModal"));
        notificationModal.show();
    });
}