document.addEventListener('DOMContentLoaded', function () {
    const footer = document.getElementById('footer-container');

    if (footer) {
        footer.innerHTML = `
 <div class="my-0">
    <section class="">
        <footer class="text-center text-white" style="background-color: #727980;">
            <nav class="container p-3 pb-0">
                <section class="d-flex justify-content-between">
                    <!-- Home (Profile page) button -->
                    <div id="home" class="d-flex flex-column align-items-center">
                        <a id="btn-home" href="homepage2.html" style="padding:0; border:none; background: none;"
                            class="text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" fill="currentColor"
                                class="bi bi-house-fill" viewBox="0 0 16 16">
                                <path
                                    d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293z" />
                                <path d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293z" />
                            </svg>
                        </a>
                        <p>Home</p>
                    </div>
                    <!-- Add listing button -->
                    <div id="create-listing" class="d-flex flex-column align-items-center">
                        <a id="btn-add" href="create_listing.html" style="padding:0; border:none; background: none;"
                            class="text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width="34"
                                height="34" stroke-width="2">
                                <path d="M12.5 21h-7.5a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v7.5">
                                </path>
                                <path d="M3 10h18"></path>
                                <path d="M10 3v18"></path>
                                <path d="M16 19h6"></path>
                                <path d="M19 16v6"></path>
                            </svg>
                        </a>
                        <p>Add</p>
                    </div>
                    <!-- Notification button -->
                    <div id="notification-bell" class="d-flex flex-column align-items-center">
                        <button id="btn-bell" type="button" style="padding:0; border:none; background: none;"
                            class="text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" fill="currentColor"
                                class="bi bi-bell-fill" viewBox="0 0 16 16">
                                <path
                                    d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901" />
                            </svg>
                        </button>
                        <p>Alerts</p>
                    </div>
                </section>
            </nav>
            <!-- Copyright -->
            <div class="text-center p-2" style="background-color: rgba(0, 0, 0, 0.2);">
                © 2025 Copyright: TextLibre
            </div>
        </footer>
    </section>
</div>

<div class="modal fade" id="notificationModal" tabindex="-1" aria-labelledby="notificationModalLabel"
    aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="notificationModalLabel">Notifications</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <ul class="list-group">
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        Notification 1: Placeholder
                        <button class="btn btn-sm btn-outline-info">More Info</button>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        Notification 2: Placeholder
                        <button class="btn btn-sm btn-outline-info">More Info</button>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        Notification 3: Placeholder
                        <button class="btn btn-sm btn-outline-info">More Info</button>
                    </li>
                </ul>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>
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

    // // Create listing handler
    // document.getElementById("btn-add").addEventListener("click", function () {
    //     window.location.href = "create_listing.html";
    // });

    // // Home button handler
    // document.getElementById("btn-home").addEventListener("click", function () {
    //     window.location.href = "homepage2.html";
    // });
}