export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const validatePersonalInfo: (data: any) => ValidationResult;
export const validateServiceInfo: (data: any) => ValidationResult;
export const validateLocationInfo: (data: any) => ValidationResult;
export const validatePaymentInfo: (data: any) => ValidationResult;
export const validateDocumentUpload: (files: File[]) => ValidationResult;
export const validateEmail: (email: string) => boolean;
export const validatePhone: (phone: string) => boolean;
export const validatePassword: (password: string) => boolean;
export const validateRegistrationStep: (data: any, step: number, phoneOtpVerified: boolean, emailOtpVerified: boolean) => Record<string, string>;
export const getStepCompletionPercentage: (currentStep: number, totalSteps: number) => number; 