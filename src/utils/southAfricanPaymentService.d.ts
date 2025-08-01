export interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: string;
  processingTime: string;
}

export interface PaymentResult {
  success: boolean;
  paymentId?: string;
  amount?: number;
  commission?: number;
  message?: string;
  error?: string;
}

export interface EFTPayoutResult {
  success: boolean;
  payoutId?: string;
  totalAmount?: number;
  earningsCount?: number;
  message?: string;
  error?: string;
}

export interface RegistrationFeeResult {
  success: boolean;
  providerId?: string;
  applicationFee?: number;
  message?: string;
  error?: string;
}

export interface PaymentData {
  bookingId: string;
  amount: number;
  paymentMethod?: string;
}

export interface EFTData {
  earningsIds: string[];
  accountNumber: string;
  bankName: string;
  accountHolderName: string;
  branchCode: string;
}

export interface RegistrationData {
  [key: string]: any;
  applicationFee: number;
  paymentMethod: string;
}

export interface SouthAfricanPaymentService {
  processPayment(paymentData: PaymentData): Promise<PaymentResult>;
  processEFTPayout(eftData: EFTData): Promise<EFTPayoutResult>;
  processRegistrationFee(registrationData: RegistrationData): Promise<RegistrationFeeResult>;
  formatAmount(amount: number): string;
  getSupportedPaymentMethods(): PaymentMethod[];
}

declare const southAfricanPaymentService: SouthAfricanPaymentService;
export { southAfricanPaymentService };
export default southAfricanPaymentService; 