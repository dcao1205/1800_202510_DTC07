/**
 * Loads the logged-out header from an external HTML template into the page.
 * Executes after the DOM has fully loaded.
 */
document.addEventListener('DOMContentLoaded', function() {
    fetch('./templates/loggedOutHeader.html')
      .then(response => response.text())
      .then(data => {
        // Insert the fetched HTML into the designated header container
        document.getElementById('loggedout-header-container').innerHTML = data;
        // Attach event listeners after the footer is loaded
        // attachFooterEventListeners();
      });
});

// function attachFooterEventListeners() {

// }