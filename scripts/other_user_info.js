document.addEventListener("DOMContentLoaded", function () {
    const hiddenBtn = document.getElementById("emailhidding");
    const emailText = document.getElementById("emailDisplay");

    // Ensure emailText exists before proceeding
    if (hiddenBtn && emailText) {
        // Set initial state based on checkbox
        emailText.classList.toggle("visually-hidden", !hiddenBtn.checked);

        // Add event listener to toggle email visibility
        hiddenBtn.addEventListener("change", function () {
            emailText.classList.toggle("visually-hidden", !this.checked);
        });
    }
});
