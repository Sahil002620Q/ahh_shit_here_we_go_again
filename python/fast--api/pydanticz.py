from pydantic import BaseModel
class User(BaseModel):
    name: str
    age: int
@app.post("/create-user")
def create_user(user:User):
    return{
        "username":user,
        "message":"usercreated"
    }