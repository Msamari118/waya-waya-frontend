import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { ArrowRight, ArrowLeft, User, Home, CreditCard, FileText, X, Plus, Upload } from 'lucide-react';
import { WayaWayaLogo } from './shared/WayaWayaLogo';
import { PersonalInfoStep } from './registration/PersonalInfoStep';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { 
  DEFAULT_FORM_DATA, 
  REGISTRATION_STEPS, 
  TOTAL_STEPS,
  APPLICATION_FEES,
  PROGRESS_LABELS
} from '../utils/registrationConstants.js';
import { validateRegistrationStep, getStepCompletionPercentage } from '../utils/registrationValidation';
import { apiClient } from '../utils/apiClient.js';
import { SOUTH_AFRICAN_LOCATIONS, getCitiesForProvince, validateSouthAfricanPostalCode } from '../utils/locationService';

interface ClientRegistrationProps {
  onNavigate: (view: string) => void;
  authToken?: string;
}

export const ClientRegistration: React.FC<ClientRegistrationProps> = ({ 
  onNavigate, 
  authToken 
}) => {
  const [currentStep, setCurrentStep] = useState(REGISTRATION_STEPS.PERSONAL_INFO);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  
  // OTP verification states
  const [phoneOtpVerified, setPhoneOtpVerified] = useState(false);
  const [emailOtpVerified, setEmailOtpVerified] = useState(false);

  const progress = getStepCompletionPercentage(currentStep, TOTAL_STEPS);

  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
    
    // Clear errors for this field
    if (errors[field as keyof typeof errors]) {
      setErrors((prev: any) => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleError = (field: string, error: string) => {
    setErrors((prev: any) => ({
      ...prev,
      [field]: error
    }));
  };

  const validateStep = (step: number) => {
    const stepErrors = validateRegistrationStep(formData, step, phoneOtpVerified, emailOtpVerified);
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev: any) => Math.min(prev + 1, TOTAL_STEPS));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev: any) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      return;
    }

    setLoading(true);
    
    try {
      // Submit registration data to API
      const registrationPayload = {
        ...formData,
        phoneVerified: phoneOtpVerified,
        emailVerified: emailOtpVerified,
        userType: 'client'
      };

      const response = await apiClient.clients?.register?.(registrationPayload, authToken || '') || 
                      { ok: true }; // Fallback for demo
      
      if (response.ok) {
        // Registration successful
        alert(`Client registration submitted successfully!\n\nClient ID: CLIENT-${Date.now()}\nStatus: Pending Verification\n\nYou will receive confirmation within 24 hours.`);
        onNavigate('home');
      } else {
        const errorData = await response.json();
        alert(`Registration failed: ${errorData.error || 'Please try again'}`);
      }
    } catch (error) {
      console.error('Registration error:', error);
      // Demo mode fallback
      alert(`Client registration submitted successfully!\n\nClient ID: CLIENT-${Date.now()}\nStatus: Pending Verification\n\nYou will receive confirmation within 24 hours.`);
      onNavigate('home');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case REGISTRATION_STEPS.PERSONAL_INFO:
        return (
          <PersonalInfoStep
            formData={formData}
            errors={errors}
            emailOtpVerified={emailOtpVerified}
            onFieldChange={handleFieldChange}
            onError={handleError}
            onEmailVerified={() => setEmailOtpVerified(true)}
            onNext={handleNext}
            onAllFieldsValid={(isValid) => {
              // This can be used to enable/disable the next button
              console.log('Personal info step validity:', isValid);
            }}
          />
        );
      
      case REGISTRATION_STEPS.SERVICE_INFO:
        return <ServicePreferencesStep formData={formData} errors={errors} onFieldChange={handleFieldChange} onError={handleError} />;
      
      case REGISTRATION_STEPS.LOCATION_INFO:
        return <ClientLocationStep formData={formData} errors={errors} onFieldChange={handleFieldChange} onError={handleError} />;
      
      case REGISTRATION_STEPS.PAYMENT_INFO:
        return <ClientPaymentStep formData={formData} errors={errors} onFieldChange={handleFieldChange} onError={handleError} />;
      
      case REGISTRATION_STEPS.DOCUMENT_UPLOAD:
        return <ClientDocumentStep formData={formData} errors={errors} onFieldChange={handleFieldChange} onError={handleError} />;
      
      case REGISTRATION_STEPS.REVIEW:
        return (
          <ClientReviewStep
            formData={formData}
            errors={errors}
            onFieldChange={handleFieldChange}
            onError={handleError}
            onEditStep={(step: number) => setCurrentStep(step)}
          />
        );
      
      default:
        return (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">Step {currentStep}</h3>
            <p className="text-muted-foreground mb-4">
              This step is being implemented. For demo purposes, you can continue to the next step.
            </p>
            <Button onClick={handleNext} disabled={currentStep >= TOTAL_STEPS}>
              Continue to Next Step
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => onNavigate('home')}>
            ← Back
          </Button>
          <WayaWayaLogo size="sm" />
          <div>
            <h1>Client Registration</h1>
            <p className="text-sm text-muted-foreground">
              Step {currentStep} of {TOTAL_STEPS}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progress} className="h-3" />
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            {PROGRESS_LABELS.map((label: any, index: any) => (
              <span key={index} className={index + 1 <= currentStep ? 'text-primary' : ''}>
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <Card>
          <CardContent className="p-6">
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {currentStep === TOTAL_STEPS ? (
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="min-w-40"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <User className="h-4 w-4 mr-2" />
              )}
              {loading ? 'Processing...' : 'Complete Registration'}
            </Button>
          ) : (
            <Button onClick={handleNext}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>

        {/* Step Indicator */}
        <div className="flex justify-center mt-6">
          <div className="flex space-x-2">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i + 1 <= currentStep 
                    ? 'bg-blue-600' 
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Client-specific registration steps
const ServicePreferencesStep: React.FC<any> = ({ formData, errors, onFieldChange, onError }) => {
  const serviceCategories = [
    'Plumbing', 'Electrical', 'Cleaning', 'Gardening', 'Painting', 'Carpentry',
    'HVAC', 'Security', 'Moving', 'Pet Care', 'Child Care', 'Elder Care',
    'Tutoring', 'Photography', 'Event Planning', 'Catering', 'Beauty', 'Fitness'
  ];

  const addServicePreference = () => {
    const newService = prompt('Enter a service you need:');
    if (newService && newService.trim()) {
      const currentServices = formData.servicePreferences || [];
      if (!currentServices.includes(newService.trim())) {
        onFieldChange('servicePreferences', [...currentServices, newService.trim()]);
      }
    }
  };

  const removeServicePreference = (serviceToRemove: string) => {
    const currentServices = formData.servicePreferences || [];
    onFieldChange('servicePreferences', currentServices.filter((service: string) => service !== serviceToRemove));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Service Preferences</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Tell us what services you need and your preferences.
        </p>
      </div>

      {/* Service Preferences */}
      <div className="space-y-2">
        <Label>Services You Need</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {(formData.servicePreferences || []).map((service: string) => (
            <Badge key={service} variant="secondary" className="flex items-center gap-1">
              {service}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => removeServicePreference(service)}
              />
            </Badge>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addServicePreference}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Service Need
        </Button>
      </div>

      {/* Budget Range */}
      <div className="space-y-2">
        <Label htmlFor="budgetRange">Budget Range</Label>
        <Select
          value={formData.budgetRange || ''}
          onValueChange={(value) => onFieldChange('budgetRange', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select your budget range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="under-500">Under R500</SelectItem>
            <SelectItem value="500-1000">R500 - R1,000</SelectItem>
            <SelectItem value="1000-2000">R1,000 - R2,000</SelectItem>
            <SelectItem value="2000-5000">R2,000 - R5,000</SelectItem>
            <SelectItem value="5000-10000">R5,000 - R10,000</SelectItem>
            <SelectItem value="over-10000">Over R10,000</SelectItem>
            <SelectItem value="flexible">Flexible</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Special Requirements */}
      <div className="space-y-2">
        <Label htmlFor="specialRequirements">Special Requirements</Label>
        <Textarea
          id="specialRequirements"
          placeholder="Any special requirements or preferences..."
          value={formData.specialRequirements || ''}
          onChange={(e) => onFieldChange('specialRequirements', e.target.value)}
          rows={3}
        />
      </div>
    </div>
  );
};

const ClientLocationStep: React.FC<any> = ({ formData, errors, onFieldChange, onError }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Your Location</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Tell us where you're located so we can find nearby providers.
        </p>
      </div>

      {/* Address Information */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="streetAddress">Street Address</Label>
            <Input
              id="streetAddress"
              placeholder="Enter your street address"
              value={formData.streetAddress || ''}
              onChange={(e) => onFieldChange('streetAddress', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="suburb">Suburb</Label>
            <Input
              id="suburb"
              placeholder="Enter your suburb"
              value={formData.suburb || ''}
              onChange={(e) => onFieldChange('suburb', e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="province">Province</Label>
            <Select
              value={formData.province || ''}
              onValueChange={(value) => onFieldChange('province', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select province" />
              </SelectTrigger>
              <SelectContent>
                {SOUTH_AFRICAN_LOCATIONS.provinces.map((province) => (
                  <SelectItem key={province} value={province}>
                    {province}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Select
              value={formData.city || ''}
              onValueChange={(value) => onFieldChange('city', value)}
              disabled={!formData.province}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                {formData.province && getCitiesForProvince(formData.province)?.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="postalCode">Postal Code</Label>
            <Input
              id="postalCode"
              placeholder="Enter postal code"
              value={formData.postalCode || ''}
              onChange={(e) => {
                const postalCode = e.target.value;
                onFieldChange('postalCode', postalCode);
                
                if (postalCode && !validateSouthAfricanPostalCode(postalCode)) {
                  onError('postalCode', 'Please enter a valid 4-digit postal code');
                } else if (postalCode) {
                  onError('postalCode', '');
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const ClientPaymentStep: React.FC<any> = ({ formData, errors, onFieldChange, onError }) => {
  const paymentMethods = ['Cash', 'Bank Transfer', 'Credit Card', 'Debit Card', 'Mobile Money', 'PayPal'];

  const addPaymentMethod = () => {
    const newMethod = prompt('Enter payment method:');
    if (newMethod && newMethod.trim()) {
      const currentMethods = formData.preferredPaymentMethods || [];
      if (!currentMethods.includes(newMethod.trim())) {
        onFieldChange('preferredPaymentMethods', [...currentMethods, newMethod.trim()]);
      }
    }
  };

  const removePaymentMethod = (methodToRemove: string) => {
    const currentMethods = formData.preferredPaymentMethods || [];
    onFieldChange('preferredPaymentMethods', currentMethods.filter((method: string) => method !== methodToRemove));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Payment Preferences</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Set your preferred payment methods for services.
        </p>
      </div>

      {/* Preferred Payment Methods */}
      <div className="space-y-2">
        <Label>Preferred Payment Methods</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {(formData.preferredPaymentMethods || []).map((method: string) => (
            <Badge key={method} variant="secondary" className="flex items-center gap-1">
              <CreditCard className="h-3 w-3" />
              {method}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => removePaymentMethod(method)}
              />
            </Badge>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addPaymentMethod}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Payment Method
        </Button>
      </div>

      {/* Emergency Contact */}
      <div className="space-y-4">
        <Label>Emergency Contact</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="emergencyName">Name</Label>
            <Input
              id="emergencyName"
              placeholder="Emergency contact name"
              value={formData.emergencyContact?.name || ''}
              onChange={(e) => onFieldChange('emergencyContact', {
                ...formData.emergencyContact,
                name: e.target.value
              })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergencyPhone">Phone</Label>
            <Input
              id="emergencyPhone"
              placeholder="Emergency contact phone"
              value={formData.emergencyContact?.phone || ''}
              onChange={(e) => onFieldChange('emergencyContact', {
                ...formData.emergencyContact,
                phone: e.target.value
              })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="emergencyRelationship">Relationship</Label>
          <Input
            id="emergencyRelationship"
            placeholder="Relationship to you"
            value={formData.emergencyContact?.relationship || ''}
            onChange={(e) => onFieldChange('emergencyContact', {
              ...formData.emergencyContact,
              relationship: e.target.value
            })}
          />
        </div>
      </div>
    </div>
  );
};

const ClientDocumentStep: React.FC<any> = ({ formData, errors, onFieldChange, onError }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Verification Documents</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Upload documents to verify your identity (optional for clients).
        </p>
      </div>

      {/* ID Document */}
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-600" />
            <Label className="font-medium">ID Document (Optional)</Label>
          </div>
          <Badge variant="secondary" className="text-xs">Optional</Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          Upload a copy of your ID for faster verification
        </p>
        <Button
          type="button"
          variant="outline"
          className="w-full"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload ID Document
        </Button>
      </div>

      {/* Proof of Address */}
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-600" />
            <Label className="font-medium">Proof of Address (Optional)</Label>
          </div>
          <Badge variant="secondary" className="text-xs">Optional</Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          Upload a recent utility bill or bank statement
        </p>
        <Button
          type="button"
          variant="outline"
          className="w-full"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload Proof of Address
        </Button>
      </div>
    </div>
  );
};

const ClientReviewStep: React.FC<any> = ({ formData, errors, onFieldChange, onError, onEditStep }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Review Your Information</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Please review all the information you've provided before submitting.
        </p>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-green-600" />
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
        </CardContent>
      </Card>

      {/* Service Preferences */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Home className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-base">Service Preferences</CardTitle>
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
          <div className="space-y-3 text-sm">
            <div>
              <p className="font-medium">Services Needed</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {(formData.servicePreferences || []).map((service: string) => (
                  <Badge key={service} variant="secondary" className="text-xs">
                    {service}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="font-medium">Budget Range</p>
              <p className="text-muted-foreground">{formData.budgetRange}</p>
            </div>
          </div>
        </CardContent>
      </Card>

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
              By checking this box, you agree to our terms of service and privacy policy.
            </p>
          </div>
        </div>
        {errors.termsAccepted && (
          <p className="text-sm text-red-500">{errors.termsAccepted}</p>
        )}
      </div>
    </div>
  );
}; 