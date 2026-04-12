from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return {"message":"hello sahil"}

# @app.get("/user/{user_id}")
# def get_user(user_id:int):
#     return {"user_id":user_id}
@app.get("/user/{user_id}")
def get_user(user_id: int):
    return {"user_id": user_id}