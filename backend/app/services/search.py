from elasticsearch import Elasticsearch
from ..core.config import get_settings
from typing import List, Dict
from elasticsearch import NotFoundError, TransportError

_es_client = None

def get_client() -> Elasticsearch:
    global _es_client
    if _es_client is None:
        settings = get_settings()
        _es_client = Elasticsearch(settings.es_host)
    return _es_client


def search_documents(query: str, size: int = 3) -> List[Dict]:
    es = get_client()
    settings = get_settings()
    body = {
        "query": {
            "multi_match": {
                "query": query,
                "fields": ["title^2", "content"],
                "fuzziness": "AUTO"
            }
        },
        "size": size
    }
    try:
        resp = es.search(index=settings.es_index, body=body)
        hits = resp.get('hits', {}).get('hits', [])
    except (NotFoundError, TransportError):
        return []
    return [
        {
            "id": h.get('_id'),
            "score": h.get('_score'),
            "source": h.get('_source', {})
        } for h in hits
    ]
