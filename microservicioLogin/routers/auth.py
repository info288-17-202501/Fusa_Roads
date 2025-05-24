# Rutas para el login, refresco de token y ejemplo de ruta protegida
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated
from jose import jwt, JWTError
from utils.password import verify_password, hash_password
from utils.jwt_handler import REFRESH_SECRET, create_access_token, create_refresh_token, decode_token
from pydantic import BaseModel, EmailStr
import json

router = APIRouter()

def get_users_data():
    try:
        with open("users.json", "r") as file:
            return json.load(file)
    except FileNotFoundError:
        return {}

def save_users_data(users_data):
    with open("users.json", "w") as file:
        json.dump(users_data, file, indent=4)

@router.post("/token")
def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]): 
    users = get_users_data()
    user = users.get(form_data.username)
    if not user or not verify_password(form_data.password, user["password"]):
        raise HTTPException(status_code = 400, detail="Incorrect username or password")
    
    payload = {
        "name": user["name"],
        "lastname": user["lastname"],
        "username": user["username"],
        "email": user["email"]
    }
    access_token = create_access_token(payload)
    refresh_token = create_refresh_token(payload)
    return {"access_token": access_token, "refresh_token": refresh_token}


class RefreshTokenRequest(BaseModel):
    refresh_token: str

@router.post("/refresh")
def refresh_token(request: RefreshTokenRequest):
    try:
        data = jwt.decode(request.refresh_token, REFRESH_SECRET, algorithms=["HS256"])
    except JWTError:
        raise HTTPException(status_code=401, detail="invalid or expired refresh token")
    
    new_access_token = create_access_token({
        "name": data["name"],
        "lastname": data["lastname"],
        "username": data["username"],
        "email": data["email"]
    })
    return {"access_token": new_access_token}

class UserRegister(BaseModel):
    name:str
    lastname:str
    username:str
    email: EmailStr
    password: str

@router.post("/register")
def register_user(user: UserRegister):
    users = get_users_data()
    if user.username in users:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Username already registered")
    
    for exissting_user_data in users.values():
        if exissting_user_data.get("email") == user.email:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")
        
    hashed_password = hash_password(user.password)

    new_user = {
        "name" : user.name,
        "lastname" : user.lastname,
        "username" : user.username,
        "email" : user.email,
        "password" : hashed_password
    }

    users[user.username] = new_user
    save_users_data(users)
    return {"message":"User registered successfully"}

@router.get("/users/profile")
def profile(my_user: Annotated[dict, Depends(decode_token)]):
    return {
        "name": my_user.get("name"),
        "lastname": my_user.get("lastname"),
        "username": my_user.get("username"),
        "email": my_user.get("email")
    }
