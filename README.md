# 🧠 AI Knowledge Base

A powerful RAG (Retrieval-Augmented Generation) application that allows users to upload documents and ask questions using AI.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.10+-blue.svg)
![React](https://img.shields.io/badge/react-18.0+-blue.svg)

## 🌟 Features

- 📄 **Document Upload**: Support for PDF, DOCX, TXT, and Markdown files
- 💬 **Interactive Chat**: Natural language interface for querying documents
- 🔍 **Semantic Search**: Vector-based similarity search using embeddings
- 🤖 **AI-Powered Answers**: Context-aware responses with source citations
- 📚 **Document Management**: Easy upload, view, and delete operations
- 🎯 **Source Tracking**: See exactly which parts of documents were used to answer

## 🛠️ Tech Stack

### Frontend
- **React** with TypeScript
- **Vite** for fast development
- **Axios** for API calls
- **React Dropzone** for file uploads
- **React Markdown** for formatted responses

### Backend
- **FastAPI** - Modern Python web framework
- **LangChain** - LLM application framework
- **ChromaDB** - Vector database for embeddings
- **Sentence Transformers** - Text embeddings
- **Ollama** - Local LLM inference
- **SQLite** - Metadata storage
- **PyPDF2** & **python-docx** - Document processing

## 📦 Installation

### Prerequisites

- Python 3.10 or higher
- Node.js 18 or higher
- [Ollama](https://ollama.ai) installed locally

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
```

### Ollama Setup
```bash
# Pull a language model (choose one)
ollama pull llama3.2      # Recommended - balanced performance
ollama pull mistral       # Alternative - good quality
ollama pull phi3          # Smaller, faster option
```

## 🚀 Running the Application

You need to run **three services** simultaneously:

### 1. Start Ollama Server
```bash
ollama serve
```

### 2. Start Backend (new terminal)
```bash
cd backend
.\venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac
uvicorn app.main:app --reload --port 8000
```

Backend will be available at: `http://localhost:8000`

### 3. Start Frontend (new terminal)
```bash
cd frontend
npm run dev
```

Frontend will be available at: `http://localhost:5173`

## 💡 Usage

1. Open your browser and navigate to `http://localhost:5173`
2. **Upload a document**:
   - Drag and drop or click to select a file
   - Supported formats: PDF, DOCX, TXT, MD
3. **Ask questions**:
   - Type your question in the chat input
   - Get AI-powered answers with source citations
4. **View sources**:
   - Click on source references to see the exact text used
5. **Manage documents**:
   - View all uploaded documents in the sidebar
   - Delete documents when no longer needed

## 📁 Project Structure
```
ai-knowledge-base/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat.py          # Chat endpoints
│   │   │   └── documents.py     # Document endpoints
│   │   ├── services/
│   │   │   ├── document_processor.py  # Text extraction & chunking
│   │   │   ├── vector_store.py        # ChromaDB operations
│   │   │   └── llm_service.py         # Ollama integration
│   │   ├── config.py            # Configuration
│   │   ├── database.py          # SQLite models
│   │   └── main.py              # FastAPI app
│   ├── uploads/                 # Uploaded documents
│   ├── chroma_db/              # Vector database
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── ChatInterface.tsx
    │   │   ├── DocumentUpload.tsx
    │   │   └── DocumentList.tsx
    │   ├── services/
    │   │   └── api.ts           # API client
    │   ├── App.tsx
    │   └── index.css
    └── package.json
```

## 🔧 Configuration

### Backend Configuration

Edit `backend/app/config.py`:
```python
OLLAMA_MODEL = "llama3.2"        # Change model
CHUNK_SIZE = 1000                # Adjust chunk size
CHUNK_OVERLAP = 200              # Adjust overlap
EMBEDDING_MODEL = "all-MiniLM-L6-v2"  # Change embedding model
```

### Frontend Configuration

Edit `frontend/src/services/api.ts`:
```typescript
const API_BASE_URL = 'http://localhost:8000/api';  // Change if needed
```

## 🎯 API Endpoints

### Documents
- `POST /api/documents/upload` - Upload a document
- `GET /api/documents/` - List all documents
- `DELETE /api/documents/{id}` - Delete a document

### Chat
- `POST /api/chat/query` - Ask a question
- `GET /api/chat/history` - Get chat history

### Health
- `GET /` - API info
- `GET /health` - Health check

## 🔮 Future Enhancements

- [ ] User authentication and authorization
- [ ] Multiple knowledge bases per user
- [ ] Real-time streaming responses
- [ ] Chat history export (PDF, Markdown)
- [ ] Support for images and tables in PDFs
- [ ] Advanced filtering and search
- [ ] Dark mode
- [ ] Deployment guides (Docker, Cloud)

## 🐛 Troubleshooting

### Common Issues

**"Connection refused" error:**
- Make sure Ollama is running (`ollama serve`)
- Verify backend is running on port 8000
- Check frontend API URL configuration

**Document upload fails:**
- Check file format is supported (PDF, DOCX, TXT, MD)
- Ensure uploads folder has write permissions
- Check backend logs for detailed errors

**Slow responses:**
- Try a smaller/faster model (phi3)
- Reduce chunk size in config
- Reduce number of sources retrieved

**Import errors:**
- Ensure all dependencies are installed
- Activate virtual environment before running backend
- Run `pip install -r requirements.txt` again


## 🙏 Acknowledgments

- Built with [FastAPI](https://fastapi.tiangolo.com/)
- Powered by [LangChain](https://python.langchain.com/)
- LLM inference by [Ollama](https://ollama.ai)
- Vector storage by [ChromaDB](https://www.trychroma.com/)

---

⭐ If you find this project helpful, please consider giving it a star!
