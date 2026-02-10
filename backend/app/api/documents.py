from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import shutil
from pathlib import Path
from app.database import get_db, Document
from app.services.document_processor import DocumentProcessor
from app.services.vector_store import VectorStore
from app.config import UPLOAD_DIR

router = APIRouter(prefix="/api/documents", tags=["documents"])
processor = DocumentProcessor()
vector_store = VectorStore()

@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Upload and process a document"""
    
    # Validate file type
    file_ext = file.filename.split(".")[-1].lower()
    if file_ext not in ["pdf", "docx", "txt", "md"]:
        raise HTTPException(400, "Unsupported file type")
    
    # Save file
    file_path = UPLOAD_DIR / file.filename
    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        # Extract text
        text = processor.extract_text(str(file_path), file_ext)
        
        # Chunk text
        chunks = processor.chunk_text(
            text,
            metadata={
                "filename": file.filename,
                "file_type": file_ext
            }
        )
        
        # Store in vector database
        doc_id = f"doc_{file.filename}"
        vector_store.add_documents(chunks, doc_id)
        
        # Save to SQLite
        db_doc = Document(
            filename=file.filename,
            file_path=str(file_path),
            file_type=file_ext,
            num_chunks=len(chunks)
        )
        db.add(db_doc)
        db.commit()
        
        return {
            "message": "Document uploaded successfully",
            "filename": file.filename,
            "chunks": len(chunks)
        }
    
    except Exception as e:
        # Cleanup on error
        if file_path.exists():
            file_path.unlink()
        raise HTTPException(500, f"Error processing document: {str(e)}")

@router.get("/")
def list_documents(db: Session = Depends(get_db)):
    """Get all uploaded documents"""
    docs = db.query(Document).all()
    return [
        {
            "id": doc.id,
            "filename": doc.filename,
            "file_type": doc.file_type,
            "upload_date": doc.upload_date,
            "num_chunks": doc.num_chunks
        }
        for doc in docs
    ]

@router.delete("/{doc_id}")
def delete_document(doc_id: int, db: Session = Depends(get_db)):
    """Delete a document"""
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(404, "Document not found")
    
    # Delete from vector store
    vector_store.delete_document(f"doc_{doc.filename}")
    
    # Delete file
    Path(doc.file_path).unlink(missing_ok=True)
    
    # Delete from database
    db.delete(doc)
    db.commit()
    
    return {"message": "Document deleted successfully"}