from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import documents, chat

app = FastAPI(
    title="AI Knowledge Base",
    description="RAG-based question answering system",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(documents.router)
app.include_router(chat.router)

@app.get("/")
def root():
    return {"message": "AI Knowledge Base API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}