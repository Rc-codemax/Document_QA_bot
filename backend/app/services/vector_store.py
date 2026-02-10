import chromadb
from chromadb.config import Settings
from typing import List, Dict
from app.config import CHROMA_DIR
from sentence_transformers import SentenceTransformer

class VectorStore:
    def __init__(self):
        self.client = chromadb.PersistentClient(
            path=str(CHROMA_DIR),
            settings=Settings(anonymized_telemetry=False)
        )
        self.collection = self.client.get_or_create_collection(
            name="knowledge_base",
            metadata={"hnsw:space": "cosine"}
        )
        self.embedding_model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
    
    def add_documents(self, documents: List[dict], doc_id: str):
        """Add document chunks to vector store"""
        ids = []
        embeddings = []
        metadatas = []
        contents = []
        
        for i, doc in enumerate(documents):
            chunk_id = f"{doc_id}_chunk_{i}"
            ids.append(chunk_id)
            
            # Generate embedding
            embedding = self.embedding_model.encode(doc["content"]).tolist()
            embeddings.append(embedding)
            
            # Prepare metadata
            metadata = doc["metadata"].copy()
            metadata["document_id"] = doc_id
            metadatas.append(metadata)
            
            contents.append(doc["content"])
        
        # Add to ChromaDB
        self.collection.add(
            ids=ids,
            embeddings=embeddings,
            metadatas=metadatas,
            documents=contents
        )
    
    def search(self, query: str, n_results: int = 5) -> Dict:
        """Search for similar chunks"""
        query_embedding = self.embedding_model.encode(query).tolist()
        
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=n_results
        )
        
        return results
    
    def delete_document(self, doc_id: str):
        """Delete all chunks of a document"""
        # Get all chunk IDs for this document
        results = self.collection.get(
            where={"document_id": doc_id}
        )
        
        if results['ids']:
            self.collection.delete(ids=results['ids'])