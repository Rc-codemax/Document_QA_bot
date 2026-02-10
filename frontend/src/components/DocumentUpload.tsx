import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { documentAPI } from '../services/api';

interface DocumentUploadProps {
  onUploadSuccess?: () => void;
}

export default function DocumentUpload({ onUploadSuccess }: DocumentUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploading(true);
    setMessage('');

    try {
      const response = await documentAPI.upload(file);
      setMessage(`✅ ${response.data.message}`);
      if (onUploadSuccess) onUploadSuccess();
    } catch (error: any) {
      setMessage(`❌ Error: ${error.response?.data?.detail || error.message}`);
    } finally {
      setUploading(false);
    }
  }, [onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'text/markdown': ['.md']
    },
    maxFiles: 1
  });

  return (
    <div className="upload-container">
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? 'active' : ''} ${uploading ? 'uploading' : ''}`}
      >
        <input {...getInputProps()} disabled={uploading} />
        {uploading ? (
          <p>Uploading...</p>
        ) : isDragActive ? (
          <p>Drop the file here...</p>
        ) : (
          <div>
            <p>Drag & drop a document here, or click to select</p>
            <p className="hint">Supported: PDF, DOCX, TXT, MD</p>
          </div>
        )}
      </div>
      {message && (
        <p className={`upload-message ${message.startsWith('✅') ? 'success' : 'error'}`}>
          {message}
        </p>
      )}
    </div>
  );
}