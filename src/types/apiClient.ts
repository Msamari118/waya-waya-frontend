// src/types/api.ts

// TypeScript declaration for import.meta.env
declare global {
  interface ImportMeta {
    env: {
      DEV?: boolean;
      VITE_API_BASE_URL?: string;
    };
  }
}

// API Base URL
const getApiBaseUrl = () => {
  if (import.meta.env.DEV) {
    return 'http://localhost:5000/api';
  }
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
};

const API_BASE_URL = getApiBaseUrl();

// Types for the API client
export interface OtpRequest {
  type: 'phone' | 'email';
  identifier: string; // phone number or email
  userId?: string; // optional UUID for existing users
}

export interface OtpVerification {
  userId: string; // required UUID
  otp: string; // 6-digit OTP
  type: 'phone' | 'email';
}

export interface OtpStatusRequest {
  userId: string;
  type: 'phone' | 'email';
}

export interface LoginCredentials {
  emailOrPhone: string;
  password: string;
}

export interface SignupData {
  email: string;
  phone: string;
  password: string;
  userType: 'client' | 'provider';
  fullName: string;
  profilePicture?: File; // Optional profile picture file
}

export interface UserData {
  phoneNumber: string;
  fullName: string;
  email: string;
  password: string;
  userType: 'client' | 'provider';
  userId?: string;
}

export interface PhoneOtpData {
  phoneNumber: string;
  otp: string;
  userId?: string;
}

export interface EmailVerificationData {
  email: string;
  verificationCode: string;
}

export interface PasswordResetData {
  token: string;
  newPassword: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ForgotUsernameData {
  email: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success?: boolean;
  message?: string;
  error?: string;
  data?: T;
  token?: string;
  user?: any;
  expiresAt?: string;
  type?: 'phone' | 'email';
  verified?: boolean;
}

export interface OtpStatusResponse {
  hasOTP: boolean;
  isExpired?: boolean;
  isUsed?: boolean;
  attempts?: number;
  remainingTime?: number;
  canResend?: boolean;
}

// Updated TypeScript API Client
export const apiClient = {
  auth: {
    login: async (credentials: LoginCredentials): Promise<Response> => {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      return response;
    },

    // NEW: Send OTP (replaces sendPhoneOtp)
    sendOtp: async (data: OtpRequest): Promise<Response> => {
      const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return response;
    },

    // NEW: Verify OTP (replaces verifyPhoneOtp)
    verifyOtp: async (data: OtpVerification): Promise<Response> => {
      const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return response;
    },

    // NEW: Resend OTP (replaces resendPhoneOtp)
    resendOtp: async (data: OtpRequest): Promise<Response> => {
      const response = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return response;
    },

    // NEW: Get OTP Status
    getOtpStatus: async (userId: string, type: 'phone' | 'email'): Promise<Response> => {
      const response = await fetch(`${API_BASE_URL}/auth/otp-status?userId=${userId}&type=${type}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response;
    },

    // Backward compatibility methods with proper typing
    sendPhoneOtp: async (userData: UserData): Promise<Response> => {
      // Convert to new format
      return apiClient.auth.sendOtp({
        type: 'phone',
        identifier: userData.phoneNumber,
        userId: userData.userId
      });
    },

    verifyPhoneOtp: async (data: PhoneOtpData): Promise<Response> => {
      // Convert to new format
      return apiClient.auth.verifyOtp({
        userId: data.userId || '', // Handle optional userId
        otp: data.otp,
        type: 'phone'
      });
    },

    resendPhoneOtp: async (data: { phone: string; userId?: string }): Promise<Response> => {
      // Convert to new format
      return apiClient.auth.resendOtp({
        userId: data.userId || '',
        type: 'phone',
        identifier: data.phone
      });
    },

    verifyEmail: async (data: EmailVerificationData): Promise<Response> => {
      const response = await fetch(`${API_BASE_URL}/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return response;
    },

    resendEmailVerification: async (data: { email: string }): Promise<Response> => {
      const response = await fetch(`${API_BASE_URL}/auth/resend-email-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return response;
    },

    forgotPassword: async (data: ForgotPasswordData): Promise<Response> => {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return response;
    },

    forgotUsername: async (data: ForgotUsernameData): Promise<Response> => {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-username`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return response;
    },

    resetPassword: async (data: PasswordResetData): Promise<Response> => {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return response;
    },

    verifyToken: async (token: string): Promise<Response> => {
      const response = await fetch(`${API_BASE_URL}/auth/verify-token`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response;
    },

    signup: async (userData: SignupData): Promise<Response> => {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      return response;
    }
  },

  providers: {
    // Upload profile picture for providers
    uploadProfilePicture: async (file: File, token: string): Promise<Response> => {
      const formData = new FormData();
      formData.append('profilePicture', file);
      
      const response = await fetch(`${API_BASE_URL}/providers/profile-picture`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });
      
      return response;
    },

    // Update provider profile
    updateProfile: async (profileData: any, token: string): Promise<Response> => {
      const response = await fetch(`${API_BASE_URL}/providers/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profileData)
      });
      
      return response;
    },

    // Get provider profile
    getProfile: async (token: string): Promise<Response> => {
      const response = await fetch(`${API_BASE_URL}/providers/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      return response;
    }
  },

  // ... rest of your existing apiClient code remains the same
};

// TypeScript utility functions for API responses
export const parseApiResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
  try {
    const data = await response.json();
    return {
      success: response.ok,
      ...data
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to parse response'
    };
  }
};

// TypeScript test function
export const testBackendConnection = async (): Promise<void> => {
  try {
    const response = await apiClient.auth.sendOtp({
      type: 'phone',
      identifier: '+27123456789',
      userId: undefined
    });
    
    const data = await parseApiResponse(response);
    console.log('Backend response:', data);
    
    if (response.ok) {
      console.log('✅ Backend connection successful!');
    } else {
      console.log('❌ Backend error:', data.error);
    }
  } catch (error) {
    console.error('❌ Network error:', error);
  }
};

export default apiClient;