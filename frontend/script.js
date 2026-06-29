const button = document.getElementById("recordButton");
const status = document.getElementById("status");

let isRecording = false;
let recorder;
let audioChunks = [];
let stream;

