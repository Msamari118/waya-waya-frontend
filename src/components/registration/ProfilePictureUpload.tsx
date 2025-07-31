import React, { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Camera, Upload, X } from 'lucide-react';

interface ProfilePictureUploadProps {
  profilePicture?: string;
  profilePicturePreview?: string;
  onUploadSuccess: (url: string) => void;
  onError: (error: string) => void;
}

export const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
  profilePicture,
  profilePicturePreview,
  onUploadSuccess,
  onError
}) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      onError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      onError('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      
      // Simulate upload (in real app, upload to server)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, use the preview URL as the uploaded URL
      onUploadSuccess(previewUrl);
    } catch (error: any) {
      onError(error.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    onUploadSuccess('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-center">
          <h4 className="font-semibold mb-4">Profile Picture</h4>
          
          <div className="flex justify-center mb-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profilePicturePreview} />
              <AvatarFallback>
                <Camera className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex justify-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? 'Uploading...' : 'Upload Photo'}
            </Button>
            
            {profilePicture && (
              <Button
                type="button"
                variant="outline"
                onClick={handleRemove}
                disabled={uploading}
              >
                <X className="h-4 w-4 mr-2" />
                Remove
              </Button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          <p className="text-xs text-muted-foreground mt-2">
            JPG, PNG or GIF. Max 5MB.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}; 