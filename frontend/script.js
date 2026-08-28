console.log("JS IS RUNNING")

const recordButton = document.querySelector("button")
const outputElement = document.getElementById("gemini-output")
let recording = false
let audioChunks = []
let audioInput; 
let blob;

async function micAcess() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        audioInput = new MediaRecorder(stream);

        console.log("Microphone Access Granted");

        audioInput.ondataavailable = (event) => {
            audioChunks.push(event.data);
        };

        audioInput.onstop = async () => {

            console.log("RECORDING STOPPED");

            blob = new Blob(audioChunks, {
                type: "audio/webm"
            });

            console.log("BLOB CREATED");
            console.log("Blob size:", blob.size);

            stream.getTracks().forEach((track) => {
                track.stop();
            });

            const dateString = new Date()
                .toISOString()
                .slice(0, 19);

            const formattedString = dateString
                .replace("T", "_")
                .replaceAll(":", "-");

            const uniqueName = `recording_${formattedString}.webm`;

            const formData = new FormData();

            formData.append("file", blob, uniqueName);

            try {

                console.log("ABOUT TO SEND AUDIO TO FASTAPI");

                const response = await fetch(
                    "http://127.0.0.1:8000/upload-audio",
                    {
                        method: "POST",
                        body: formData
                    }
                );

                console.log("FETCH COMPLETED");

                console.log("Status:", response.status);
                console.log("OK:", response.ok);

                const data = await response.json();

                console.log("JSON RECEIVED:", data);

                if (outputElement) {
                    outputElement.innerText = data.description;
                }

            } catch (error) {

                console.error("FETCH ERROR:", error);

                if (outputElement) {
                    outputElement.innerText =
                        "Something went wrong processing your audio.";
                }
            }

            console.log("RESPONSE FROM FASTAPI");
        };

    } catch (error) {

        console.error("Microphone Access was not given:", error);
    }

    return audioInput;
}

//chaning the button so that when recroding the button informs the user 
async function updateButton (){
    if(!recording){
        audioChunks = []
        audioInput = await micAcess()
        console.log("Audio Recording")
        recordButton.innerText = "Stop Recording"
        recording = true 
        audioInput.start();

    } else {
        console.log("Audio Stopped Recording")
        recordButton.innerText = "RECORD"
        recording = false 

        audioInput.stop()
    }
}

recordButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    console.log("BUTTON CLICKED");

    updateButton(event);
});