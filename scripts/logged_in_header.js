document.addEventListener('DOMContentLoaded', function() {
    fetch('./templates/logged_in_header.html')
      .then(response => response.text())
      .then(data => {
        document.getElementById('loggedin-header-container').innerHTML = data;
        // Attach event listeners after the footer is loaded
        attachLogoutEventListener();
      });

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
