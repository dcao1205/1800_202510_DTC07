/**
 * Loads the logged-in user header from HTML template and attaches logout handler.
 */
document.addEventListener('DOMContentLoaded', function() {
    fetch('./templates/loggedInHeader.html')
      .then(response => response.text())
      .then(data => {
        // Insert the loaded HTML into the page
        document.getElementById('loggedin-header-container').innerHTML = data;
        // Attach event listeners after the footer is loaded
        attachLogoutEventListener();
      });

    /**
     * Attaches an event listener to the logout button inside the loaded header.
     * Signs the user out and redirects to index page upon success.
     */
      function attachLogoutEventListener() {
        const logoutButton = document.querySelector('.nav-link[href="#logout"]'); 

        if (logoutButton) {
            logoutButton.addEventListener('click', function(event) {
                event.preventDefault(); // Prevent default anchor behavior

                firebase.auth().signOut().then(() => {
                    console.log("User logged out successfully.");
                    window.location.href = "index.html"; // Redirect to login page
                }).catch((error) => {
                    console.error("Logout Error:", error);
                });
            });
        }
    }
});
