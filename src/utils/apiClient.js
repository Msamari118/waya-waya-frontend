import { API_BASE_URL } from './constants.js';

// Production-ready API client - NO MOCK RESPONSES - Latest deployment
const silentFetch = async (url, options = {}) => {
  try {
    console.log('🌐 Making API request to:', url);
    console.log('📋 Request options:', { method: options.method, headers: options.headers });
    
    // Check if AbortController is available
    if (typeof AbortController !== 'undefined') {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.log('⏰ Request timeout - aborting');
        controller.abort();
      }, 15000); // 15 second timeout for production
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      console.log('✅ API request successful:', response.status, response.statusText);
      return response;
    } else {
      // Fallback for environments without AbortController
      console.log('⚠️ AbortController not available, using fallback');
      const response = await fetch(url, {
        ...options
      });
      console.log('✅ API request successful (fallback):', response.status, response.statusText);
      return response;
    }
  } catch (error) {
    console.error('❌ API request failed:', {
      url,
      error: error.message,
      type: error.name,
      stack: error.stack
    });
    
    // Return a proper error response instead of throwing
    return {
      ok: false,
      status: 0,
      statusText: error.name === 'AbortError' ? 'Request Timeout' : 'Network Error',
      json: async () => ({ 
        error: error.message || 'Network error occurred',
        details: {
          url,
          errorType: error.name,
          timestamp: new Date().toISOString()
        }
      })
    };
  }
};

export const apiClient = {
  // Connection testing with detailed logging
  testConnection: async () => {
    console.log('🔍 Testing API connection...');
    console.log('🌐 API Base URL:', API_BASE_URL);
    
    try {
      const healthUrl = `${API_BASE_URL.replace('/api', '')}/health`;
      console.log('🏥 Health check URL:', healthUrl);
      
      const response = await silentFetch(healthUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('🏥 Health check response:', {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText
      });
      
      return response.ok;
    } catch (error) {
      console.error('❌ Connection test failed:', error);
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

    // NEW: Improved OTP flow endpoints
    requestPhoneOtp: async (data) => {
      const response = await silentFetch(`${API_BASE_URL}/auth/request-phone-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
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

    // Legacy endpoint (keeping for backward compatibility)
    sendPhoneOtp: async (userData) => {
      const response = await silentFetch(`${API_BASE_URL}/auth/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      return response;
    },

    verifyPhoneOtp: async (data) => {
      const response = await silentFetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return response;
    },

    resendPhoneOtp: async (data) => {
      const response = await silentFetch(`${API_BASE_URL}/auth/resend-otp`, {
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

    verifyToken: async (token) => {
      const response = await silentFetch(`${API_BASE_URL}/auth/verify-token`, {
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

    sendOtp: async (data) => {
      const response = await silentFetch(`${API_BASE_URL}/auth/send-otp`, {
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

    register: async (userData) => {
      // Generic register function that handles both client and provider registration
      const response = await silentFetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      return response;
    },

    verifyOtp: async (data) => {
      const response = await silentFetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return response;
    },

    resendOtp: async (data) => {
      const response = await silentFetch(`${API_BASE_URL}/auth/resend-otp`, {
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

    register: async (userData) => {
      // Generic register function that handles both client and provider registration
      const response = await silentFetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      return response;
    },

    sendOtp: async (data) => {
      const response = await silentFetch(`${API_BASE_URL}/auth/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return response;
    },

    verifyOtp: async (data) => {
      const response = await silentFetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
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

  providers: {
    register: async (providerData, authToken) => {
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }
      
      const response = await silentFetch(`${API_BASE_URL}/providers/register`, {
        method: 'POST',
        headers,
        body: JSON.stringify(providerData),
      });
      return response;
    },

    getProviders: async () => {
      const response = await silentFetch(`${API_BASE_URL}/providers`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response;
    },

    getProviderDetails: async (providerId) => {
      const response = await silentFetch(`${API_BASE_URL}/providers/${providerId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response;
    },

    bookService: async (bookingData, authToken) => {
      const response = await silentFetch(`${API_BASE_URL}/providers/book-service`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(bookingData),
      });
      return response;
    },

    updateAvailability: async (availabilityData, authToken) => {
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }
      
      const response = await silentFetch(`${API_BASE_URL}/providers/update-availability`, {
        method: 'PUT',
        headers,
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
      
      const response = await silentFetch(`${API_BASE_URL}/clients/register`, {
        method: 'POST',
        headers,
        body: JSON.stringify(clientData),
      });
      return response;
    },

    getClientDetails: async (clientId) => {
      const response = await silentFetch(`${API_BASE_URL}/clients/${clientId}`, {
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
      const response = await silentFetch(`${API_BASE_URL}/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      return response;
    },

    getProviders: async () => {
      const response = await silentFetch(`${API_BASE_URL}/providers`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response;
    },

    getProviderDetails: async (providerId) => {
      const response = await silentFetch(`${API_BASE_URL}/providers/${providerId}`, {
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
    getStats: async (authToken) => {
      const response = await silentFetch(`${API_BASE_URL}/admin/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
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

    authenticate: async (credentials) => {
      const response = await silentFetch(`${API_BASE_URL}/admin/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      return response;
    },

    verifySession: async (sessionToken) => {
      const response = await silentFetch(`${API_BASE_URL}/admin/verify-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`
        },
      });
      return response;
    },

    refreshSession: async (refreshToken) => {
      const response = await silentFetch(`${API_BASE_URL}/admin/refresh-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });
      return response;
    },

    getUsers: async (authToken, type, page = 1, limit = 10) => {
      const response = await silentFetch(`${API_BASE_URL}/admin/users?type=${type}&page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });
      return response;
    },

    getPayments: async (authToken, page = 1, limit = 10) => {
      const response = await silentFetch(`${API_BASE_URL}/admin/payments?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });
      return response;
    },

    getTrials: async (authToken, page = 1, limit = 10) => {
      const response = await silentFetch(`${API_BASE_URL}/admin/trials?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });
      return response;
    },
  },
};
