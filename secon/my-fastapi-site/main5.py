from fastapi import FastAPI

app = FastAPI()  # Create app

@app.get("/")  # When someone visits /
def home():    # This function runs
    return {"message": "Hello World!"}

# Run: uvicorn main:app --reload