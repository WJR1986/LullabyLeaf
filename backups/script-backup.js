$(document).ready(function() {
    var rainAudio = document.getElementById('rainAudio');
    var volumeRange = document.getElementById('volumeRange');
    var playBtn = document.getElementById('playBtn');
    var pauseBtn = document.getElementById('pauseBtn');
    var durationSelect = document.getElementById('durationSelect'); // Select menu for setting timer duration
    var timerDisplay = document.getElementById('timerDisplay'); // Timer display element
    var timer; // Variable to store the timer reference
    var currentSound = 'rain'; // Keep track of the current sound
    var currentAdditionalSound = null; // Keep track of the current additional sound
    var additionalSounds = {}; // Object to store additional sounds
    var isRainPlaying = false; // Flag to track if the rain sound is playing
    var timerRemaining = 0; // Variable to store the remaining time when the timer is paused

    // Set initial timer duration and display
    var timerDuration = 60; // Default timer duration in seconds
    if (timerDisplay) {
        timerDisplay.textContent = formatTime(timerDuration);
    }

    // Function to format time as MM:SS
    function formatTime(seconds) {
        var minutes = Math.floor(seconds / 60);
        var remainingSeconds = seconds % 60;
        var formattedMinutes = minutes.toString().padStart(2, '0'); // Ensure two digits for minutes
        var formattedSeconds = remainingSeconds.toString().padStart(2, '0'); // Ensure two digits for seconds
        return `${formattedMinutes}:${formattedSeconds}`;
    }

    // Play button click event
    playBtn.addEventListener('click', function() {
        if (!isRainPlaying) {
            playAllSounds();
            startTimer();
        } else {
            resumeTimer(); // Resume timer if already playing
        }
    });

    // Pause button click event
    pauseBtn.addEventListener('click', function() {
        pauseAllSounds();
        pauseTimer();
    });

    // Volume range change event for rain audio
    volumeRange.addEventListener('input', function() {
        var volume = volumeRange.value / 100;
        rainAudio.volume = volume;
    });

    // Duration select change event
    durationSelect.addEventListener('change', function() {
        timerDuration = parseInt(this.value);
        timerDisplay.textContent = formatTime(timerDuration); // Update timer display
    });

    // Additional sound selection
    $('.btn-sound').click(function() {
        var sound = $(this).data('sound');
        if (currentAdditionalSound !== sound) {
            if (currentAdditionalSound) {
                additionalSounds[currentAdditionalSound].pause();
                $('.additional-volume').hide(); // Hide all volume controls
            }
            if (!additionalSounds[sound]) {
                createAdditionalSound(sound);
            }
            if (isRainPlaying) {
                additionalSounds[sound].play(); // Play immediately if rain is already playing
            }
            currentAdditionalSound = sound;
            updateUI(sound);
            $('.additional-volume[data-sound="' + sound + '"]').show(); // Show volume control for the selected sound
        }
    });

    // Remove button click event
    $(document).on('click', '.remove-link', function() {
        var sound = $(this).siblings('.btn-sound').data('sound');
        removeAdditionalSound(sound);
        $(this).remove(); // Remove the remove link
    });

    // Function to create additional sound
    function createAdditionalSound(sound) {
        var audio = new Audio(sound + '.mp3');
        audio.volume = 0.5; // Set initial volume for additional sounds
        audio.loop = true; // Enable looping for additional sounds
        additionalSounds[sound] = audio;

        // Add event listener to additional volume range
        var additionalVolumeRange = document.querySelector('.additional-volume[data-sound="' + sound + '"]');
        additionalVolumeRange.addEventListener('input', function() {
            additionalSounds[sound].volume = this.value / 100;
        });
    }

    // Function to play all sounds
    function playAllSounds() {
        rainAudio.play();
        isRainPlaying = true;
        for (var sound in additionalSounds) {
            additionalSounds[sound].play();
        }
    }

    // Function to pause all sounds
    function pauseAllSounds() {
        rainAudio.pause();
        isRainPlaying = false;
        for (var sound in additionalSounds) {
            additionalSounds[sound].pause();
        }
    }

// Function to update UI based on the selected sound
function updateUI(sound) {
    $('#rainIcon').show(); // Show the rain icon
    var iconPath = getIconPath(sound); // Get the image path for the sound icon
    $('#additionalIcon').attr('src', iconPath).show(); // Set the src attribute to the icon path and show the icon
    
    // Remove any existing remove link
    $('.remove-link').remove();

    // Create a remove link under the additional sound icon
    var removeLink = $('<p class="remove-link">Remove</p>');
    removeLink.click(function() {
        removeAdditionalSound(sound);
        $(this).remove(); // Remove the remove link
    });

    // Find the parent container of the clicked button and append the remove link under the icon
    $('.btn-sound[data-sound="' + sound + '"]').parent().append(removeLink);
}



    // Function to start the timer
    function startTimer() {
        if (timerDuration > 0) {
            timer = setInterval(function() {
                if (timerRemaining > 0 || timerDuration > 0) {
                    if (timerRemaining > 0) {
                        timerRemaining--;
                    } else {
                        timerDuration--;
                    }
                    // Update timer display
                    timerDisplay.textContent = formatTime(timerDuration + timerRemaining);
                }
                if (timerDuration <= 0 && timerRemaining <= 0) {
                    clearInterval(timer);
                    pauseAllSounds(); // Pause all sounds when the timer expires
                    timerDuration = parseInt(durationSelect.value); // Reset timer duration
                    timerDisplay.textContent = formatTime(timerDuration); // Reset timer display
                    // Do not restart the timer automatically
                }
            }, 1000);
        }
    }

    // Function to pause the timer
    function pauseTimer() {
        clearInterval(timer);
        // Calculate the remaining time by subtracting the current time from the start time
        var currentTime = new Date().getTime();
        var startTime = new Date().getTime() - (timerDuration * 1000);
        timerRemaining = Math.ceil((timerDuration * 1000 - (currentTime - startTime)) / 1000);
    }

    // Function to resume the timer
    function resumeTimer() {
        startTimer(timerRemaining); // Pass the remaining time to startTimer
    }

    // Function to remove additional sound
    function removeAdditionalSound(sound) {
        if (additionalSounds[sound]) {
            additionalSounds[sound].pause(); // Pause the sound
            delete additionalSounds[sound]; // Remove the sound from the object
            currentAdditionalSound = null; // Reset the current additional sound
            $('#additionalIcon').hide(); // Hide the additional sound icon
            $('.additional-volume[data-sound="' + sound + '"]').hide(); // Hide the volume control
        }
    }

// Function to get the image path for a sound icon
function getIconPath(sound) {
    switch (sound) {
        case 'ocean':
            return '/img/ocean-light.jpg';
        case 'fire':
            return '/img/fire-light.jpg';
        case 'tent':
            return '/img/tent-light.jpg';
        default:
            return '/img/rain-light.jpg';
    }
}


});
