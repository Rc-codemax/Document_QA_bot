import { useEffect, useState } from 'react';
import { documentAPI } from '../services/api';

interface Document {
  id: number;
  filename: string;
  file_type: string;
  upload_date: string;
  num_chunks: number;
}

interface DocumentListProps {
  refresh: number;
}

export default function DocumentList({ refresh }: DocumentListProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = async () => {
    try {
      const response = await documentAPI.list();
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [refresh]);

  const handleDelete = async (docId: number) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      await documentAPI.delete(docId);
      fetchDocuments();
    } catch (error) {
      alert('Error deleting document');
    }
  };

  if (loading) return <p>Loading documents...</p>;

  return (
    <div className="document-list">
      <h3>Uploaded Documents ({documents.length})</h3>
      {documents.length === 0 ? (
        <p className="no-documents">No documents uploaded yet</p>
      ) : (
        <div>
          {documents.map((doc) => (
            <div key={doc.id} className="document-item">
              <div className="document-info">
                <p className="document-name">{doc.filename}</p>
                <p className="document-meta">
                  {doc.num_chunks} chunks • {new Date(doc.upload_date).toLocaleDateString()}
                </p>
              </div>
              <button onClick={() => handleDelete(doc.id)} className="delete-btn">
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}