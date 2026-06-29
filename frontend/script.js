
const button = document.getElementById("record");
const status = document.getElementById("status");

let stream;
let recorder;
let chunks = [];
let isRecording = false;

//starts the recording process and gets microphone permission from user
async function startRecording() {

    //request microphone access
    stream = await navigator.mediaDevices.getUserMedia({
        audio: true
    });

    recorder = new MediaRecorder(stream);

    chunks = [];

    recorder.ondataavailable = function (event) {
        chunks.push(event.data);
    };

    recorder.onstop = function () {

        // Combine all audio chunks into a single file 
        const blob = new Blob(chunks, { type: "audio/webm" });

        // Create a temporary URL so browser can play it
        const url = URL.createObjectURL(blob);

        // Create an audio player and play it
        const audio = new Audio(url);
        audio.play();
        status.textContent = "Playing recording";
    };

    // Step 6: start recording audio
    recorder.start();
    status.textContent = "Recording...";
}

//stops the recording process to start processing
function stopRecording() {

    if (!recorder) return;
    status.textContent = "Processing...";
    recorder.stop();
    // Stop microphone stream
    stream.getTracks().forEach(track => track.stop());
}

//button logic so that first click starts recording and second click stops the recording
button.onclick = async function () {

    if (!isRecording) {
        isRecording = true;
        button.textContent = "Stop";
        await startRecording();
    } else {
        isRecording = false;
        button.textContent = "Start Recording";
        stopRecording();
    }
};