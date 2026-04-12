# main.py
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

@app.get("/")
def home():
    return {"message": "Hello World!"}

@app.get("/html")
def get_html(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

# Run: uvicorn main:app --reload