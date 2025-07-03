from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    APP_HOST: str
    APP_PORT: int
    MINIO_ENDPOINT: str
    MINIO_ACCESS_KEY: str
    MINIO_SECRET_KEY: str
    MINIO_BUCKETS: str

    @property
    def minio_bucket_list(self) -> List[str]:   # Lista de buckets
        return [b.strip() for b in self.minio_buckets.split(',')]

    class Config:
        env_file = ".env"
        extra = "ignore" # Esto permite no tener que definir todas las variables en el .env

settings = Settings()