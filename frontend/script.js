console.log("JS IS RUNNING")

const recordButton = document.querySelector("button")
let recording = false
let audioChunks = []
let audioInput; 
let blob;


//asking for microphone acess and printing that you need it 
async function micAcess (params) {
    try{
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioInput = new MediaRecorder(stream); 
        console.log("Microphone Acess Greanted")

        audioInput.ondataavailable = (event) => {
            audioChunks.push(event.data)
        }

        audioInput.onstop = (event) => {
            blob = new Blob(audioChunks, {type: 'webm' }) 
            const url = URL.createObjectURL(blob)
            console.log(url)
            stream.getTracks().forEach( (track) =>{
               track.stop()
            });

            const downloadLink = document.createElement('a')
            downloadLink.href = url
            downloadLink.download = 'my-recording.webm'
            downloadLink.click()
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