# RevID
Trying to create a car identifier app for a personal project 
The purpose of the app is to be able to identify engines, cars, faults, and additives (supercharder/supercharger)
The problem with this is the amount of training data present, so the collection can be in the app, where people upload recordings with labels to be turned into training data, so that they can get a collection of that car. Rarer car means rarer collectible. Verification? 
The project plan is for the end goal to be a mobile app, but starting with creation on a web browser for my skill level. 
PECIES OF THE PROJECT START TO FINISH: 

WEBBROSER START
FASTAPI BACKEND --> python 
FRONTEND WEBSITE --> JavaScript 
ML MODEL -->  PyTorch? YAMNet? or AUDIOSET?
DATABASE --> SQL

COLLECTABLES SYSTEM (not quite sure how nesccicary this is espcially in start might just do picture of car reward to start)
COLLECTABLE GENERATOR --> pillow/canvas API?
RARITY ENGINE --> python 
COLLECTABLE VIEW --> HTML + CSS 

GO MOBILE 
TURN WEB TO APP --> React native or flutter? 
ACESS PHONE INFORMATION --> ReactAPI? 

GROW DATA SET AND MODEL (very rough and very far away)
TAKE COMMUNITY INFO --> Data Pipeline ? 
RETRAIN OCCASINALY --> MLOps Basiscs? 


WEBBROUSER V1 
"A webpage with a "Record" button that captures mic audio using the browser's MediaRecorder API
That audio gets sent to a FastAPI endpoint you write in Python
The backend converts it to a mel-spectrogram (using librosa) and runs it through a pre-trained audio classifier
The result comes back and you display it — even just as text to start"