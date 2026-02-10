import { useState, useRef, useEffect } from 'react';
import { chatAPI } from '../services/api';
import ReactMarkdown from 'react-markdown';

interface Source {
  source_number: number;
  filename: string;
  chunk_index: number;
  content_preview: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: Source[];
  error?: boolean;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await chatAPI.query(input);
      const assistantMessage: Message = {
        role: 'assistant',
        content: response.data.answer,
        sources: response.data.sources
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      const errorMessage: Message = {
        role: 'assistant',
        content: '❌ Error: ' + (error.response?.data?.detail || error.message),
        error: true
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="messages-container">
        {messages.length === 0 && (
          <div className="empty-state">
            <p>👋 Ask me anything about your documents!</p>
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <div key={idx} className={`message-wrapper ${msg.role}`}>
            <div className={`message ${msg.role} ${msg.error ? 'error' : ''}`}>
              <ReactMarkdown>{msg.content}</ReactMarkdown>
              
              {msg.sources && msg.sources.length > 0 && (
                <div className="sources">
                  <p>Sources:</p>
                  {msg.sources.map((source, i) => (
                    <details key={i} className="source-item">
                      <summary className="source-summary">
                        📄 {source.filename} (chunk {source.chunk_index})
                      </summary>
                      <p className="source-preview">{source.content_preview}</p>
                    </details>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="message-wrapper assistant">
            <div className="loading-message">
              <p>Thinking...</p>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <form onSubmit={handleSubmit} className="chat-input-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about your documents..."
            className="chat-input"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="send-btn"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}