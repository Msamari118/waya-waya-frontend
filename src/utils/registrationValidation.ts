/**
 * Provider Registration Validation Helpers
 */

import { REGISTRATION_STEPS } from './registrationConstants.js';

export const validateRegistrationStep = (formData: any, step: number, phoneOtpVerified: boolean, emailOtpVerified: boolean) => {
  const errors: Record<string, string> = {};

  switch (step) {
    case REGISTRATION_STEPS.PERSONAL_INFO:
      if (!formData.firstName?.trim()) {
        errors.firstName = 'First name is required';
      }
      if (!formData.lastName?.trim()) {
        errors.lastName = 'Last name is required';
      }
      if (!formData.email?.trim()) {
        errors.email = 'Email is required';
      } else if (!isValidEmail(formData.email)) {
        errors.email = 'Please enter a valid email address';
      }
      if (!formData.phone?.trim()) {
        errors.phone = 'Phone number is required';
      } else if (!isValidPhoneNumber(formData.phone)) {
        errors.phone = 'Please enter a valid phone number';
      }
      if (!formData.idNumber?.trim()) {
        errors.idNumber = 'ID number is required';
      }
      if (!emailOtpVerified) {
        errors.emailVerification = 'Email verification required';
      }
      break;

    case REGISTRATION_STEPS.SERVICE_INFO:
      if (!formData.primaryService) {
        errors.primaryService = 'Primary service is required';
      }
      if (!formData.serviceDescription?.trim()) {
        errors.serviceDescription = 'Service description is required';
      } else if (formData.serviceDescription.length < 50) {
        errors.serviceDescription = 'Please provide a more detailed description (minimum 50 characters)';
      }
      if (!formData.experienceYears || formData.experienceYears < 0) {
        errors.experienceYears = 'Experience years is required';
      }
      break;

    case REGISTRATION_STEPS.LOCATION_INFO:
      if (!formData.address?.trim()) {
        errors.address = 'Address is required';
      }
      if (!formData.city?.trim()) {
        errors.city = 'City is required';
      }
      if (!formData.province) {
        errors.province = 'Province is required';
      }
      if (!formData.postalCode?.trim()) {
        errors.postalCode = 'Postal code is required';
      } else if (!isValidPostalCode(formData.postalCode)) {
        errors.postalCode = 'Please enter a valid postal code';
      }
      break;

    case REGISTRATION_STEPS.PAYMENT_INFO:
      if (!formData.hourlyRate || formData.hourlyRate < 50) {
        errors.hourlyRate = 'Hourly rate is required (minimum R50)';
      } else if (formData.hourlyRate > 2000) {
        errors.hourlyRate = 'Hourly rate cannot exceed R2000';
      }
      if (formData.emergencyRates && (!formData.emergencyRateAmount || formData.emergencyRateAmount < 100)) {
        errors.emergencyRateAmount = 'Emergency rate is required (minimum R100)';
      }
      if (!formData.bankName?.trim()) {
        errors.bankName = 'Bank name is required';
      }
      if (!formData.accountHolderName?.trim()) {
        errors.accountHolderName = 'Account holder name is required';
      }
      if (!formData.accountNumber?.trim()) {
        errors.accountNumber = 'Account number is required';
      } else if (!isValidAccountNumber(formData.accountNumber)) {
        errors.accountNumber = 'Please enter a valid account number';
      }
      if (!formData.branchCode?.trim()) {
        errors.branchCode = 'Branch code is required';
      } else if (!isValidBranchCode(formData.branchCode)) {
        errors.branchCode = 'Please enter a valid branch code';
      }
      if (!formData.accountType) {
        errors.accountType = 'Account type is required';
      }
      break;

    case REGISTRATION_STEPS.DOCUMENT_UPLOAD:
      if (!formData.identityDocument) {
        errors.identityDocument = 'Identity document is required';
      }
      if (!formData.qualificationCertificates || formData.qualificationCertificates.length === 0) {
        errors.qualificationCertificates = 'At least one qualification certificate is required';
      }
      break;

    case REGISTRATION_STEPS.REVIEW:
      if (!formData.agreeToTerms) {
        errors.agreeToTerms = 'You must agree to the terms and conditions';
      }
      if (!formData.agreeToBackgroundCheck) {
        errors.agreeToBackgroundCheck = 'Background check consent is required';
      }
      if (!formData.agreeToDataProcessing) {
        errors.agreeToDataProcessing = 'Data processing consent is required';
      }
      break;

    default:
      break;
  }

  return errors;
};

export const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhoneNumber = (phone: string) => {
  // Remove all non-digits
  const cleanPhone = phone.replace(/\D/g, '');
  // Should be 9-10 digits for local numbers
  return cleanPhone.length >= 9 && cleanPhone.length <= 10;
};

export const isValidPostalCode = (postalCode: string) => {
  // South African postal codes are 4 digits
  const cleanCode = postalCode.replace(/\D/g, '');
  return cleanCode.length === 4;
};

export const isValidAccountNumber = (accountNumber: string) => {
  // Account numbers are typically 8-11 digits
  const cleanNumber = accountNumber.replace(/\D/g, '');
  return cleanNumber.length >= 8 && cleanNumber.length <= 11;
};

export const isValidBranchCode = (branchCode: string) => {
  // South African branch codes are 6 digits
  const cleanCode = branchCode.replace(/\D/g, '');
  return cleanCode.length === 6;
};

export const getStepCompletionPercentage = (currentStep: number, totalSteps: number) => {
  return (currentStep / totalSteps) * 100;
};

export const isStepComplete = (formData: any, step: number, phoneOtpVerified: boolean, emailOtpVerified: boolean) => {
  const errors = validateRegistrationStep(formData, step, phoneOtpVerified, emailOtpVerified);
  return Object.keys(errors).length === 0;
};