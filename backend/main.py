# Instead of: from fastapi import FastAPI -> app = FastAPI()
from fastapi_offline import FastAPIOffline

app = FastAPIOffline()

@app.get("/")
def read_root():
    return {"Hello": "World"}