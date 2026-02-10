import { useState } from 'react';
import DocumentUpload from './components/DocumentUpload';
import DocumentList from './components/DocumentList';
import ChatInterface from './components/ChatInterface';
import './index.css';

function App() {
  const [refreshDocs, setRefreshDocs] = useState(0);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🧠 AI Knowledge Base</h1>
      </header>

      <div className="main-content">
        <aside className="sidebar">
          <div className="sidebar-content">
            <DocumentUpload onUploadSuccess={() => setRefreshDocs((r) => r + 1)} />
            <DocumentList refresh={refreshDocs} />
          </div>
        </aside>

        <main className="chat-area">
          <ChatInterface />
        </main>
      </div>
    </div>
  );
}

export default App;