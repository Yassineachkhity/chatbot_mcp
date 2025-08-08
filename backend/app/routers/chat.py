from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
from ..services.language import detect_language
from ..services.search import search_documents
from ..services.llm import generate_response
from ..core.config import get_settings

router = APIRouter()

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]
    max_new_tokens: Optional[int] = 200

class ChatResponse(BaseModel):
    reply: str
    language: str
    sources: List[dict]

SYSTEM_INSTRUCTIONS = (
    "You are a multilingual assistant. Answer in the detected user language (Arabic, French or English). "
    "Use provided context documents if relevant. Be concise and clear."
)

def build_prompt(messages: List[Message], docs: List[dict], lang: str) -> str:
    context_blocks = []
    for d in docs:
        src = d.get('source', {})
        context_blocks.append(f"[DocTitle]: {src.get('title','')}\n[DocContent]: {src.get('content','')[:500]}")
    context_text = "\n\n".join(context_blocks)
    conversation = "\n".join([f"{m.role.upper()}: {m.content}" for m in messages[-6:]])
    prompt = f"SYSTEM: {SYSTEM_INSTRUCTIONS}\nLANGUAGE: {lang}\n\nCONTEXT:\n{context_text}\n\nCONVERSATION:\n{conversation}\n\nASSISTANT:".strip()
    return prompt

@router.post("/generate", response_model=ChatResponse)
async def chat(req: ChatRequest):
    if not req.messages:
        return ChatResponse(reply="Please provide a message.", language="en", sources=[])
    user_last = req.messages[-1].content
    lang = detect_language(user_last)
    # Retrieve docs
    docs = search_documents(user_last)
    prompt = build_prompt(req.messages, docs, lang)
    raw_output = generate_response(prompt, max_new_tokens=req.max_new_tokens or 200)
    # Heuristic: take text after last 'ASSISTANT:' marker
    if 'ASSISTANT:' in raw_output:
        reply = raw_output.split('ASSISTANT:')[-1].strip()
    else:
        reply = raw_output.strip()
    return ChatResponse(reply=reply, language=lang, sources=docs)
