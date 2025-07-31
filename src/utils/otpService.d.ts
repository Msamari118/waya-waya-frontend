export interface OtpResult {
  success: boolean;
  message?: string;
  error?: string;
  masked?: string;
}

export const sendOtp: (phone: string, type: 'sms' | 'email') => Promise<OtpResult>;
export const sendSMSOTP: (phone: string, type?: string, identifier?: string) => Promise<OtpResult>;
export const sendEmailOTP: (email: string, type?: string, identifier?: string) => Promise<OtpResult>;
export const verifyOtp: (phone: string, otp: string, type: 'sms' | 'email') => Promise<OtpResult>;
export const verifyOTP: (identifier: string, otp: string, type: 'phone' | 'email') => Promise<OtpResult>;
export const resendOtp: (phone: string, type: 'sms' | 'email') => Promise<OtpResult>;
export const validateOtp: (otp: string) => boolean; 