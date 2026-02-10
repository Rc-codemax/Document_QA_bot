from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database import get_db, ChatHistory
from app.services.vector_store import VectorStore
from app.services.llm_service import LLMService
import json

router = APIRouter(prefix="/api/chat", tags=["chat"])
vector_store = VectorStore()
llm_service = LLMService()

class QueryRequest(BaseModel):
    question: str
    num_sources: int = 5

class QueryResponse(BaseModel):
    answer: str
    sources: list

@router.post("/query", response_model=QueryResponse)
async def query_knowledge_base(
    request: QueryRequest,
    db: Session = Depends(get_db)
):
    """Ask a question about uploaded documents"""
    
    try:
        # Search vector store
        search_results = vector_store.search(
            request.question,
            n_results=request.num_sources
        )
        
        if not search_results['documents'][0]:
            return QueryResponse(
                answer="I don't have any documents to answer this question. Please upload some documents first.",
                sources=[]
            )
        
        # Extract context chunks
        context_chunks = search_results['documents'][0]
        
        # Generate answer
        answer = llm_service.generate_answer(request.question, context_chunks)
        
        # Prepare sources
        sources = []
        for i, (doc, metadata) in enumerate(zip(
            search_results['documents'][0],
            search_results['metadatas'][0]
        )):
            sources.append({
                "source_number": i + 1,
                "filename": metadata.get("filename", "Unknown"),
                "chunk_index": metadata.get("chunk_index", 0),
                "content_preview": doc[:200] + "..." if len(doc) > 200 else doc
            })
        
        # Save to chat history
        chat_entry = ChatHistory(
            question=request.question,
            answer=answer,
            sources=json.dumps(sources)
        )
        db.add(chat_entry)
        db.commit()
        
        return QueryResponse(answer=answer, sources=sources)
    
    except Exception as e:
        raise HTTPException(500, f"Error processing query: {str(e)}")

@router.get("/history")
def get_chat_history(db: Session = Depends(get_db), limit: int = 50):
    """Get recent chat history"""
    history = db.query(ChatHistory).order_by(
        ChatHistory.timestamp.desc()
    ).limit(limit).all()
    
    return [
        {
            "id": entry.id,
            "question": entry.question,
            "answer": entry.answer,
            "sources": json.loads(entry.sources),
            "timestamp": entry.timestamp
        }
        for entry in history
    ]