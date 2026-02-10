import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
UPLOAD_DIR = BASE_DIR / "uploads"
CHROMA_DIR = BASE_DIR / "chroma_db"
DATABASE_URL = f"sqlite:///{BASE_DIR}/knowledge_base.db"

# Create directories if they don't exist
UPLOAD_DIR.mkdir(exist_ok=True)
CHROMA_DIR.mkdir(exist_ok=True)

# LLM settings
OLLAMA_BASE_URL = "http://localhost:11434"
OLLAMA_MODEL = "llama3.2"  # or "mistral", "phi3"

# Embeddings settings
EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"

# Chunking settings
CHUNK_SIZE = 1000
CHUNK_OVERLAP = 200