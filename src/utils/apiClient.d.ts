export const apiClient: {
  testConnection: () => Promise<string | boolean>;
  auth: {
    verifyToken: (token: string) => Promise<any>;
    login: (credentials: any) => Promise<any>;
    sendPhoneOtp: (data: any) => Promise<any>;
    verifyPhoneOtp: (data: any) => Promise<any>;
    verifyEmail: (data: any) => Promise<any>;
    resendPhoneOtp: (data: any) => Promise<any>;
  };
  providers: {
    bookService: (data: any, token: string) => Promise<any>;
    register: (data: any, token: string) => Promise<any>;
    updateAvailability: (isAvailable: boolean, token: string) => Promise<any>;
  };
  clients: {
    register: (data: any, token: string) => Promise<any>;
  };
  admin: {
    authenticate: (credentials: any) => Promise<any>;
    verifySession: (token: string) => Promise<any>;
    refreshSession: (token: string) => Promise<any>;
    logout: (token: string) => Promise<any>;
    getUsers: (token: string) => Promise<any>;
    getProviders: (token: string) => Promise<any>;
    getBookings: (token: string) => Promise<any>;
    updateUserStatus: (userId: string, status: string, token: string) => Promise<any>;
    updateProviderStatus: (providerId: string, status: string, token: string) => Promise<any>;
  };
  // Add other methods as needed
};