import os
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from dotenv import load_dotenv
from google import genai
import ffmpeg
import time
import logging
import uuid

logger = logging.getLogger("uvicorn.error")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# make a folder to store the audio files in 
os.makedirs("saved_audio", exist_ok=True)

  # Find and load the .env file from the project root (REvID/)
env_path = Path(__file__).resolve().parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

@app.post("/upload-audio")
def upload_audio(file: UploadFile = File(...)):
    # Take in the file and save it

    # Verify the environment variable exists before starting
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not found in environment variables.")

    #creates the input and output paths for the audio file for conversion
    file_id = uuid.uuid4().hex  # Generate a unique identifier for the file
    input_path = os.path.join("saved_audio", f"{file_id}.webm")
    output_path = os.path.join("saved_audio", f"{file_id}.mp3")
    uploaded_file = None  # Initialize the variable to hold the uploaded file reference
    client = genai.Client(api_key=api_key)  # Initialize the Gemini client

    try:
        # Read the bytes from the incoming file
        audio_bytes = file.file.read()
        # 3. Open the file path
        with open(input_path, "wb") as f:
            f.write(audio_bytes)
        try:
            # Convert the audio file to mp3 using ffmpeg
            ffmpeg.input(input_path).output(output_path, audio_bitrate='192k').run( quiet=True, overwrite_output=True)


            
        except ffmpeg.Error as e:
            logger.error(f"FFmpeg error: {e.stderr.decode()}")
            raise HTTPException(status_code=500, detail="Error converting audio file to mp3 format")
        

        try:
            uploaded_file = client.files.upload(file=output_path, config={"mime_type": "audio/mp3"})
            while uploaded_file.state.name == "PROCESSING":
                time.sleep(1)
                uploaded_file = client.files.get(name=uploaded_file.name)
            
            if uploaded_file.state.name == "FAILED":
                raise HTTPException(status_code=502, detail="Audio file failed processing on Gemini servers.")


            response = client.models.generate_content(
                model="gemini-3.1-flash-lite",
                contents=[uploaded_file, "The audio file is of a malfunction in a car. "
                "Please provide a detailed description of the issue based on the audio. "
                "If the audio is not a car answer with 'Not a car issue'."],
            )


        except Exception as e:
            logger.error(f"Gemini Request Failed: {str(e)}")
            raise HTTPException(status_code=502, detail="Failed to analyze audio")
        
        if not response.candidates:
            raise HTTPException(status_code=502, detail="No response generated from Gemini model")
        
        result_text = response.text
        logger.info(f"Generated Description: {result_text}")
        return {"description": result_text}
    
    finally:
        # Clean up the temporary files
        if os.path.exists(input_path):
            os.remove(input_path)
        if os.path.exists(output_path):
            os.remove(output_path)
        if uploaded_file is not None:
            try:
                client.files.delete(name=uploaded_file.name)
            except Exception as e:
                logger.warning(f"Failed to delete uploaded file from Gemini: {str(e)}")