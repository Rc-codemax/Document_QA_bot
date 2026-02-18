import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { documentAPI } from '../services/api';
import type { Document } from '../types';

interface UseDocumentsReturn {
  documents: Document[];
  loading: boolean;
  deleteDocument: (id: number) => Promise<void>;
  refresh: () => void;
}

export function useDocuments(refreshSignal: number): UseDocumentsReturn {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await documentAPI.list();
      setDocuments(response.data);
    } catch {
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [refreshSignal, fetchDocuments]);

  const deleteDocument = useCallback(
    async (id: number) => {
      const previous = documents;
      setDocuments((prev) => prev.filter((d) => d.id !== id));
      try {
        await documentAPI.delete(id);
        toast.success('Document deleted');
      } catch {
        setDocuments(previous);
        toast.error('Failed to delete document');
      }
    },
    [documents]
  );

  return { documents, loading, deleteDocument, refresh: fetchDocuments };
}
