from pydantic_settings import BaseSettings

# aqui se importan las variables de entorno que vienen del docker-compose

class Settings(BaseSettings):
    MONGOURI: str 
    MONGO_DB: str

    class Config:
        #env_file = ".env"  
        case_sensitive = True
settings = Settings()