let hrElements = [];

function startRainEffect() {
    let rainContainer = document.createElement("div");
    rainContainer.classList.add("rain-container");
    document.body.appendChild(rainContainer);

    let counter = 100;
    for (let i = 0; i < counter; i++) {
        let hrElement = document.createElement("HR");
        hrElement.style.left = Math.floor(Math.random() * window.innerWidth) + "px";
        hrElement.style.animationDuration = 0.2 + Math.random() * 0.3 + "s";
        hrElement.style.animationDelay = Math.random() * 5 + "s";
        rainContainer.appendChild(hrElement);
        hrElements.push(hrElement);
    }
}


function stopRainEffect() {
    hrElements.forEach(hr => hr.remove());
    hrElements = [];
}
