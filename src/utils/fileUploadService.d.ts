export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadedFile {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: Date;
}

declare const fileUploadService: {
  uploadFile: (file: File, onProgress?: (progress: UploadProgress) => void) => Promise<UploadedFile>;
  uploadMultipleFiles: (files: File[], onProgress?: (progress: UploadProgress) => void) => Promise<UploadedFile[]>;
  deleteFile: (fileId: string) => Promise<void>;
  getFileUrl: (fileId: string) => Promise<string>;
  validateFile: (file: File) => { valid: boolean; error?: string };
};

export default fileUploadService; 