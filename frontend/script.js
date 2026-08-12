console.log("JS IS RUNNING")

const recordButton = document.querySelector("button")
let recording = false
let audioChunks = []
let audioInput; 
let blob;

//Gets microphone access and runs the start and stop of it 
//turns the audio stream into a file that gets downloaded 
async function micAcess (params) {
    try{
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioInput = new MediaRecorder(stream); 
        console.log("Microphone Acess Greanted")

        audioInput.ondataavailable = (event) => {
            audioChunks.push(event.data)
        }

        audioInput.onstop = async (event) => {
            blob = new Blob(audioChunks, {type: 'webm' }) 
            const url = URL.createObjectURL(blob)
            console.log(url)
            stream.getTracks().forEach( (track) =>{
               track.stop()
            });
            
            //generate a unique file name for the audio download in order to not rewrite
            const uniqueName = `recording_${new Date().toISOString().slice(0, 10)}.webm`;

            //creates downloadable link of the audiofile
            const downloadLink = document.createElement('a')
            downloadLink.href = url
            downloadLink.download = uniqueName 
            downloadLink.click()
            
            //create package and send to fastAPI backend
            const formData = new FormData();
            formData.append("file", blob, uniqueName);
            const response = await fetch("http://127.0.0.1:8000/upload-audio", {
                method : "POST", 
                body : formData,
            })
            const result = await response.json()
            console.log(result)
        }
        
    } catch (error){
        console.log("Microphone Acess was not given")
    }
}

//chaning the button so that when recroding the button informs the user 
async function updateButton (){
    if(!recording){
        audioChunks = []
        await micAcess()
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

recordButton.addEventListener("click", updateButton)