from langdetect import detect

SUPPORTED_LANGS = {"ar": "ar", "fr": "fr", "en": "en"}

FALLBACK = "en"

def detect_language(text: str) -> str:
    try:
        code = detect(text)
        if code in SUPPORTED_LANGS:
            return code
    except Exception:
        pass
    return FALLBACK
