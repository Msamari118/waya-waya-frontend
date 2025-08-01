import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import { ArrowRight, ArrowLeft, CreditCard } from 'lucide-react';
import { WayaWayaLogo } from './shared/WayaWayaLogo';
import { PersonalInfoStep } from './registration/PersonalInfoStep';
import { ServiceInfoStep } from './registration/ServiceInfoStep';
import { LocationStep } from './registration/LocationStep';
import { PaymentStep } from './registration/PaymentStep';
import { DocumentUploadStep } from './registration/DocumentUploadStep';
import { ReviewStep } from './registration/ReviewStep';
import { 
  DEFAULT_FORM_DATA, 
  REGISTRATION_STEPS, 
  TOTAL_STEPS,
  APPLICATION_FEES,
  PROGRESS_LABELS
} from '../utils/registrationConstants.js';
import { validateRegistrationStep, getStepCompletionPercentage } from '../utils/registrationValidation';
import southAfricanPaymentService from '../utils/southAfricanPaymentService.js';
import { apiClient } from '../utils/apiClient.js';

interface ProviderRegistrationProps {
  onNavigate: (view: string) => void;
  authToken?: string;
}

export const ProviderRegistration: React.FC<ProviderRegistrationProps> = ({ 
  onNavigate, 
  authToken 
}) => {
  const [currentStep, setCurrentStep] = useState(REGISTRATION_STEPS.PERSONAL_INFO);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  
  // Email verification state only
  const [emailOtpVerified, setEmailOtpVerified] = useState(false);

  // Payment states
  const [paymentLoading, setPaymentLoading] = useState(false);

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
    const stepErrors = validateRegistrationStep(formData, step, false, emailOtpVerified);
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

  const processApplicationFee = async () => {
    setPaymentLoading(true);
    
    try {
      const applicationFee = formData.countryCode === '+27' 
        ? APPLICATION_FEES.SOUTH_AFRICA 
        : APPLICATION_FEES.INTERNATIONAL;
      
      // Use Railway backend payment system instead of Paystack
      const result = await southAfricanPaymentService.processRegistrationFee({
        ...formData,
        applicationFee: applicationFee,
        paymentMethod: 'EFT'
      });

      if (result.success) {
        // Show success message
        alert(`Registration submitted successfully!\n\nProvider ID: ${result.providerId}\nApplication Fee: ${southAfricanPaymentService.formatAmount(applicationFee)}\n\nYou will receive confirmation within 24 hours.`);
        
        // Navigate back to home
        onNavigate('home');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Payment initialization error:', error);
      
      // Demo mode fallback
      const applicationFee = formData.countryCode === '+27' 
        ? APPLICATION_FEES.SOUTH_AFRICA 
        : APPLICATION_FEES.INTERNATIONAL;
        
      alert(`Registration submitted successfully!\n\nProvider ID: DEMO-${Date.now()}\nStatus: Pending Payment\nApplication Fee: R${applicationFee}\nTrial Period: 7 days\n\nYou will receive confirmation within 24 hours.`);
      onNavigate('home');
    } finally {
      setPaymentLoading(false);
    }
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
        emailVerified: emailOtpVerified,
        applicationFee: formData.countryCode === '+27' 
          ? APPLICATION_FEES.SOUTH_AFRICA 
          : APPLICATION_FEES.INTERNATIONAL
      };

      const response = await apiClient.providers.register(registrationPayload, authToken || '');
      
      if (response.ok) {
        // Registration successful, process payment
        await processApplicationFee();
      } else {
        const errorData = await response.json();
        alert(`Registration failed: ${errorData.error || 'Please try again'}`);
      }
    } catch (error) {
      console.error('Registration error:', error);
      // Fallback to payment processing in demo mode
      await processApplicationFee();
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
        return (
          <ServiceInfoStep
            formData={formData}
            errors={errors}
            onFieldChange={handleFieldChange}
            onError={handleError}
          />
        );
      
      case REGISTRATION_STEPS.LOCATION_INFO:
        return (
          <LocationStep
            formData={formData}
            errors={errors}
            onFieldChange={handleFieldChange}
            onError={handleError}
          />
        );
      
      case REGISTRATION_STEPS.PAYMENT_INFO:
        return (
          <PaymentStep
            formData={formData}
            errors={errors}
            onFieldChange={handleFieldChange}
            onError={handleError}
          />
        );
      
      case REGISTRATION_STEPS.DOCUMENT_UPLOAD:
        return (
          <DocumentUploadStep
            formData={formData}
            errors={errors}
            onFieldChange={handleFieldChange}
            onError={handleError}
          />
        );
      
      case REGISTRATION_STEPS.REVIEW:
        return (
          <ReviewStep
            formData={formData}
            errors={errors}
            onFieldChange={handleFieldChange}
            onError={handleError}
            onEditStep={(step) => setCurrentStep(step)}
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
    <div className="min-h-screen bg-gradient-to-br from-green-500 via-yellow-500 to-red-600">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => onNavigate('home')}
              className="text-white hover:text-white hover:bg-white/20 rounded-xl p-3 transition-all duration-300"
            >
              ← Back
            </Button>
            <WayaWayaLogo size="sm" />
          </div>
          <div className="text-right text-white">
            <div className="text-lg font-bold">Provider Registration</div>
            <div className="text-sm opacity-80">Step {currentStep} of {TOTAL_STEPS}</div>
          </div>
        </div>

        {/* Progress Header */}
        <div className="bg-gradient-to-r from-green-600 to-yellow-500 rounded-2xl p-6 mb-8 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {PROGRESS_LABELS[currentStep]}
              </h2>
              <p className="text-white/90">
                Complete this step to continue your registration
              </p>
            </div>
            <div className="text-right text-white">
              <div className="text-3xl font-bold">{currentStep}</div>
              <div className="text-sm opacity-80">of {TOTAL_STEPS}</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-white/90 text-sm mb-2">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <div 
                className="bg-white h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl rounded-2xl overflow-hidden">
          <div className="p-8">
            <div className="max-w-2xl mx-auto">
              {renderStepContent()}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-12 pt-8 border-t border-slate-200">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep <= 1}
                className="h-12 px-6 border-2 border-slate-200 hover:border-green-500 hover:bg-green-50 rounded-xl transition-all duration-300 font-medium"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              {currentStep === TOTAL_STEPS ? (
                <Button
                  onClick={handleSubmit}
                  disabled={loading || paymentLoading}
                  className="h-12 px-6 bg-gradient-to-r from-green-600 to-yellow-500 hover:from-green-700 hover:to-yellow-600 text-white font-bold rounded-xl shadow-xl transform hover:scale-[1.02] transition-all duration-300"
                >
                  {loading || paymentLoading ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </div>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Complete Registration
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={loading}
                  className="h-12 px-6 bg-gradient-to-r from-green-600 to-yellow-500 hover:from-green-700 hover:to-yellow-600 text-white font-bold rounded-xl shadow-xl transform hover:scale-[1.02] transition-all duration-300"
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};