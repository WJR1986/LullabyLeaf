$(document).ready(function() {
    var isDarkMode = $('body').hasClass('dark-mode'); // Check if dark mode is enabled initially

    // Initialize theme switch button icon and behavior
    if (isDarkMode) {
        $('#themeSwitchBtn').html('<i class="fas fa-sun"></i>'); // Sun icon for light mode
    } else {
        $('#themeSwitchBtn').html('<i class="fas fa-moon" style ></i>'); // Moon icon for dark mode
    }
    

    // Theme switch button click event
    $('#themeSwitchBtn').click(function() {
        isDarkMode = !isDarkMode; // Toggle dark mode flag
        if (isDarkMode) {
            enableDarkMode(); // If dark mode is enabled, switch to light mode
        } else {
            disableDarkMode(); // If dark mode is disabled, switch to dark mode
        }
        // Call a function to update images based on the selected theme
        // updateImagesForTheme(isDarkMode);
    });

    // Function to enable dark mode
    function enableDarkMode() {
        $('body').addClass('dark-mode');
        $('#themeSwitchBtn').html('<i class="fas fa-sun"></i>'); // Change button icon
        // You can add additional CSS changes for dark mode here
    }

    // Function to disable dark mode
    function disableDarkMode() {
        $('body').removeClass('dark-mode');
        $('#themeSwitchBtn').html('<i class="fas fa-moon"></i>'); // Change button icon
        // You can remove or reset any additional CSS changes for dark mode here
    }

// Function to update images based on the selected theme
// function updateImagesForTheme(isDarkMode) {
//     var imageElements = document.querySelectorAll('img'); // Select all <img> elements
//     imageElements.forEach(function(img) {
//         var imageName = img.getAttribute('alt').toLowerCase().replace(/\s/g, '-'); // Get the alt attribute of the image and convert to lowercase, replace spaces with hyphens
//         var imagePath = 'img/'; // Adjust the image path based on your new image location
//         var extension = isDarkMode ? 'jpg' : 'png'; // Set the extension based on the theme
//         var newSrc = imagePath + imageName + (isDarkMode ? '-light.jpg': '-dark.png'); // Construct the new source based on the theme
//         img.setAttribute('src', newSrc); // Update the src attribute of the image
//     });
// }


});
