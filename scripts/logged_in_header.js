document.addEventListener('DOMContentLoaded', function() {
    fetch('./templates/logged_in_header.html')
      .then(response => response.text())
      .then(data => {
        document.getElementById('loggedin-header-container').innerHTML = data;
        // Attach event listeners after the footer is loaded
        // attachFooterEventListeners();
      });
});

// function attachFooterEventListeners() {

// }