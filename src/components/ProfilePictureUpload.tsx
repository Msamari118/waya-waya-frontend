import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Upload, X, User } from 'lucide-react';

interface ProfilePictureUploadProps {
  onFileSelect: (file: File | null) => void;
  currentPicture?: string;
  className?: string;
}

export const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({ 
  onFileSelect, 
  currentPicture, 
  className = '' 
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentPicture || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      setSelectedFile(file);
      onFileSelect(file);

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(currentPicture || null);
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4">
          <h3 className="text-lg font-semibold">Profile Picture</h3>
          
          {/* Preview Area */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200 flex items-center justify-center bg-gray-50">
              {previewUrl ? (
                <img 
                  src={previewUrl} 
                  alt="Profile preview" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-16 h-16 text-gray-400" />
              )}
            </div>
            
            {/* Remove button */}
            {selectedFile && (
              <button
                onClick={handleRemoveFile}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Upload Button */}
          <div className="flex flex-col items-center space-y-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClickUpload}
              className="flex items-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>{selectedFile ? 'Change Picture' : 'Upload Picture'}</span>
            </Button>
            
            <p className="text-xs text-gray-500 text-center">
              JPG, PNG or GIF • Max 5MB
            </p>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfilePictureUpload; 