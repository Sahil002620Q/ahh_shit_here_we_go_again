from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def web():
    return {"hello"} 