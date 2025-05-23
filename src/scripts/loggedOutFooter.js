/**
 * Loads the logged-out footer into the #loggedout-footer-container element on page load.
 * Includes navigation buttons: Home, Sign up, and Login.
 */
document.addEventListener('DOMContentLoaded', function () {
    const footer = document.getElementById('loggedout-footer-container');

    // Only insert footer HTML if the container exists
    if (footer) {
        footer.innerHTML = `
            <div class="my-0 w-100">
    <section class="">
        <footer class="text-center text-white" style="background-color: #727980;">
            <nav class="container p-3 pb-0">
                <section class="d-flex justify-content-between">
                    <!-- Home (Welcome banner) button -->
                    <div id="home" class="d-flex flex-column align-items-center">
                        <a id="btn-home" href="index.html" style="padding:0; border:none; background: none;"
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
                    <!-- Sign Up button -->
                    <div id="signup" class="d-flex flex-column align-items-center">
                        <a id="btn-signup" href="signup.html" style="padding:0; border:none; background: none;"
                            class="text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                                <path d="M16 19h6" />
                                <path d="M19 16v6" />
                                <path d="M6 21v-2a4 4 0 0 1 4 -4h4" />
                            </svg>
                        </a>
                        <p>Sign up</p>
                    </div>
                    <!-- Login (sign in page) button -->
                    <div id="login" class="d-flex flex-column align-items-center">
                        <a id="btn-login" href="signin.html" style="padding:0; border:none; background: none;"
                            class="text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <path
                                    d="M15 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
                                <path d="M21 12h-13l3 -3" />
                                <path d="M11 15l-3 -3" />
                            </svg>
                        </a>
                        <p>Login</p>
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
        `;
    } else {
        console.error("Footer container not found!");
    }
});