import { API_BASE_URL } from './constants.js';

// Production-ready API client - NO MOCK RESPONSES - Latest deployment
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
      const response = await silentFetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      return response;
    },

    sendPhoneOtp: async (userData) => {
      const response = await silentFetch(`${API_BASE_URL}/api/auth/send-phone-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      return response;
    },

    verifyPhoneOtp: async (data) => {
      const response = await silentFetch(`${API_BASE_URL}/api/auth/verify-phone-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return response;
    },

    resendPhoneOtp: async (data) => {
      const response = await silentFetch(`${API_BASE_URL}/api/auth/resend-phone-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return response;
    },

    verifyEmail: async (data) => {
      const response = await silentFetch(`${API_BASE_URL}/api/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return response;
    },

    resendEmailVerification: async (data) => {
      const response = await silentFetch(`${API_BASE_URL}/api/auth/resend-email-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return response;
    },

    verifyToken: async (token) => {
      const response = await silentFetch(`${API_BASE_URL}/api/auth/verify-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ token }),
      });
      return response;
    },

    forgotPassword: async (data) => {
      const response = await silentFetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return response;
    },

    forgotUsername: async (data) => {
      const response = await silentFetch(`${API_BASE_URL}/api/auth/forgot-username`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return response;
    },

    sendOtp: async (data) => {
      const response = await silentFetch(`${API_BASE_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return response;
    },

    resetPassword: async (data) => {
      const response = await silentFetch(`${API_BASE_URL}/api/auth/reset-password`, {
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
      const response = await silentFetch(`${API_BASE_URL}/api/auth/register-client`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      return response;
    },

    register: async (userData) => {
      // Generic register function that handles both client and provider registration
      const response = await silentFetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      return response;
    },

    sendOtp: async (data) => {
      const response = await silentFetch(`${API_BASE_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return response;
    },

    verifyOtp: async (data) => {
      const response = await silentFetch(`${API_BASE_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return response;
    },

    sendRegistrationOtp: async (userData) => {
      const response = await silentFetch(`${API_BASE_URL}/api/auth/send-registration-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      return response;
    },

    verifyRegistrationOtp: async (data) => {
      const response = await silentFetch(`${API_BASE_URL}/api/auth/verify-registration-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return response;
    },

    registerProvider: async (providerData) => {
      const response = await silentFetch(`${API_BASE_URL}/api/auth/register-provider`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(providerData),
      });
      return response;
    },
  },

  providers: {
    register: async (providerData) => {
      const response = await silentFetch(`${API_BASE_URL}/api/providers/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(providerData),
      });
      return response;
    },

    getProviders: async () => {
      const response = await silentFetch(`${API_BASE_URL}/api/providers`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response;
    },

    getProviderDetails: async (providerId) => {
      const response = await silentFetch(`${API_BASE_URL}/api/providers/${providerId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response;
    },

    bookService: async (bookingData, authToken) => {
      const response = await silentFetch(`${API_BASE_URL}/api/providers/book-service`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(bookingData),
      });
      return response;
    },

    updateAvailability: async (availabilityData) => {
      const response = await silentFetch(`${API_BASE_URL}/api/providers/update-availability`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(availabilityData),
      });
      return response;
    },
  },

  clients: {
    register: async (clientData, authToken) => {
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }
      
      const response = await silentFetch(`${API_BASE_URL}/api/clients/register`, {
        method: 'POST',
        headers,
        body: JSON.stringify(clientData),
      });
      return response;
    },

    getClientDetails: async (clientId) => {
      const response = await silentFetch(`${API_BASE_URL}/api/clients/${clientId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response;
    },
  },

  services: {
    submitServiceRequest: async (requestData) => {
      const response = await silentFetch(`${API_BASE_URL}/api/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      return response;
    },

    getProviders: async () => {
      const response = await silentFetch(`${API_BASE_URL}/api/providers`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response;
    },

    getProviderDetails: async (providerId) => {
      const response = await silentFetch(`${API_BASE_URL}/api/providers/${providerId}`, {
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
      const response = await silentFetch(`${API_BASE_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });
      return response;
    },

    getBookings: async () => {
      const response = await silentFetch(`${API_BASE_URL}/api/bookings`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response;
    },

    updateBooking: async (bookingId, bookingData) => {
      const response = await silentFetch(`${API_BASE_URL}/api/bookings/${bookingId}`, {
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
      const response = await silentFetch(`${API_BASE_URL}/api/payments/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });
      return response;
    },

    processEFT: async (eftData) => {
      const response = await silentFetch(`${API_BASE_URL}/api/payments/eft-payout`, {
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
        ? `${API_BASE_URL}/api/payments/provider-earnings?status=${status}`
        : `${API_BASE_URL}/api/payments/provider-earnings`;
      
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
        ? `${API_BASE_URL}/api/payments/eft-payouts?status=${status}`
        : `${API_BASE_URL}/api/payments/eft-payouts`;
      
      const response = await silentFetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response;
    },

    getPaymentHistory: async (limit = 20, offset = 0) => {
      const response = await silentFetch(`${API_BASE_URL}/api/payments/history?limit=${limit}&offset=${offset}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response;
    },

    collectCommission: async (commissionData) => {
      const response = await silentFetch(`${API_BASE_URL}/api/payments/commission`, {
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
      const response = await silentFetch(`${API_BASE_URL}/api/chat/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      });
      return response;
    },

    getMessages: async (chatId) => {
      const response = await silentFetch(`${API_BASE_URL}/api/chat/${chatId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response;
    },

    uploadFile: async (fileData) => {
      const response = await silentFetch(`${API_BASE_URL}/api/chat/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fileData),
      });
      return response;
    },

    authorizeFileUpload: async (fileData) => {
      const response = await silentFetch(`${API_BASE_URL}/api/chat/authorize-upload`, {
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
      const response = await silentFetch(`${API_BASE_URL}/api/admin/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response;
    },

    getProviders: async () => {
      const response = await silentFetch(`${API_BASE_URL}/api/admin/providers`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response;
    },

    approveProvider: async (providerId) => {
      const response = await silentFetch(`${API_BASE_URL}/api/admin/providers/${providerId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response;
    },

    rejectProvider: async (providerId) => {
      const response = await silentFetch(`${API_BASE_URL}/api/admin/providers/${providerId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response;
    },

    blockClient: async (clientId) => {
      const response = await silentFetch(`${API_BASE_URL}/api/admin/clients/${clientId}/block`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response;
    },

    unblockClient: async (clientId) => {
      const response = await silentFetch(`${API_BASE_URL}/api/admin/clients/${clientId}/unblock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response;
    },

    authenticate: async (credentials) => {
      const response = await silentFetch(`${API_BASE_URL}/api/admin/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      return response;
    },

    verifySession: async (sessionToken) => {
      const response = await silentFetch(`${API_BASE_URL}/api/admin/verify-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`
        },
      });
      return response;
    },

    refreshSession: async (refreshToken) => {
      const response = await silentFetch(`${API_BASE_URL}/api/admin/refresh-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });
      return response;
    },
  },
};