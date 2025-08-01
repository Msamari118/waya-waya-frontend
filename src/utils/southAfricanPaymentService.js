/**
 * South African Payment Service
 * Uses Railway backend for all payment processing
 */

import { apiClient } from './apiClient.js';

class SouthAfricanPaymentService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'https://waya-waya-backend-production.up.railway.app/api';
  }

  /**
   * Process payment using Railway backend
   */
  async processPayment(paymentData) {
    try {
      const response = await apiClient.payments.processPayment({
        bookingId: paymentData.bookingId,
        amount: paymentData.amount,
        paymentMethod: paymentData.paymentMethod || 'EFT'
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          paymentId: data.paymentId,
          amount: data.amount,
          commission: data.commission,
          message: data.message
        };
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Payment failed');
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Process EFT payment for provider earnings
   */
  async processEFTPayout(eftData) {
    try {
      const response = await apiClient.payments.processEFT({
        earningsIds: eftData.earningsIds,
        bankDetails: {
          accountNumber: eftData.accountNumber,
          bankName: eftData.bankName,
          accountHolderName: eftData.accountHolderName,
          branchCode: eftData.branchCode
        }
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          payoutId: data.payoutId,
          totalAmount: data.totalAmount,
          earningsCount: data.earningsCount,
          message: data.message
        };
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'EFT payout failed');
      }
    } catch (error) {
      console.error('EFT payout error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Process provider registration fee
   */
  async processRegistrationFee(registrationData) {
    try {
      const response = await apiClient.providers.register(registrationData);
      
      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          providerId: data.providerId,
          applicationFee: data.applicationFee,
          message: 'Registration fee processed successfully'
        };
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration fee processing failed');
      }
    } catch (error) {
      console.error('Registration fee error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Format amount in South African Rand
   */
  formatAmount(amount) {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2
    }).format(amount);
  }

  /**
   * Get supported payment methods for South Africa
   */
  getSupportedPaymentMethods() {
    return [
      {
        id: 'eft',
        name: 'EFT Transfer',
        description: 'Electronic Funds Transfer to your bank account',
        icon: '🏦',
        processingTime: '2-3 business days'
      },
      {
        id: 'card',
        name: 'Credit/Debit Card',
        description: 'Secure card payment',
        icon: '💳',
        processingTime: 'Instant'
      },
      {
        id: 'mobile_money',
        name: 'Mobile Money',
        description: 'Pay with your mobile wallet',
        icon: '📱',
        processingTime: 'Instant'
      }
    ];
  }
}

// Export singleton instance
export const southAfricanPaymentService = new SouthAfricanPaymentService();
export default southAfricanPaymentService; 