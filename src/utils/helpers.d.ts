export const validatePassword: (password: string) => boolean;
export const checkAdminAccess: () => boolean;
export const setAdminAccess: (access: boolean) => void;
export const createOtpFunctions: (apiClient: any, setOtpState: any) => any;
export const createConnectionRetryFunction: (apiClient: any, setIsConnected: any, setConnectionError: any) => () => void;