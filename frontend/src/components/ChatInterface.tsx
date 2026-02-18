import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Bot, User, Trash2, ChevronDown, BookOpen } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useChat } from '../hooks/useChat';
import type { Message, Source } from '../types';

// ---- sub-component: SourceCard -----------------------------------------
interface SourceCardProps {
  source: Source;
}

function SourceCard({ source }: SourceCardProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`source-card ${open ? 'source-card--open' : ''}`}>
      <button
        className="source-card__toggle"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <BookOpen size={13} />
        <span className="source-card__filename">{source.filename}</span>
        <span className="source-card__chunk">chunk {source.chunk_index}</span>
        <ChevronDown size={14} className="source-card__chevron" />
      </button>
      {open && (
        <p className="source-card__preview">{source.content_preview}</p>
      )}
    </div>
  );
}

// ---- sub-component: MessageBubble --------------------------------------
interface MessageBubbleProps {
  message: Message;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  return (
    <div className={`message-wrapper message-wrapper--${message.role}`}>
      <div className={`avatar avatar--${message.role}`} aria-hidden="true">
        {isUser ? <User size={14} /> : <Bot size={14} />}
      </div>
      <div className="message-body">
        <div
          className={`message-bubble ${
            message.error
              ? 'message-bubble--error'
              : `message-bubble--${message.role}`
          }`}
        >
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
        <time
          className="message-timestamp"
          dateTime={message.timestamp.toISOString()}
        >
          {formatTime(message.timestamp)}
        </time>
        {message.sources && message.sources.length > 0 && (
          <div className="sources-list">
            <p className="sources-list__label">Sources</p>
            {message.sources.map((src) => (
              <SourceCard key={src.source_number} source={src} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ---- sub-component: TypingIndicator ------------------------------------
function TypingIndicator() {
  return (
    <div className="message-wrapper message-wrapper--assistant">
      <div className="avatar avatar--assistant" aria-hidden="true">
        <Bot size={14} />
      </div>
      <div className="message-body">
        <div className="typing-indicator" aria-label="AI is thinking">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}

// ---- main component ----------------------------------------------------
export default function ChatInterface() {
  const { messages, loading, submitMessage, clearMessages } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const text = input.trim();
      if (!text) return;
      setInput('');
      await submitMessage(text);
    },
    [input, submitMessage]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const text = input.trim();
        if (!text) return;
        setInput('');
        submitMessage(text);
      }
    },
    [input, submitMessage]
  );

  return (
    <div className="chat-container">
      {/* Chat panel header */}
      <div className="chat-panel-header">
        <span className="chat-panel-header__title">Chat</span>
        {messages.length > 0 && (
          <button
            className="btn-ghost btn-ghost--sm"
            onClick={clearMessages}
            title="Clear conversation"
            aria-label="Clear conversation"
          >
            <Trash2 size={15} />
            Clear
          </button>
        )}
      </div>

      {/* Message list */}
      <div className="messages-container" role="log" aria-live="polite">
        {messages.length === 0 && (
          <div className="empty-state">
            <Bot size={40} strokeWidth={1.5} className="empty-state__icon" />
            <p className="empty-state__title">No messages yet</p>
            <p className="empty-state__hint">
              Upload a document, then ask anything about it.
            </p>
          </div>
        )}
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {loading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="chat-input-container">
        <form onSubmit={handleSubmit} className="chat-input-form">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question… (Enter to send, Shift+Enter for newline)"
            className="chat-input"
            disabled={loading}
            rows={1}
            aria-label="Message input"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="send-btn"
            aria-label="Send message"
          >
            <Send size={17} strokeWidth={2} />
          </button>
        </form>
      </div>
    </div>
  );
}
