$(document).ready(function() {
    // Retrieve the sound parameter from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const sound = urlParams.get('sound');

    // Set the source of the sound audio element based on the sound parameter
    const soundAudio = document.getElementById('soundAudio');
    soundAudio.src = sound + '.mp3';
    soundAudio.loop = true; // Enable looping for the main sound

    // Set the source of the sound icon based on the sound parameter
    const soundIcon = document.getElementById('soundIcon');
    soundIcon.src = sound + '-light.jpg';
    
    // Update the heading with the selected sound
    updateHeading(sound);


    
    // Hide the div corresponding to the selected sound
    $('.' + sound + '-div').hide();

    var playBtn = document.getElementById('playBtn');
    var pauseBtn = document.getElementById('pauseBtn');
    var durationSelect = document.getElementById('durationSelect');
    var timerDisplay = document.getElementById('timerDisplay');
    var timer;
    var timerDuration = parseInt(durationSelect.value);
    var currentAdditionalSound = null;
    var additionalSounds = {};
    var activeAdditionalSounds = [];
    var isSoundPlaying = false;
    var timerRemaining = 0;

    var volumeSlider = document.getElementById('volumeSlider');
    noUiSlider.create(volumeSlider, {
        start: 50,
        range: {
            'min': 0,
            'max': 100
        },
        step: 1,
        connect: [true, false],
        orientation: 'horizontal',
    });

    soundAudio.volume = volumeSlider.noUiSlider.get() / 100;

    volumeSlider.noUiSlider.on('update', function(values, handle) {
        var volume = values[handle] / 100;
        soundAudio.volume = volume;
    });

        // Event listener for the home button
        $('#home-btn').click(function() {
            window.location.href = 'index.html';
        });

    playBtn.addEventListener('click', function() {
        if (!isSoundPlaying) {
            playAllSounds();
            startTimer();
        } else {
            // Pause all sounds and the timer
            pauseAllSounds();
            pauseTimer();
    
            // Only play additional sounds that are currently active
            for (var sound in additionalSounds) {
                if ($('.btn-sound[data-sound="' + sound + '"]').hasClass('active')) {
                    additionalSounds[sound].play();
                }
            }
    
            // Resume the timer
            resumeTimer();
        }
    });
    
    pauseBtn.addEventListener('click', function() {
        pauseAllSounds();
        pauseTimer();
    });

    durationSelect.addEventListener('change', function() {
        timerDuration = parseInt(this.value);
        timerDisplay.textContent = formatTime(timerDuration);
    });

    $('.btn-sound').click(function() {
        var sound = $(this).data('sound');
        var soundIsActive = $(this).hasClass('active');
    
        if (!soundIsActive) {
            $(this).addClass('active');
            createAdditionalSound(sound);
            if (isSoundPlaying) {
                additionalSounds[sound].play();
            }
            updateUI(sound);
            $('.additional-volume[data-sound="' + sound + '"]').show();
        } else {
            $(this).removeClass('active');
            additionalSounds[sound].pause();
            // Hide the volume control associated with the sound
            $('.additional-volume[data-sound="' + sound + '"]').hide();
        }
    
        var anyActiveSounds = $('.btn-sound.active').length > 0;
        $('#additionalIcon').toggle(anyActiveSounds);
        updateAdditionalImages();
    });
    

// Function to update heading based on selected sound
function updateHeading(sound) {
    var soundHeading = document.getElementById('soundHeading');
    switch (sound) {
        case 'ocean':
            soundHeading.textContent = 'Ocean Sound';
            break;
        case 'fire':
            soundHeading.textContent = 'Fire Sound';
            break;
        case 'tent':
            soundHeading.textContent = 'Tent Sound';
            break;
        default:
            soundHeading.textContent = 'Rain Sound';
            break;
    }
}

// Function to create additional sound
function createAdditionalSound(sound) {
    var audio = new Audio(sound + '.mp3');
    audio.volume = 0.5; // Set initial volume for additional sounds
    audio.loop = true; // Enable looping for additional sounds
    additionalSounds[sound] = audio;

    // Create the volume control
    var volumeControl = $('<input type="range" class="form-control-range additional-volume additional-volume-' + sound + '" data-sound="' + sound + '" value="50">');
    // Find the parent div of the button within additionalSounds
    var parentDiv = $('#' + sound + '-container');
    parentDiv.append(volumeControl); // Append the volume control to the parent div

    // Add event listener to the newly created volume control
    // Use event delegation to handle dynamically created elements
    $(document).on('input', '.additional-volume-' + sound, function() {
        additionalSounds[sound].volume = this.value / 100;
    });
}

// Function to remove additional sound
function removeAdditionalSound(sound) {
    if (additionalSounds[sound]) {
        additionalSounds[sound].pause(); // Pause the sound
        delete additionalSounds[sound]; // Remove the sound from the object

        // Remove all associated elements (icon and volume control)
        $('.additional-icon[data-sound="' + sound + '"]').remove();
        $('.additional-volume[data-sound="' + sound + '"]').remove();

        // Check if there are any active additional sounds after removal
        if ($('.btn-sound.active').length === 0) {
            // Hide the main image if no additional sounds are active
            $('#additionalIcon').hide();
            // Also remove all additional icons from the DOM
            $('.additional-icon').remove();
        }

        // Update UI to show all active additional images
        updateAdditionalImages();
    }
}

// Function to play all sounds
function playAllSounds() {
    soundAudio.play();
    isSoundPlaying = true;
    for (var sound in additionalSounds) {
        if ($('.btn-sound[data-sound="' + sound + '"]').hasClass('active')) {
            additionalSounds[sound].play();
        }
    }
}
// Function to pause all sounds
function pauseAllSounds() {
    soundAudio.pause();
    isSoundPlaying = false;
    for (var sound in additionalSounds) {
        additionalSounds[sound].pause();
    }
}

// Function to update UI based on the selected sound
function updateUI(sound) {
    $('#soundIcon').show(); // Show the sound icon
    var iconPath = getIconPath(sound); // Get the image path for the sound icon
    $('#additionalIcon').attr('src', iconPath).show(); // Set the src attribute to the icon path and show the icon
}

// Function to start the timer
function startTimer() {
    if (timerDuration > 0) {
        // Clear the array of active additional sounds
        activeAdditionalSounds = [];
        
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
                // Pause all sounds when the timer expires
                pauseAllSounds();
                // Reset timer duration
                timerDuration = parseInt(durationSelect.value);
                // Reset timer display
                timerDisplay.textContent = formatTime(timerDuration);
                // Remove all additional sounds
                for (var sound in additionalSounds) {
                    removeAdditionalSound(sound);
                }
                // Do not restart the timer automatically
            }
        }, 1000);

        // Check if any additional sounds were playing before restarting the timer
        for (var sound in additionalSounds) {
            if ($('.btn-sound[data-sound="' + sound + '"]').hasClass('active')) {
                additionalSounds[sound].play(); // Resume additional sound
                activeAdditionalSounds.push(sound); // Add to active additional sounds array
            }
        }
    }
}


