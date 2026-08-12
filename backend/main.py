import os
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# make a folder to store the audio files in 
os.makedirs("saved_audio", exist_ok=True)

@app.post("/upload-audio")
async def upload_audio(file: UploadFile = File(...)):
    # Take in the file and save it
    # Read the bytes from the incoming file 
    audio_bytes = await file.read()
    
    # Combine your folder name and the filename
    file_path = os.path.join("saved_audio", file.filename)
    
    # 3. Open the file path
    with open(file_path, "wb") as f:
        f.write(audio_bytes)
        
    return {"status": "success", "saved_as": file.filename}
