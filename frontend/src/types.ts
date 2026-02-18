export interface Source {
  source_number: number;
  filename: string;
  chunk_index: number;
  content_preview: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Source[];
  error?: boolean;
  timestamp: Date;
}

export interface Document {
  id: number;
  filename: string;
  file_type: string;
  upload_date: string;
  num_chunks: number;
}

export type FileType = 'pdf' | 'docx' | 'txt' | 'md';
