import { useState } from 'react';
import { FileText, Trash2, File } from 'lucide-react';
import { useDocuments } from '../hooks/useDocuments';
import type { Document, FileType } from '../types';

// ---- helpers -----------------------------------------------------------
const FILE_TYPE_COLORS: Record<FileType, string> = {
  pdf:  'badge--pdf',
  docx: 'badge--docx',
  txt:  'badge--txt',
  md:   'badge--md',
};

function getFileIcon(fileType: string) {
  const textTypes = ['txt', 'md', 'docx'];
  return textTypes.includes(fileType.toLowerCase()) ? FileText : File;
}

// ---- sub-component: skeleton row ---------------------------------------
function SkeletonRow() {
  return (
    <div className="document-item document-item--skeleton" aria-hidden="true">
      <div className="skeleton skeleton--icon" />
      <div className="document-info">
        <div className="skeleton skeleton--text skeleton--text-lg" />
        <div className="skeleton skeleton--text skeleton--text-sm" />
      </div>
    </div>
  );
}

// ---- sub-component: document row ---------------------------------------
interface DocumentRowProps {
  doc: Document;
  onDelete: (id: number) => void;
}

function DocumentRow({ doc, onDelete }: DocumentRowProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const Icon = getFileIcon(doc.file_type);
  const normalizedType = doc.file_type.toLowerCase().replace('.', '') as FileType;
  const badgeClass = FILE_TYPE_COLORS[normalizedType] ?? 'badge--default';

  const uploadDate = new Date(doc.upload_date).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="document-item">
      <Icon size={18} className="document-item__icon" strokeWidth={1.5} />
      <div className="document-info">
        <p className="document-name" title={doc.filename}>
          {doc.filename}
        </p>
        <p className="document-meta">
          <span className={`file-badge ${badgeClass}`}>
            {doc.file_type.toUpperCase().replace('.', '')}
          </span>
          {doc.num_chunks} chunks · {uploadDate}
        </p>
      </div>
      <div className="document-item__actions">
        {confirmOpen ? (
          <>
            <button
              className="btn-danger"
              onClick={() => { onDelete(doc.id); setConfirmOpen(false); }}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
            >
              Confirm
            </button>
            <button
              className="btn-ghost btn-ghost--sm"
              onClick={() => setConfirmOpen(false)}
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            className="btn-icon"
            onClick={() => setConfirmOpen(true)}
            aria-label={`Delete ${doc.filename}`}
            title="Delete document"
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>
    </div>
  );
}

// ---- main component ----------------------------------------------------
interface DocumentListProps {
  refresh: number;
}

export default function DocumentList({ refresh }: DocumentListProps) {
  const { documents, loading, deleteDocument } = useDocuments(refresh);

  return (
    <div>
      <h2 className="document-list__heading">
        Documents
        {!loading && (
          <span className="document-count">{documents.length}</span>
        )}
      </h2>

      {loading ? (
        <div aria-label="Loading documents">
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
        </div>
      ) : documents.length === 0 ? (
        <div className="empty-state empty-state--sm">
          <FileText size={28} strokeWidth={1.5} className="empty-state__icon" />
          <p className="empty-state__hint">No documents uploaded yet</p>
        </div>
      ) : (
        <div className="document-items">
          {documents.map((doc) => (
            <DocumentRow key={doc.id} doc={doc} onDelete={deleteDocument} />
          ))}
        </div>
      )}
    </div>
  );
}