// Function to pause the timer
function pauseTimer() {
    clearInterval(timer);
    // Calculate the remaining time by subtracting the current time from the start time
    var currentTime = new Date().getTime();
    var startTime = currentTime - (timerDuration * 1000);
    timerRemaining = Math.ceil((timerDuration * 1000 - (currentTime - startTime)) / 1000);
}
// Function to resume the timer
function resumeTimer() {
    // Pause all sounds before resuming the timer
    pauseAllSounds();

    // Reset the timer display to the initial duration
    timerDisplay.textContent = formatTime(timerDuration);

    // Start the timer with the remaining time
    startTimer(timerRemaining);

    // Resume playback of the main sound only if it was originally playing
    if (isSoundPlaying) {
        soundAudio.play();
    }
}



// Function to get the image path for a sound icon
function getIconPath(sound) {
    switch (sound) {
        case 'ocean':
            return './ocean-light.jpg';
        case 'fire':
            return './fire-light.jpg';
        case 'tent':
            return './tent-light.jpg';
        default:
            return './rain-light.jpg';
    }
}

// Function to format time as MM:SS
function formatTime(seconds) {
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = seconds % 60;
    var formattedMinutes = minutes.toString().padStart(2, '0'); // Ensure two digits for minutes
    var formattedSeconds = remainingSeconds.toString().padStart(2, '0'); // Ensure two digits for seconds
    return `${formattedMinutes}:${formattedSeconds}`;
}

// Function to update UI to show all active additional images
function updateAdditionalImages() {
    // Remove any existing additional icons
    $('.additional-icon').remove();

    // Check if there are any active additional sounds
    var activeSoundsCount = $('.btn-sound.active').length;

    // If no active additional sounds, hide the main image
    if (activeSoundsCount === 0) {
        $('#additionalIcon').hide();
    } else {
        // Iterate through active sounds and add additional icons
        $('.btn-sound.active').each(function(index, element) {
            var sound = $(element).data('sound');
            var iconPath = getIconPath(sound); // Get the image path for the sound icon
            if (index === 0) {
                // Set the src attribute of the existing additional icon for the first active sound
                $('#additionalIcon').attr('src', iconPath).show();
            } else {
                // Create additional image elements for subsequent active sounds
                var additionalIcon = $('<img class="img-fluid rounded-circle additional-icon" src="' + iconPath + '" alt="Additional Sound Icon">');
                $('.sound-icons-wrapper').append(additionalIcon);
            }
        });
    }
}
});
