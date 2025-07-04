from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    minio_endpoint: str
    minio_access_key: str
    minio_secret_key: str

    class Config:
        env_file = "minio_service.env"

minio_settings = Settings()
