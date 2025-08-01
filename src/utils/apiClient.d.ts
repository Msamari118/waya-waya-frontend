// Define a flexible response type that can include additional properties
type ApiResponse = Response & {
  success?: boolean;
  session?: any;
  error?: string;
  valid?: boolean;
  [key: string]: any;
};

export const apiClient: {
  testConnection: () => Promise<boolean>;
  auth: {
    login: (credentials: any) => Promise<ApiResponse>;
    sendPhoneOtp: (userData: any) => Promise<ApiResponse>;
    verifyPhoneOtp: (data: any) => Promise<ApiResponse>;
    resendPhoneOtp: (data: any) => Promise<ApiResponse>;
    verifyEmail: (data: any) => Promise<ApiResponse>;
    resendEmailVerification: (data: any) => Promise<ApiResponse>;
    verifyToken: (token: string) => Promise<ApiResponse>;
    forgotPassword: (data: any) => Promise<ApiResponse>;
    forgotUsername: (data: any) => Promise<ApiResponse>;
    resetPassword: (data: any) => Promise<ApiResponse>;
  };
  providers: {
    register: (providerData: any) => Promise<ApiResponse>;
    getProviders: () => Promise<ApiResponse>;
    getProviderDetails: (providerId: string) => Promise<ApiResponse>;
    bookService: (bookingData: any, authToken: string) => Promise<ApiResponse>;
    updateAvailability: (availabilityData: any) => Promise<ApiResponse>;
  };
  clients: {
    register: (clientData: any, authToken?: string) => Promise<ApiResponse>;
    getClientDetails: (clientId: string) => Promise<ApiResponse>;
  };
  registration: {
    registerClient: (userData: any) => Promise<ApiResponse>;
    sendRegistrationOtp: (userData: any) => Promise<ApiResponse>;
    verifyRegistrationOtp: (data: any) => Promise<ApiResponse>;
    registerProvider: (providerData: any) => Promise<ApiResponse>;
  };
  services: {
    submitServiceRequest: (requestData: any) => Promise<ApiResponse>;
    getProviders: () => Promise<ApiResponse>;
    getProviderDetails: (providerId: string) => Promise<ApiResponse>;
  };
  bookings: {
    createBooking: (bookingData: any) => Promise<ApiResponse>;
    getBookings: () => Promise<ApiResponse>;
    updateBooking: (bookingId: string, bookingData: any) => Promise<ApiResponse>;
  };
  payments: {
    processPayment: (paymentData: any) => Promise<ApiResponse>;
    processEFT: (eftData: any) => Promise<ApiResponse>;
    getProviderEarnings: (status?: string | null) => Promise<ApiResponse>;
    getEFTPayouts: (status?: string | null) => Promise<ApiResponse>;
    getPaymentHistory: (limit?: number, offset?: number) => Promise<ApiResponse>;
    collectCommission: (commissionData: any) => Promise<ApiResponse>;
  };
  chat: {
    sendMessage: (messageData: any) => Promise<ApiResponse>;
    getMessages: (chatId: string) => Promise<ApiResponse>;
    uploadFile: (fileData: any) => Promise<ApiResponse>;
    authorizeFileUpload: (fileData: any) => Promise<ApiResponse>;
  };
  admin: {
    getStats: () => Promise<ApiResponse>;
    getProviders: () => Promise<ApiResponse>;
    approveProvider: (providerId: string) => Promise<ApiResponse>;
    rejectProvider: (providerId: string) => Promise<ApiResponse>;
    blockClient: (clientId: string) => Promise<ApiResponse>;
    unblockClient: (clientId: string) => Promise<ApiResponse>;
    authenticate: (credentials: any) => Promise<ApiResponse>;
    verifySession: (sessionToken: string) => Promise<ApiResponse>;
    refreshSession: (refreshToken: string) => Promise<ApiResponse>;
  };
};