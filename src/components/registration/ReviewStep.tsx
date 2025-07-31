import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { CheckCircle, AlertCircle, User, MapPin, CreditCard, FileText, Shield } from 'lucide-react';
import { Label } from '../ui/label';

interface ReviewStepProps {
  formData: any;
  errors: any;
  onFieldChange: (field: string, value: any) => void;
  onError: (field: string, error: string) => void;
  onEditStep: (step: number) => void;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
  formData,
  errors,
  onFieldChange,
  onError,
  onEditStep
}) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStepCompletionStatus = (step: number) => {
    switch (step) {
      case 1: // Personal Info
        return formData.firstName && formData.lastName && formData.email && formData.phone;
      case 2: // Service Info
        return formData.primaryService && formData.serviceDescription && formData.experienceYears;
      case 3: // Location
        return formData.streetAddress && formData.province && formData.city && formData.postalCode;
      case 4: // Payment
        return formData.hourlyRate && formData.bankName && formData.accountNumber;
      case 5: // Documents
        return formData.documents?.['ID Document'] && formData.documents?.['Proof of Address'];
      default:
        return false;
    }
  };

  const getStepIcon = (step: number) => {
    const isComplete = getStepCompletionStatus(step);
    return isComplete ? (
      <CheckCircle className="h-5 w-5 text-green-600" />
    ) : (
      <AlertCircle className="h-5 w-5 text-yellow-600" />
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Review Your Information</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Please review all the information you've provided before submitting your application.
        </p>
      </div>

      {/* Step Summary */}
      <div className="space-y-4">
        <Label className="text-base font-medium">Registration Progress</Label>
        
        {/* Step 1: Personal Information */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStepIcon(1)}
                <CardTitle className="text-base">Personal Information</CardTitle>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEditStep(1)}
              >
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {getStepCompletionStatus(1) ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Name</p>
                  <p className="text-muted-foreground">{formData.firstName} {formData.lastName}</p>
                </div>
                <div>
                  <p className="font-medium">Contact</p>
                  <p className="text-muted-foreground">{formData.email}</p>
                  <p className="text-muted-foreground">{formData.phone}</p>
                </div>
              </div>
            ) : (
              <p className="text-yellow-600 text-sm">Incomplete - Please fill in all required fields</p>
            )}
          </CardContent>
        </Card>

        {/* Step 2: Service Information */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStepIcon(2)}
                <CardTitle className="text-base">Service Information</CardTitle>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEditStep(2)}
              >
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {getStepCompletionStatus(2) ? (
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium">Primary Service</p>
                  <p className="text-muted-foreground">{formData.primaryService}</p>
                </div>
                <div>
                  <p className="font-medium">Experience</p>
                  <p className="text-muted-foreground">{formData.experienceYears} years</p>
                </div>
                {formData.skills && formData.skills.length > 0 && (
                  <div>
                    <p className="font-medium">Skills</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {formData.skills.map((skill: string) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-yellow-600 text-sm">Incomplete - Please fill in all required fields</p>
            )}
          </CardContent>
        </Card>

        {/* Step 3: Location */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStepIcon(3)}
                <CardTitle className="text-base">Location & Service Areas</CardTitle>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEditStep(3)}
              >
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {getStepCompletionStatus(3) ? (
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-muted-foreground">
                    {formData.streetAddress}, {formData.suburb}
                  </p>
                  <p className="text-muted-foreground">
                    {formData.city}, {formData.province} {formData.postalCode}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Service Radius</p>
                  <p className="text-muted-foreground">{formData.serviceRadius} km</p>
                </div>
                {formData.serviceAreas && formData.serviceAreas.length > 0 && (
                  <div>
                    <p className="font-medium">Service Areas</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {formData.serviceAreas.map((area: string) => (
                        <Badge key={area} variant="secondary" className="text-xs">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-yellow-600 text-sm">Incomplete - Please fill in all required fields</p>
            )}
          </CardContent>
        </Card>

        {/* Step 4: Payment */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStepIcon(4)}
                <CardTitle className="text-base">Payment & Pricing</CardTitle>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEditStep(4)}
              >
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {getStepCompletionStatus(4) ? (
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium">Hourly Rate</p>
                  <p className="text-muted-foreground">R{formData.hourlyRate}/hour</p>
                </div>
                <div>
                  <p className="font-medium">Bank Details</p>
                  <p className="text-muted-foreground">{formData.bankName}</p>
                  <p className="text-muted-foreground">Account: {formData.accountNumber}</p>
                </div>
                {formData.paymentMethods && formData.paymentMethods.length > 0 && (
                  <div>
                    <p className="font-medium">Payment Methods</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {formData.paymentMethods.map((method: string) => (
                        <Badge key={method} variant="secondary" className="text-xs">
                          {method}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-yellow-600 text-sm">Incomplete - Please fill in all required fields</p>
            )}
          </CardContent>
        </Card>

        {/* Step 5: Documents */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStepIcon(5)}
                <CardTitle className="text-base">Documents</CardTitle>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEditStep(5)}
              >
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {getStepCompletionStatus(5) ? (
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium">Required Documents</p>
                  <div className="space-y-1 mt-1">
                    {formData.documents?.['ID Document'] && (
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-green-600" />
                        <span className="text-muted-foreground">
                          ID Document ({formatFileSize(formData.documents['ID Document'].size)})
                        </span>
                      </div>
                    )}
                    {formData.documents?.['Proof of Address'] && (
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-green-600" />
                        <span className="text-muted-foreground">
                          Proof of Address ({formatFileSize(formData.documents['Proof of Address'].size)})
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                {formData.documents?.['Professional Certification'] && (
                  <div>
                    <p className="font-medium">Optional Documents</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Shield className="h-4 w-4 text-blue-600" />
                      <span className="text-muted-foreground">
                        Professional Certification ({formatFileSize(formData.documents['Professional Certification'].size)})
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-yellow-600 text-sm">Incomplete - Please upload required documents</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Terms and Conditions */}
      <div className="space-y-4">
        <div className="flex items-start space-x-2">
          <input
            type="checkbox"
            id="termsAccepted"
            checked={formData.termsAccepted || false}
            onChange={(e) => onFieldChange('termsAccepted', e.target.checked)}
            className="mt-1 rounded"
          />
          <div className="text-sm">
            <Label htmlFor="termsAccepted" className="font-medium">
              I agree to the Terms and Conditions
            </Label>
            <p className="text-muted-foreground mt-1">
              By checking this box, you agree to our terms of service, privacy policy, and confirm that all information provided is accurate and complete.
            </p>
          </div>
        </div>
        {errors.termsAccepted && (
          <p className="text-sm text-red-500">{errors.termsAccepted}</p>
        )}
      </div>

      {/* Privacy Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Privacy Notice</h4>
        <p className="text-sm text-blue-800">
          Your personal information will be used to verify your identity and qualifications. 
          We take data protection seriously and will only use your information for the purposes 
          stated in our privacy policy. You can request deletion of your data at any time.
        </p>
      </div>

      {/* Application Fee Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-medium text-yellow-900 mb-2">Application Fee</h4>
        <p className="text-sm text-yellow-800">
          A one-time application fee of R150 will be charged upon successful submission. 
          This fee covers background verification and account setup costs.
        </p>
      </div>
    </div>
  );
}; 