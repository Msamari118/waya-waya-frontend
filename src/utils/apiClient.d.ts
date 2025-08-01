export const apiClient: {
  testConnection: () => Promise<boolean>;
  auth: {
    login: (credentials: any) => Promise<Response>;
    sendPhoneOtp: (userData: any) => Promise<Response>;
    verifyPhoneOtp: (data: any) => Promise<Response>;
    resendPhoneOtp: (data: any) => Promise<Response>;
    verifyEmail: (data: any) => Promise<Response>;
    resendEmailVerification: (data: any) => Promise<Response>;
    forgotPassword: (data: any) => Promise<Response>;
    forgotUsername: (data: any) => Promise<Response>;
    resetPassword: (data: any) => Promise<Response>;
  };
  registration: {
    registerClient: (userData: any) => Promise<Response>;
    sendRegistrationOtp: (userData: any) => Promise<Response>;
    verifyRegistrationOtp: (data: any) => Promise<Response>;
    registerProvider: (providerData: any) => Promise<Response>;
  };
  services: {
    submitServiceRequest: (requestData: any) => Promise<Response>;
    getProviders: () => Promise<Response>;
    getProviderDetails: (providerId: string) => Promise<Response>;
  };
  bookings: {
    createBooking: (bookingData: any) => Promise<Response>;
    getBookings: () => Promise<Response>;
    updateBooking: (bookingId: string, bookingData: any) => Promise<Response>;
  };
  payments: {
    processPayment: (paymentData: any) => Promise<Response>;
    processEFT: (eftData: any) => Promise<Response>;
    getProviderEarnings: (status?: string | null) => Promise<Response>;
    getEFTPayouts: (status?: string | null) => Promise<Response>;
    getPaymentHistory: (limit?: number, offset?: number) => Promise<Response>;
    collectCommission: (commissionData: any) => Promise<Response>;
  };
  chat: {
    sendMessage: (messageData: any) => Promise<Response>;
    getMessages: (chatId: string) => Promise<Response>;
    uploadFile: (fileData: any) => Promise<Response>;
    authorizeFileUpload: (fileData: any) => Promise<Response>;
  };
  admin: {
    getStats: () => Promise<Response>;
    getProviders: () => Promise<Response>;
    approveProvider: (providerId: string) => Promise<Response>;
    rejectProvider: (providerId: string) => Promise<Response>;
    blockClient: (clientId: string) => Promise<Response>;
    unblockClient: (clientId: string) => Promise<Response>;
  };
};