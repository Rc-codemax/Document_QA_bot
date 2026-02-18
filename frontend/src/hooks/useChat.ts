import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { chatAPI } from '../services/api';
import type { Message } from '../types';

interface UseChatReturn {
  messages: Message[];
  loading: boolean;
  submitMessage: (text: string) => Promise<void>;
  clearMessages: () => void;
}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const submitMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || loading) return;

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content: text,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setLoading(true);

      try {
        const response = await chatAPI.query(text);
        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: response.data.answer,
          sources: response.data.sources,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } catch (error: unknown) {
        const apiDetail = (
          error as { response?: { data?: { detail?: string } } }
        )?.response?.data?.detail;
        const fallback =
          error instanceof Error ? error.message : 'Unknown error';

        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: apiDetail ?? fallback,
            error: true,
            timestamp: new Date(),
          },
        ]);
        toast.error('Failed to get a response');
      } finally {
        setLoading(false);
      }
    },
    [loading]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return { messages, loading, submitMessage, clearMessages };
}
