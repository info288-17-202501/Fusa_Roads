from pydantic_settings import BaseSettings
from dotenv import load_dotenv
# aqui se importan las variables de entorno que vienen del docker-compose

class Settings(BaseSettings):

    MONGOURI: str
    DATABASE:str

    class Config:
        #env_file = ".env"  
        case_sensitive = True
settings = Settings()