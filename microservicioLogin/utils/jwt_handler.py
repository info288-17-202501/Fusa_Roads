# Lógica para crear y decodificar Tokens JWT (access y refresh)
from datetime import  datetime, timedelta
from jose import jwt, JWTError
from fastapi import HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
import json

# Delcarar claves secretas en una variable de entrno mejor
ACCESS_SECRET = "clave_secreta"
REFRESH_SECRET = "refresh_clave_secreta"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Tokens
def create_access_token(data: dict, expires_delta: timedelta = timedelta(minutes=15)): #Duración del access_token
    to_encode = data.copy()
    to_encode.update({"exp": datetime.utcnow() + expires_delta})
    return jwt.encode(to_encode, ACCESS_SECRET, algorithm="HS256")

def create_refresh_token(data: dict, expires_delta: timedelta = timedelta(days=7)):
    to_encode = data.copy()
    to_encode.update({"exp": datetime.utcnow() + expires_delta})
    return jwt.encode(to_encode, REFRESH_SECRET, algorithm="HS256")

def decode_token(token: str = Depends(oauth2_scheme)) -> dict:
    try:
        data = jwt.decode(token, ACCESS_SECRET, algorithms=["HS256"])
        return data
        # with open("users.json", "r") as file:
        #     users = json.load(file)
        # user = users.get(data["username"])
        # if not user:
        #     raise HTTPException(status_code=404, detail="User not found")
        # return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")