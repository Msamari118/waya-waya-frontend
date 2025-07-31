export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

export interface PaymentData {
  amount: number;
  currency: string;
  description: string;
  customerEmail: string;
  customerName: string;
}

export const processPayment: (data: PaymentData) => Promise<PaymentResult>;
export const validatePaymentData: (data: PaymentData) => boolean;
export const getPaymentMethods: () => string[];
export const createPaymentIntent: (data: PaymentData) => Promise<any>;
export const initializePayment: (data: any) => Promise<{ success: boolean; authorizationUrl?: string; reference?: string; error?: string }>; 