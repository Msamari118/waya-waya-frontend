import { API_BASE_URL } from './constants.js';

// Production-ready API client - NO MOCK RESPONSES
const silentFetch = async (url, options = {}) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout for production
    
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    throw error;
  }
};

export const apiClient = {
  // Connection testing
  testConnection: async () => {
    try {
      const response = await silentFetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  },

  auth: {
    login: async (credentials) => {
      const response = await silentFetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      return response;
    },

    sendPhoneOtp: async (userData) => {
      const response = await silentFetch(`${API_BASE_URL}/auth/send-phone-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      return response;
    },

    verifyPhoneOtp: async (data) => {
      const response = await silentFetch(`${API_BASE_URL}/auth/verify-phone-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return response;
    },

    resendPhoneOtp: async (data) => {
      const response = await silentFetch(`${API_BASE_URL}/auth/resend-phone-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return response;
    },

    verifyEmail: async (data) => {
      const response = await silentFetch(`${API_BASE_URL}/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return response;
    },

    resendEmailVerification: async (data) => {
      const response = await silentFetch(`${API_BASE_URL}/auth/resend-email-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return response;
    },

    forgotPassword: async (data) => {
      const response = await silentFetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return response;
    },

    forgotUsername: async (data) => {
      const response = await silentFetch(`${API_BASE_URL}/auth/forgot-username`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return response;
    },

    resetPassword: async (data) => {
      const response = await silentFetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return response;
    },
  },

  registration: {
    registerClient: async (userData) => {
      const response = await silentFetch(`${API_BASE_URL}/auth/register-client`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      return response;
    },

    sendRegistrationOtp: async (userData) => {
      const response = await silentFetch(`${API_BASE_URL}/auth/send-registration-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      return response;
    },

    verifyRegistrationOtp: async (data) => {
      const response = await silentFetch(`${API_BASE_URL}/auth/verify-registration-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return response;
    },

    registerProvider: async (providerData) => {
      const response = await silentFetch(`${API_BASE_URL}/auth/register-provider`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(providerData),
      });
      return response;
    },
  },

  services: {
    submitServiceRequest: async (requestData) => {
      const response = await silentFetch(`${API_BASE_URL}/services/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      return response;
    },

    getProviders: async () => {
      const response = await silentFetch(`${API_BASE_URL}/services/providers`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response;
    },

    getProviderDetails: async (providerId) => {
      const response = await silentFetch(`${API_BASE_URL}/services/providers/${providerId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response;
    },
  },

  bookings: {
    createBooking: async (bookingData) => {
      const response = await silentFetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });
      return response;
    },

    getBookings: async () => {
      const response = await silentFetch(`${API_BASE_URL}/bookings`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response;
    },

    updateBooking: async (bookingId, bookingData) => {
      const response = await silentFetch(`${API_BASE_URL}/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });
      return response;
    },
  },

  payments: {
    processPayment: async (paymentData) => {
      const response = await silentFetch(`${API_BASE_URL}/payments/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });
      return response;
    },

    processEFT: async (eftData) => {
      const response = await silentFetch(`${API_BASE_URL}/payments/eft-payout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eftData),
      });
      return response;
    },

    getProviderEarnings: async (status = null) => {
      const url = status 
        ? `${API_BASE_URL}/payments/provider-earnings?status=${status}`
        : `${API_BASE_URL}/payments/provider-earnings`;
      
      const response = await silentFetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response;
    },

    getEFTPayouts: async (status = null) => {
      const url = status 
        ? `${API_BASE_URL}/payments/eft-payouts?status=${status}`
        : `${API_BASE_URL}/payments/eft-payouts`;
      
      const response = await silentFetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response;
    },

    getPaymentHistory: async (limit = 20, offset = 0) => {
      const response = await silentFetch(`${API_BASE_URL}/payments/history?limit=${limit}&offset=${offset}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response;
    },

    collectCommission: async (commissionData) => {
      const response = await silentFetch(`${API_BASE_URL}/payments/commission`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commissionData),
      });
      return response;
    },
  },

  chat: {
    sendMessage: async (messageData) => {
      const response = await silentFetch(`${API_BASE_URL}/chat/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      });
      return response;
    },

    getMessages: async (chatId) => {
      const response = await silentFetch(`${API_BASE_URL}/chat/${chatId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response;
    },

    uploadFile: async (fileData) => {
      const response = await silentFetch(`${API_BASE_URL}/chat/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fileData),
      });
      return response;
    },

    authorizeFileUpload: async (fileData) => {
      const response = await silentFetch(`${API_BASE_URL}/chat/authorize-upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fileData),
      });
      return response;
    },
  },

  admin: {
    getStats: async () => {
      const response = await silentFetch(`${API_BASE_URL}/admin/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response;
    },

    getProviders: async () => {
      const response = await silentFetch(`${API_BASE_URL}/admin/providers`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response;
    },

    approveProvider: async (providerId) => {
      const response = await silentFetch(`${API_BASE_URL}/admin/providers/${providerId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response;
    },

    rejectProvider: async (providerId) => {
      const response = await silentFetch(`${API_BASE_URL}/admin/providers/${providerId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response;
    },

    blockClient: async (clientId) => {
      const response = await silentFetch(`${API_BASE_URL}/admin/clients/${clientId}/block`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response;
    },

    unblockClient: async (clientId) => {
      const response = await silentFetch(`${API_BASE_URL}/admin/clients/${clientId}/unblock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response;
    },
  },
};