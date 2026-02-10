import requests
import json
from typing import List, Dict
from app.config import OLLAMA_BASE_URL, OLLAMA_MODEL

class LLMService:
    def __init__(self):
        self.base_url = OLLAMA_BASE_URL
        self.model = OLLAMA_MODEL
    
    def generate_answer(self, question: str, context_chunks: List[str]) -> str:
        """Generate answer using retrieved context"""
        
        # Build context from chunks
        context = "\n\n".join([f"Source {i+1}:\n{chunk}" for i, chunk in enumerate(context_chunks)])
        
        # Create prompt
        prompt = f"""You are a helpful assistant that answers questions based on the provided context.

Context:
{context}

Question: {question}

Instructions:
- Answer the question using ONLY the information from the context above
- If the context doesn't contain enough information to answer, say so
- Be concise but complete
- Cite which source(s) you used (e.g., "According to Source 1...")

Answer:"""
        
        # Call Ollama API
        response = requests.post(
            f"{self.base_url}/api/generate",
            json={
                "model": self.model,
                "prompt": prompt,
                "stream": False
            }
        )
        
        if response.status_code == 200:
            return response.json()["response"]
        else:
            raise Exception(f"LLM API error: {response.text}")