from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    host: str
    port: int
    minio_endpoint: str
    minio_access_key: str
    minio_secret_key: str
    minio_buckets: str

    @property
    def minio_bucket_list(self) -> List[str]:   # Lista de buckets
        return [b.strip() for b in self.minio_buckets.split(',')]

    class Config:
        env_file = ".env"
        # extra = "ignore" # Esto permite no tener que definir todas las variables en el .env

settings = Settings()