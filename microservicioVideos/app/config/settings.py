from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    host: str 
    port: int
    minio_endpoint: str
    minio_access_key: str
    minio_secret_key: str
    minio_bucket: str

    class Config:
        env_file = ".env"
        # extra = "ignore" # Esto permite no tener que definir todas las variables en el .env

settings = Settings()