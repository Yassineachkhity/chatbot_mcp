from transformers import pipeline
from ..core.config import get_settings
from functools import lru_cache

@lru_cache
def get_generator():
    settings = get_settings()
    pipe = pipeline("text-generation", model=settings.model_name, device_map="auto")
    return pipe

def generate_response(prompt: str, max_new_tokens: int = 256) -> str:
    pipe = get_generator()
    out = pipe(prompt, max_new_tokens=max_new_tokens, do_sample=True, top_p=0.9, temperature=0.7)
    if isinstance(out, list) and len(out) > 0:
        return out[0].get("generated_text", "").strip()
    return ""
