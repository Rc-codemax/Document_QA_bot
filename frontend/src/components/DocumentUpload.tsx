import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, CheckCircle, XCircle, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { documentAPI } from '../services/api';

interface DocumentUploadProps {
  onUploadSuccess?: () => void;
}

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

export default function DocumentUpload({ onUploadSuccess }: DocumentUploadProps) {
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [lastFilename, setLastFilename] = useState('');

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setStatus('uploading');
      setLastFilename(file.name);

      try {
        await documentAPI.upload(file);
        setStatus('success');
        toast.success(`"${file.name}" uploaded successfully`);
        onUploadSuccess?.();
        setTimeout(() => setStatus('idle'), 3000);
      } catch (error: unknown) {
        const detail =
          (error as { response?: { data?: { detail?: string } } })
            ?.response?.data?.detail ?? 'Upload failed';
        setStatus('error');
        toast.error(detail);
        setTimeout(() => setStatus('idle'), 4000);
      }
    },
    [onUploadSuccess]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'text/markdown': ['.md'],
    },
    maxFiles: 1,
    disabled: status === 'uploading',
  });

  function DropzoneContent() {
    if (status === 'uploading') {
      return (
        <>
          <Loader size={28} className="dropzone__icon dropzone__icon--spin" />
          <p className="dropzone__text">Uploading {lastFilename}…</p>
        </>
      );
    }
    if (status === 'success') {
      return (
        <>
          <CheckCircle size={28} className="dropzone__icon dropzone__icon--success" />
          <p className="dropzone__text">Upload complete!</p>
        </>
      );
    }
    if (status === 'error') {
      return (
        <>
          <XCircle size={28} className="dropzone__icon dropzone__icon--error" />
          <p className="dropzone__text">Upload failed. Try again.</p>
        </>
      );
    }
    if (isDragActive) {
      return (
        <>
          <Upload size={28} className="dropzone__icon dropzone__icon--active" />
          <p className="dropzone__text">Drop to upload</p>
        </>
      );
    }
    return (
      <>
        <Upload size={28} className="dropzone__icon" />
        <p className="dropzone__text">Drag & drop or click to upload</p>
        <p className="dropzone__hint">PDF · DOCX · TXT · MD</p>
      </>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`dropzone dropzone--${status} ${isDragActive ? 'dropzone--drag-active' : ''}`}
    >
      <input {...getInputProps()} />
      <DropzoneContent />
    </div>
  );
}
