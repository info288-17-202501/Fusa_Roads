from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated
from jose import jwt, JWTError
from utils.password import verify_password
from utils.jwt_handler import REFRESH_SECRET, create_access_token, create_refresh_token, decode_token
from pydantic import BaseModel
import json

router = APIRouter()

# Cambiar por los usuarios de la BD
with open("users.json", "r") as file:
    users = json.load(file)

@router.post("/token")
def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]): 
    user = users.get(form_data.username)
    if not user or not verify_password(form_data.password, user["password"]):
        raise HTTPException(status_code = 400, detail="Incorrect username or password")
    
    payload = {"username": user["username"], "email": user["email"]}
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
    
    new_access_token = create_access_token({"username": data["username"], "email": data["email"]})
    return {"access_token": new_access_token}

@router.get("/users/profile")
def profile(my_user: Annotated[dict, Depends(decode_token)]):
    return my_user
