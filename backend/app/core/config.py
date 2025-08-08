import os
from functools import lru_cache
from pydantic import BaseSettings

class Settings(BaseSettings):
    es_host: str = os.getenv("ES_HOST", "http://localhost:9200")
    model_name: str = os.getenv("MODEL_NAME", "mistralai/Mistral-7B-v0.1")
    es_index: str = os.getenv("ES_INDEX", "documents")
    max_history: int = 6

@lru_cache
def get_settings() -> Settings:
    return Settings()
