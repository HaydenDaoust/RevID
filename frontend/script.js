const button = document.getElementById("recordButton");
const status = document.getElementById("status");
let isListening = false;

button.addEventListener("click", function () {

    if (isListening === false) {
        isListening = true;

        status.textContent = "Listening...";
        button.textContent = "Stop Listening";

    } else {
        isListening = false;

        status.textContent = "Stopped";
        button.textContent = "Start Listening";
    }

});
