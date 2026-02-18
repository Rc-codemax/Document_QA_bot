import { useState } from 'react';
import { BookOpen } from 'lucide-react';
import DocumentUpload from './components/DocumentUpload';
import DocumentList from './components/DocumentList';
import ChatInterface from './components/ChatInterface';
import './index.css';

function App() {
  const [refreshDocs, setRefreshDocs] = useState(0);

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="app-header__brand">
          <BookOpen size={22} strokeWidth={2} />
          <h1 className="app-header__title">AI Knowledge Base</h1>
        </div>
        <div className="app-header__status">
          <span className="status-dot" aria-label="Connected" />
          <span className="status-label">Ready</span>
        </div>
      </header>

      <div className="main-content">
        <aside className="sidebar">
          <div className="sidebar-content">
            <section>
              <h2 className="sidebar-section__heading">Upload Document</h2>
              <DocumentUpload
                onUploadSuccess={() => setRefreshDocs((r) => r + 1)}
              />
            </section>
            <div className="sidebar-divider" />
            <section>
              <DocumentList refresh={refreshDocs} />
            </section>
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
