const button = document.getElementById("recordButton");
const status = document.getElementById("status");

button.addEventListener("click", function () {
    status.textContent = "Listening...";
});
