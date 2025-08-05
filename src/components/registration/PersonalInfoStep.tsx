// src/components/ProviderRegistration/PersonalInfoStep.tsx
import React, { useState, useEffect } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { UserCheck, Shield, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { ProfilePictureUpload } from './ProfilePictureUpload';
import { OTPVerification } from './OTPVerification'; // Import the OTPVerification component
import { internationalCountryCodes } from '../../utils/constants'; // Assuming this exists and exports CountryCode type
// Assuming these types are defined somewhere, e.g., in a types file
// import { FormData, Errors } from '../../types/registration'; 

// --- Defining basic types for props if not imported ---
// You might want to define these more formally in a shared types file.
interface FormData {
  firstName?: string;
  lastName?: string;
  email?: string;
  countryCode?: string;
  phone?: string;
  idNumber?: string;
  dateOfBirth?: string;
  profilePicture?: string;
  profilePicturePreview?: string;
  // Add other fields as needed by other steps if they exist in the shared formData object
  // For this component, we primarily deal with the above.
}

interface Errors {
  firstName?: string;
  lastName?: string;
  email?: string; // General email error
  emailVerification?: string; // Specific error related to email verification state
  phone?: string;
  idNumber?: string;
  dateOfBirth?: string;
  profilePicture?: string;
  // Add other potential error fields
}

// Define the shape of CountryCode if needed locally or if not strongly typed elsewhere
// interface CountryCode {
//   id: string;
//   code: string;
//   flag: string;
//   name: string;
// }

interface PersonalInfoStepProps {
  formData: FormData;
  errors: Errors; // Includes errors from parent/state management
  emailOtpVerified: boolean; // Receive email verification status from parent
  onFieldChange: (field: keyof FormData, value: any) => void; // Type-safe field change
  onError: (field: string, error: string) => void; // Error reporting to parent
  onEmailVerified: () => void; // Callback for when email is verified
  onNext: () => void; // Add onNext prop - Function to trigger navigation to the next step
  onAllFieldsValid: (isValid: boolean) => void; // Callback for parent component to know validation state
}

export const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({
  formData,
  errors, // Parent-managed errors (might overlap with localErrors)
  emailOtpVerified, // Verification status managed by parent
  onFieldChange,
  onError,
  onEmailVerified, // Callback when OTP component successfully verifies
  onNext,
  onAllFieldsValid
}) => {
  // Local state for errors managed within this component for immediate feedback
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
  const [isCheckingID, setIsCheckingID] = useState<boolean>(false); // Example state, might be used for async ID checks

  // --- Validation Logic ---
  // Validates all fields and notifies the parent about the overall validity
  const validateAllFields = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required Fields Check
    const requiredFields: (keyof FormData)[] = ['firstName', 'lastName', 'email', 'countryCode', 'phone', 'idNumber', 'dateOfBirth'];
    requiredFields.forEach(field => {
      // Check if the field value is missing or an empty string
      if (!formData[field] || (typeof formData[field] === 'string' && (formData[field] as string).trim() === '')) {
        // Capitalize first letter and add space before capital letters for label
        const label = field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1').trim();
        newErrors[field] = `${label} is required.`;
      }
    });

    // Specific validations (can be expanded)
    // Email format check (basic)
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address.';
    }
    // Email verification check - Require email to be verified
    if (formData.email && !emailOtpVerified) {
        newErrors.emailVerification = 'Please verify your email address to continue.';
    }

    // Phone number format check (basic SA format: 9-11 digits)
    if (formData.phone && !/^\d{9,11}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid South African phone number (e.g., 821234567).';
    }

    // South African ID number format check (basic: 13 digits)
    if (formData.idNumber && !/^\d{13}$/.test(formData.idNumber)) {
      newErrors.idNumber = 'Please enter a valid 13-digit South African ID number.';
    }

    // Date of Birth check (basic: not empty if ID is provided, format YYYY-MM-DD assumed)
    // Note: Could add more complex validation or cross-field checks (e.g., DOB vs ID number)
    if (formData.idNumber && (!formData.dateOfBirth || formData.dateOfBirth.trim() === '')) {
        newErrors.dateOfBirth = 'Date of Birth is required when providing an ID number.';
    }

    setLocalErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    onAllFieldsValid(isValid); // Inform parent component
    return isValid;
  };

  // --- Effects ---
  // Effect to re-validate whenever formData or emailOtpVerified changes
  // This ensures validation status is always up-to-date
  useEffect(() => {
    validateAllFields();
  }, [formData, emailOtpVerified]); // Depend on formData and emailOtpVerified

  // --- Handlers ---
  // Handle ID Number blur to potentially auto-fill DOB (stubbed logic)
  const handleIdNumberBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const idNumber = e.target.value;
    onFieldChange('idNumber', idNumber);
    // Example stub logic for auto-filling DOB:
    // In a real scenario, you'd parse the ID number (if valid) to extract the DOB
    // and then call onFieldChange('dateOfBirth', parsedDobString);
    // For now, just a placeholder:
    if (idNumber && idNumber.length === 13) {
        // Simple placeholder DOB extraction logic (YYMMDD...)
        // const yearPrefix = parseInt(idNumber.substring(0, 2), 10) >= 25 ? '19' : '20';
        // const dobString = `${yearPrefix}${idNumber.substring(0, 2)}-${idNumber.substring(2, 4)}-${idNumber.substring(4, 6)}`;
        // onFieldChange('dateOfBirth', dobString); // Example of setting DOB
        // Real logic would be more robust and handle edge cases.
    }
  };

  // Handle Next button click
  const handleNextClick = () => {
    // Re-run validation to ensure current state is valid
    if (validateAllFields()) {
      // If validation passes, call the onNext prop to proceed
      onNext();
    } else {
      // Optional: Scroll to the first error or show a general error message
      console.warn("Attempted to proceed, but validation failed.");
      // You could trigger a toast notification or highlight the first error field here.
    }
  };

  // --- Render ---
  return (
    <div className="space-y-8 animate-in fade-in-0 slide-in-from-right-1 duration-300">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="bg-gradient-to-r from-green-500 to-teal-500 p-4 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
          <UserCheck className="h-12 w-12 text-white" />
        </div>
        <h3 className="text-3xl font-bold text-slate-800 mb-2">Siyabonga! Welcome to WAYA WAYA!</h3>
        <p className="text-slate-600 text-lg">Let's get to know you better. Please fill in your personal details.</p>
      </div>

      {/* Profile Picture Upload */}
      {/* Assuming ProfilePictureUpload handles its own state/errors */}
      <Card className="border-2 border-dashed border-slate-300 hover:border-green-500 transition-colors bg-slate-50">
        <CardContent className="p-6">
          <ProfilePictureUpload
            profilePicture={formData.profilePicture}
            profilePicturePreview={formData.profilePicturePreview}
            onUploadSuccess={(url: string) => {
              onFieldChange('profilePicture', url);
              onFieldChange('profilePicturePreview', url);
            }}
            onError={(error: string) => onError('profilePicture', error)}
          />
        </CardContent>
      </Card>

      {/* Names */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-slate-700 font-semibold text-sm uppercase tracking-wide flex items-center">
            First Name *
          </Label>
          <Input
            id="firstName"
            value={formData.firstName || ''}
            onChange={(e) => onFieldChange('firstName', e.target.value)}
            className={`h-14 border-2 ${(localErrors.firstName || errors.firstName) ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-green-500 focus:ring-green-500/20'} rounded-xl transition-all duration-300 text-lg`}
            placeholder="John"
          />
          {(localErrors.firstName || errors.firstName) && (
            <p className="text-sm text-red-600 mt-1 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {localErrors.firstName || errors.firstName}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-slate-700 font-semibold text-sm uppercase tracking-wide flex items-center">
            Last Name *
          </Label>
          <Input
            id="lastName"
            value={formData.lastName || ''}
            onChange={(e) => onFieldChange('lastName', e.target.value)}
            className={`h-14 border-2 ${(localErrors.lastName || errors.lastName) ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-green-500 focus:ring-green-500/20'} rounded-xl transition-all duration-300 text-lg`}
            placeholder="Doe"
          />
          {(localErrors.lastName || errors.lastName) && (
            <p className="text-sm text-red-600 mt-1 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {localErrors.lastName || errors.lastName}
            </p>
          )}
        </div>
      </div>

      {/* Contact Information */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
        <CardContent className="p-6">
          <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
            <Mail className="h-5 w-5 mr-2 text-blue-600" /> Contact Information
          </h4>

          {/* Email with Verification */}
          <div className="space-y-2 mb-6">
            <Label htmlFor="email" className="text-slate-700 font-semibold text-sm uppercase tracking-wide flex items-center">
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email || ''}
              onChange={(e) => onFieldChange('email', e.target.value)}
              className={`h-14 border-2 ${(localErrors.email || localErrors.emailVerification || errors.email || errors.emailVerification) ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-green-500 focus:ring-green-500/20'} rounded-xl transition-all duration-300 text-lg`}
              placeholder="john.doe@example.com"
              disabled={emailOtpVerified} // Disable input after verification
            />
            {/* Email OTP Verification Component */}
            {/* Appears only if email is entered and not yet verified */}
            {formData.email && !emailOtpVerified && (
              <OTPVerification
                type="email"
                identifier={formData.email}
                label="Email"
                verified={emailOtpVerified}
                onVerified={onEmailVerified} // Callback when verified
                onError={(error) => onError('email', error)} // Report OTP errors
              />
            )}
            {/* Show verification status or errors */}
            {emailOtpVerified && (
              <p className="text-sm text-green-600 mt-1 flex items-center">
                <CheckCircle className="h-4 w-4 mr-1" /> Email verified successfully!
              </p>
            )}
            {/* Show local or parent errors if email is not verified */}
            {(!emailOtpVerified && (localErrors.email || localErrors.emailVerification || errors.email || errors.emailVerification)) && (
              <p className="text-sm text-red-600 mt-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {localErrors.email || localErrors.emailVerification || errors.email || errors.emailVerification}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-slate-700 font-semibold text-sm uppercase tracking-wide flex items-center">
              South African Phone Number *
            </Label>
            <div className="flex gap-3">
              <Select
                value={formData.countryCode || '+27'} // Default to South Africa
                onValueChange={(value) => onFieldChange('countryCode', value)}
              >
                <SelectTrigger className="w-24 h-14 border-2 border-slate-200 focus:border-green-500 focus:ring-green-500/20 rounded-xl transition-all duration-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-lg">
                  {/* Filter for SA or list relevant codes */}
                  {internationalCountryCodes
                    .filter((c) => c.code === '+27') // Example: Filter for SA only
                    .map((country) => (
                      <SelectItem key={country.id} value={country.code} className="text-gray-900 hover:bg-gray-100">
                        {country.flag} {country.code}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Input
                id="phone"
                placeholder="82 123 4567"
                value={formData.phone || ''}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
                  if (value.length <= 11) { // Limit to 11 digits for SA numbers
                    onFieldChange('phone', value);
                  }
                }}
                className={`flex-1 h-14 border-2 ${(localErrors.phone || errors.phone) ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-green-500 focus:ring-green-500/20'} rounded-xl transition-all duration-300 text-lg`}
              />
            </div>
            {(localErrors.phone || errors.phone) && (
              <p className="text-sm text-red-600 mt-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {localErrors.phone || errors.phone}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Identity Verification */}
      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100">
        <CardContent className="p-6">
          <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
            <Shield className="h-5 w-5 mr-2 text-amber-600" /> Identity Verification
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="idNumber" className="text-slate-700 font-semibold text-sm uppercase tracking-wide flex items-center">
                South African ID Number *
              </Label>
              <Input
                id="idNumber"
                value={formData.idNumber || ''}
                onChange={(e) => onFieldChange('idNumber', e.target.value.replace(/\D/g, ''))} // Only allow digits
                onBlur={handleIdNumberBlur} // Auto-fill DOB on blur (stub)
                maxLength={13}
                className={`h-14 border-2 ${(localErrors.idNumber || errors.idNumber) ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-green-500 focus:ring-green-500/20'} rounded-xl transition-all duration-300 text-lg`}
                placeholder="9001010001088"
              />
              {isCheckingID && <p className="text-sm text-slate-500">Verifying ID...</p>}
              {(localErrors.idNumber || errors.idNumber) && (
                <p className="text-sm text-red-600 mt-1 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {localErrors.idNumber || errors.idNumber}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth" className="text-slate-700 font-semibold text-sm uppercase tracking-wide flex items-center">
                Date of Birth *
              </Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth || ''} // Expecting YYYY-MM-DD format
                onChange={(e) => onFieldChange('dateOfBirth', e.target.value)}
                className={`h-14 border-2 ${(localErrors.dateOfBirth || errors.dateOfBirth) ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-green-500 focus:ring-green-500/20'} rounded-xl transition-all duration-300 text-lg`}
              />
              {(localErrors.dateOfBirth || errors.dateOfBirth) && (
                <p className="text-sm text-red-600 mt-1 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {localErrors.dateOfBirth || errors.dateOfBirth}
                </p>
              )}
              <p className="text-xs text-slate-500 mt-1">This will be automatically filled if you enter a valid SA ID above.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Alert className="bg-blue-50 border-blue-200">
        <AlertDescription className="text-blue-700">
          <strong className="font-bold">Almost there!</strong> Please ensure all fields marked with an asterisk (*) are filled correctly.
          We use this information to verify your identity and ensure a safe platform for everyone.
          {/* Show specific email verification error if present */}
          {(localErrors.emailVerification || errors.emailVerification) && (
            <p className="mt-2 text-red-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {localErrors.emailVerification || errors.emailVerification}
            </p>
          )}
        </AlertDescription>
      </Alert>

      {/* Next Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleNextClick} // Use the handler that validates first
          className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
        >
          Next Step
        </Button>
      </div>
    </div>
  );
};