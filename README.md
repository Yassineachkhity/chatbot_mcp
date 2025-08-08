# Multilingual MCP Chatbot (Mistral + Elasticsearch)

Prototype d'un chatbot multilingue (arabe, français, anglais) exploitant :

- FastAPI (backend API)
- Modèle LLM Mistral (Hugging Face Transformers)
- Elasticsearch pour la recherche documentaire
- Détection de langue (`langdetect`)
- Frontend React + TailwindCSS
- Schéma d'outillage inspiré du Model Context Protocol (MCP)

## Objectifs

1. Détecter automatiquement la langue de l'utilisateur.
2. Interroger une base documentaire indexée dans Elasticsearch.
3. Fournir une réponse contextualisée dans la langue de l'utilisateur.
4. Préparer une intégration future avec un serveur MCP complet (outils déclaratifs).

## Architecture

```
React UI --> FastAPI /api/chat/generate
									|-- Language Detection (langdetect)
									|-- Elasticsearch Tool (search)
									|-- Prompt Builder
									|-- Mistral (text-generation pipeline)
```

### Dossiers principaux

```
backend/
	app/
		main.py              # App FastAPI
		core/config.py       # Configuration centralisée
		routers/chat.py      # Endpoint de chat
		services/            # LLM, recherche, langue
		mcp/                 # Outil Elasticsearch style MCP
frontend/
	src/                   # React + composants
```

## Prérequis

- Python 3.10+
- Node.js 18+
- Elasticsearch 8.x en local (`http://localhost:9200` par défaut)
- (Optionnel) GPU pour accélérer Mistral

## Installation Backend

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Variables d'environnement (facultatif) :

```
ES_HOST=http://localhost:9200
ES_INDEX=documents
MODEL_NAME=mistralai/Mistral-7B-v0.1
```

Lancer le serveur :

```powershell
python run.py
```

## Indexation Elasticsearch (exemple rapide)

```powershell
curl -X PUT http://localhost:9200/documents -H "Content-Type: application/json" -d '{
	"mappings": {"properties": {"title": {"type": "text"}, "content": {"type": "text"}}}
}'

curl -X POST http://localhost:9200/documents/_doc -H "Content-Type: application/json" -d '{
	"title": "Bonjour", "content": "Ceci est un document d'exemple en français."}'
```

## Frontend

```powershell
cd frontend
npm install
npm run dev
```

Ouvrir: http://localhost:5173 (selon port Vite).

## Endpoint Principal

POST `/api/chat/generate`

Payload :
```json
{
	"messages": [
		{"role": "user", "content": "Bonjour, qui es-tu ?"}
	],
	"max_new_tokens": 200
}
```

Réponse :
```json
{
	"reply": "...",
	"language": "fr",
	"sources": [ {"id": "...", "score": 1.2, "source": {"title": "..."}} ]
}
```

## Intégration MCP (esquisse)

Le dossier `app/mcp/` contient un outil `ElasticsearchQueryTool` qui imite un outil MCP. Une future étape consistera à :

- Exposer un vrai serveur MCP (ex: OpenMCP) 
- Déclarer les outils via un schéma JSON
- Orchestrer leur appel dynamique selon les intentions du LLM

## Stratégie de Prompt

Le prompt assemble : instructions système + langue détectée + extraits de documents + historique (6 derniers messages).

## Limites & Améliorations Futures

- Ajout d'embeddings + reranking
- Gestion conversationnelle longue (mémoire vectorielle)
- Authentification / quotas
- Streaming de tokens (Server-Sent Events)
- Intégration complète MCP (spec officielle)

## Développement

Tests rapides manuels :

```powershell
Invoke-RestMethod -Uri http://localhost:8000/api/chat/generate -Method Post -Body '{"messages":[{"role":"user","content":"Hello"}]}' -ContentType 'application/json'
```

## Licence

Prototype éducatif.

---
Documentation vivante – mettez à jour selon l'évolution du projet.
