/**
 * Loads the user header from an HTML template and attaches logout functionality.
 */
document.addEventListener('DOMContentLoaded', function() {
    // Load the header HTML template for logged-in users
    fetch('./templates/userHeader.html')
      .then(response => response.text())
      .then(data => {
        // Inject header content into the container
        document.getElementById('loggedin-header-container').innerHTML = data;
        // Attach event listeners after the footer is loaded
        attachLogoutEventListener();
      });

        /**
        * Adds event listener to logout button to sign the user out.
        */
      function attachLogoutEventListener() {
        // Look for the logout link element inside header
        const logoutButton = document.querySelector('.nav-link[href="#logout"]'); 

        if (logoutButton) {
            logoutButton.addEventListener('click', function(event) {
                event.preventDefault(); // Prevent default anchor behavior

                // Sign out the user using Firebase Auth
                firebase.auth().signOut().then(() => {
                    console.log("User logged out successfully.");
                    window.location.href = "index.html"; // Redirect to homepage
                }).catch((error) => {
                    console.error("Logout Error:", error);
                });
            });
        }
    }
});