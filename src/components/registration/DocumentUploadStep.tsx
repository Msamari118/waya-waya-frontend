import React, { useRef } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { X, Plus, Upload, FileText, Shield, Award, Camera, Download } from 'lucide-react';

interface DocumentUploadStepProps {
  formData: any;
  errors: any;
  onFieldChange: (field: string, value: any) => void;
  onError: (field: string, error: string) => void;
}

export const DocumentUploadStep: React.FC<DocumentUploadStepProps> = ({
  formData,
  errors,
  onFieldChange,
  onError
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const documentTypes = [
    'ID Document',
    'Proof of Address',
    'Business Registration',
    'Tax Clearance Certificate',
    'Professional Certification',
    'Insurance Certificate',
    'Police Clearance',
    'Reference Letter',
    'Other'
  ];

  const handleFileUpload = (documentType: string, files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];

    if (file.size > maxSize) {
      onError(documentType, 'File size must be less than 5MB');
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      onError(documentType, 'Only JPEG, PNG, and PDF files are allowed');
      return;
    }

    // Create a preview URL
    const previewUrl = URL.createObjectURL(file);
    
    const documentData = {
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      previewUrl,
      uploadDate: new Date().toISOString()
    };

    const currentDocuments = formData.documents || {};
    currentDocuments[documentType] = documentData;
    onFieldChange('documents', currentDocuments);
    onError(documentType, ''); // Clear any previous errors
  };

  const removeDocument = (documentType: string) => {
    const currentDocuments = formData.documents || {};
    if (currentDocuments[documentType]?.previewUrl) {
      URL.revokeObjectURL(currentDocuments[documentType].previewUrl);
    }
    delete currentDocuments[documentType];
    onFieldChange('documents', currentDocuments);
  };

  const triggerFileUpload = (documentType: string) => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('data-document-type', documentType);
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const documentType = event.target.getAttribute('data-document-type');
    if (documentType) {
      handleFileUpload(documentType, event.target.files);
    }
    // Reset the input
    event.target.value = '';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getDocumentIcon = (documentType: string) => {
    switch (documentType) {
      case 'ID Document':
        return <FileText className="h-4 w-4" />;
      case 'Business Registration':
        return <Award className="h-4 w-4" />;
      case 'Insurance Certificate':
        return <Shield className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Document Upload</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Upload required documents to verify your identity and qualifications.
        </p>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.pdf"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Required Documents */}
      <div className="space-y-4">
        <Label className="text-base font-medium">Required Documents</Label>
        
        {/* ID Document */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-600" />
              <Label className="font-medium">ID Document *</Label>
            </div>
            <Badge variant="destructive" className="text-xs">Required</Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Upload a clear copy of your ID document (passport, driver's license, or national ID)
          </p>
          
          {formData.documents?.['ID Document'] ? (
            <div className="flex items-center justify-between p-3 bg-green-50 rounded border">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium">{formData.documents['ID Document'].name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(formData.documents['ID Document'].size)}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeDocument('ID Document')}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={() => triggerFileUpload('ID Document')}
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload ID Document
            </Button>
          )}
          {errors['ID Document'] && (
            <p className="text-sm text-red-500 mt-1">{errors['ID Document']}</p>
          )}
        </div>

        {/* Proof of Address */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-600" />
              <Label className="font-medium">Proof of Address *</Label>
            </div>
            <Badge variant="destructive" className="text-xs">Required</Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Upload a recent utility bill or bank statement (not older than 3 months)
          </p>
          
          {formData.documents?.['Proof of Address'] ? (
            <div className="flex items-center justify-between p-3 bg-green-50 rounded border">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium">{formData.documents['Proof of Address'].name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(formData.documents['Proof of Address'].size)}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeDocument('Proof of Address')}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={() => triggerFileUpload('Proof of Address')}
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Proof of Address
            </Button>
          )}
          {errors['Proof of Address'] && (
            <p className="text-sm text-red-500 mt-1">{errors['Proof of Address']}</p>
          )}
        </div>
      </div>

      {/* Optional Documents */}
      <div className="space-y-4">
        <Label className="text-base font-medium">Optional Documents</Label>
        
        {/* Professional Certifications */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-blue-600" />
              <Label className="font-medium">Professional Certifications</Label>
            </div>
            <Badge variant="secondary" className="text-xs">Optional</Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Upload relevant professional certifications or qualifications
          </p>
          
          {formData.documents?.['Professional Certification'] ? (
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded border">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">{formData.documents['Professional Certification'].name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(formData.documents['Professional Certification'].size)}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeDocument('Professional Certification')}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={() => triggerFileUpload('Professional Certification')}
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Certification
            </Button>
          )}
        </div>

        {/* Insurance Certificate */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-600" />
              <Label className="font-medium">Insurance Certificate</Label>
            </div>
            <Badge variant="secondary" className="text-xs">Optional</Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Upload your professional liability insurance certificate
          </p>
          
          {formData.documents?.['Insurance Certificate'] ? (
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded border">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">{formData.documents['Insurance Certificate'].name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(formData.documents['Insurance Certificate'].size)}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeDocument('Insurance Certificate')}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={() => triggerFileUpload('Insurance Certificate')}
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Insurance Certificate
            </Button>
          )}
        </div>
      </div>

      {/* Additional Information */}
      <div className="space-y-2">
        <Label htmlFor="additionalInfo">Additional Information</Label>
        <Textarea
          id="additionalInfo"
          placeholder="Any additional information about your documents or qualifications..."
          value={formData.additionalInfo || ''}
          onChange={(e) => onFieldChange('additionalInfo', e.target.value)}
          rows={3}
        />
        <p className="text-xs text-muted-foreground">
          Optional: Add any additional context about your documents or qualifications
        </p>
      </div>

      {/* Document Guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Document Guidelines</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• All documents must be clear and legible</li>
          <li>• Maximum file size: 5MB per document</li>
          <li>• Accepted formats: JPEG, PNG, PDF</li>
          <li>• Documents must be current and valid</li>
          <li>• Proof of address must be less than 3 months old</li>
        </ul>
      </div>
    </div>
  );
}; 