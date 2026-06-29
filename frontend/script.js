const button = document.getElementById("recordButton");
const status = document.getElementById("status");

let isRecording = false;
let recorder;
let audioChunks = [];
let stream;

button.addEventListener("click", async function () {

    if (!isRecording) {
        isRecording = true;

        status.textContent = "Recording...";
        button.textContent = "Stop";

        await startRecording();

    } else {
        isRecording = false;

        status.textContent = "Processing...";
        button.textContent = "Start Recording";

        stopRecording();
    }

});


async function startRecording() {

    // Ask for microphone permission
    stream = await navigator.mediaDevices.getUserMedia({
        audio: true
    });

    recorder = new MediaRecorder(stream);

    audioChunks = [];

    recorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
    };

    recorder.onstop = () => {

    const audioBlob = new Blob(audioChunks, {
        type: "audio/webm"
    });

    const url = URL.createObjectURL(audioBlob);

    console.log(url);

    const audio = new Audio(url);
    audio.play();
    };

    recorder.start();
}

function stopRecording() {
    recorder.stop();
    stream.getTracks().forEach(track => track.stop());
}