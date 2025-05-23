from pydantic import BaseSettings

# aqui se importan las variables de entorno que vienen del docker-compose

class Settings(BaseSettings):
    POSTGRES_USER: str 
    POSTGRES_PASSWORD: str 
    POSTGRES_DB: str
    POSTGRES_PORT: str
    POSTGRES_HOST: str

    class Config:
        #env_file = ".env"  
        case_sensitive = True
settings = Settings()