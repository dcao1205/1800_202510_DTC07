document.addEventListener('DOMContentLoaded', function() {
    fetch('./templates/loggedOutHeader.html')
      .then(response => response.text())
      .then(data => {
        document.getElementById('loggedout-header-container').innerHTML = data;
        // Attach event listeners after the footer is loaded
        // attachFooterEventListeners();
      });
});

// function attachFooterEventListeners() {

// }