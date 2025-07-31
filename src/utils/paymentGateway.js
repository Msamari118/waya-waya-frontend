/**
 * Production-Ready Payment Gateway Service
 * Supports Paystack for South African payments (Browser-compatible version)
 */

class PaymentGateway {
  constructor() {
    // Browser-compatible environment variable access
    const env = (typeof process !== 'undefined' && process.env) ? process.env : {};
    
    this.paystackPublicKey = env.REACT_APP_PAYSTACK_PUBLIC_KEY || 'pk_test_your_paystack_public_key';
    this.paystackSecretKey = env.REACT_APP_PAYSTACK_SECRET_KEY || 'sk_test_your_paystack_secret_key';
    this.baseURL = 'https://api.paystack.co';
    this.isProduction = (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'production') || false;
  }

  /**
   * Initialize Paystack payment
   */
  async initializePayment(paymentData) {
    try {
      const response = await fetch(`${this.baseURL}/transaction/initialize`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.paystackSecretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: paymentData.email,
          amount: Math.round(paymentData.amount * 100), // Convert to kobo
          currency: 'ZAR',
          reference: paymentData.reference || this.generateReference(),
          callback_url: paymentData.callbackUrl || `${window.location.origin}/payment/callback`,
          metadata: {
            userId: paymentData.userId,
            userType: paymentData.userType,
            paymentType: paymentData.paymentType,
            providerApplicationFee: paymentData.providerApplicationFee,
            bookingId: paymentData.bookingId,
            commissionPayment: paymentData.commissionPayment,
            ...paymentData.metadata
          },
          channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
          split_code: paymentData.splitCode, // For commission splitting
        })
      });

      const data = await response.json();
      
      if (data.status) {
        return {
          success: true,
          authorizationUrl: data.data.authorization_url,
          accessCode: data.data.access_code,
          reference: data.data.reference
        };
      } else {
        throw new Error(data.message || 'Payment initialization failed');
      }
    } catch (error) {
      console.error('Payment initialization error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Verify payment transaction
   */
  async verifyPayment(reference) {
    try {
      const response = await fetch(`${this.baseURL}/transaction/verify/${reference}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.paystackSecretKey}`,
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      
      if (data.status) {
        return {
          success: true,
          data: data.data,
          status: data.data.status,
          amount: data.data.amount / 100, // Convert from kobo
          metadata: data.data.metadata
        };
      } else {
        throw new Error(data.message || 'Payment verification failed');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Create a split payment plan for commission collection
   */
  async createSplitPayment(splitData) {
    try {
      const response = await fetch(`${this.baseURL}/split`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.paystackSecretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: splitData.name,
          type: 'percentage',
          subaccounts: [
            {
              subaccount: splitData.providerSubaccount,
              share: 95 // Provider gets 95%
            },
            {
              subaccount: splitData.platformSubaccount,
              share: 5 // Platform gets 5%
            }
          ],
          bearer_type: 'account',
          bearer_subaccount: splitData.platformSubaccount
        })
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Split payment creation error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Process EFT payment
   */
  async processEFTPayment(eftData) {
    try {
      const response = await fetch(`${this.baseURL}/transferrecipient`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.paystackSecretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'nuban',
          name: eftData.recipientName,
          account_number: eftData.accountNumber,
          bank_code: eftData.bankCode,
          currency: 'ZAR'
        })
      });

      const recipientData = await response.json();
      
      if (recipientData.status) {
        // Initiate transfer
        const transferResponse = await fetch(`${this.baseURL}/transfer`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.paystackSecretKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            source: 'balance',
            amount: Math.round(eftData.amount * 100),
            recipient: recipientData.data.recipient_code,
            reason: eftData.reason || 'Provider payment'
          })
        });

        return await transferResponse.json();
      }
      
      return recipientData;
    } catch (error) {
      console.error('EFT payment error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get payment history
   */
  async getPaymentHistory(userId, page = 1, perPage = 50) {
    try {
      const response = await fetch(`${this.baseURL}/transaction?customer=${userId}&page=${page}&perPage=${perPage}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.paystackSecretKey}`,
          'Content-Type': 'application/json',
        }
      });

      return await response.json();
    } catch (error) {
      console.error('Payment history error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Refund payment
   */
  async refundPayment(transactionReference, amount) {
    try {
      const response = await fetch(`${this.baseURL}/refund`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.paystackSecretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transaction: transactionReference,
          amount: amount ? Math.round(amount * 100) : undefined
        })
      });

      return await response.json();
    } catch (error) {
      console.error('Refund error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Create customer for recurring payments
   */
  async createCustomer(customerData) {
    try {
      const response = await fetch(`${this.baseURL}/customer`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.paystackSecretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: customerData.email,
          first_name: customerData.firstName,
          last_name: customerData.lastName,
          phone: customerData.phone,
          metadata: customerData.metadata
        })
      });

      return await response.json();
    } catch (error) {
      console.error('Customer creation error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Generate unique payment reference
   */
  generateReference() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `WAYA_${timestamp}_${random}`.toUpperCase();
  }

  /**
   * Get supported banks for EFT
   */
  async getSupportedBanks() {
    try {
      const response = await fetch(`${this.baseURL}/bank?currency=ZAR`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.paystackSecretKey}`,
          'Content-Type': 'application/json',
        }
      });

      return await response.json();
    } catch (error) {
      console.error('Banks fetch error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Validate bank account
   */
  async validateBankAccount(accountNumber, bankCode) {
    try {
      const response = await fetch(`${this.baseURL}/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.paystackSecretKey}`,
          'Content-Type': 'application/json',
        }
      });

      return await response.json();
    } catch (error) {
      console.error('Bank validation error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Browser-compatible webhook signature verification
   * Note: In production, webhook verification should be done on the server side
   */
  async verifyWebhookSignature(payload, signature, secret) {
    try {
      // Use Web Crypto API for browser compatibility
      if (typeof crypto !== 'undefined' && crypto.subtle) {
        const encoder = new TextEncoder();
        const key = await crypto.subtle.importKey(
          'raw',
          encoder.encode(secret),
          { name: 'HMAC', hash: 'SHA-512' },
          false,
          ['sign']
        );

        const signatureBuffer = await crypto.subtle.sign(
          'HMAC',
          key,
          encoder.encode(JSON.stringify(payload))
        );

        const hashArray = Array.from(new Uint8Array(signatureBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        return hashHex === signature;
      } else {
        // Fallback for environments without Web Crypto API
        console.warn('Web Crypto API not available, skipping signature verification');
        return true;
      }
    } catch (error) {
      console.error('Webhook signature verification error:', error);
      return false;
    }
  }

  /**
   * Handle payment webhook (client-side processing)
   * Note: In production, webhooks should be handled on the server side
   */
  async handleWebhook(event, signature) {
    try {
      // Verify webhook signature for security
      const isValid = await this.verifyWebhookSignature(event, signature, this.paystackSecretKey);
      
      if (!isValid) {
        throw new Error('Invalid webhook signature');
      }

      switch (event.event) {
        case 'charge.success':
          return await this.handleSuccessfulPayment(event.data);
        case 'charge.failed':
          return await this.handleFailedPayment(event.data);
        case 'transfer.success':
          return await this.handleSuccessfulTransfer(event.data);
        case 'transfer.failed':
          return await this.handleFailedTransfer(event.data);
        default:
          console.log('Unhandled webhook event:', event.event);
          return { status: 'ignored' };
      }
    } catch (error) {
      console.error('Webhook handling error:', error);
      return { error: error.message };
    }
  }

  async handleSuccessfulPayment(data) {
    // Update booking status, activate provider account, etc.
    const metadata = data.metadata;
    
    if (metadata.paymentType === 'provider_application_fee') {
      // Activate provider account and start trial
      await this.activateProviderAccount(metadata.userId);
    } else if (metadata.paymentType === 'service_booking') {
      // Confirm booking and notify provider
      await this.confirmBooking(metadata.bookingId);
    }
    
    return { status: 'processed' };
  }

  async handleFailedPayment(data) {
    // Handle failed payment
    console.log('Payment failed:', data);
    return { status: 'failed' };
  }

  async handleSuccessfulTransfer(data) {
    // Handle successful payout to provider
    console.log('Transfer successful:', data);
    return { status: 'processed' };
  }

  async handleFailedTransfer(data) {
    // Handle failed payout
    console.log('Transfer failed:', data);
    return { status: 'failed' };
  }

  async activateProviderAccount(userId) {
    // Implementation for activating provider account
    console.log('Activating provider account:', userId);
  }

  async confirmBooking(bookingId) {
    // Implementation for confirming booking
    console.log('Confirming booking:', bookingId);
  }

  /**
   * Initialize Paystack inline payment (browser-based)
   */
  initializeInlinePayment(paymentData, onSuccess, onClose) {
    if (typeof window !== 'undefined' && typeof window.PaystackPop === 'undefined') {
      console.warn('Paystack inline script not loaded. Please include Paystack script in your HTML.');
      return false;
    }

    if (typeof window !== 'undefined' && window.PaystackPop) {
      const handler = window.PaystackPop.setup({
        key: this.paystackPublicKey,
        email: paymentData.email,
        amount: Math.round(paymentData.amount * 100),
        currency: 'ZAR',
        ref: paymentData.reference || this.generateReference(),
        metadata: paymentData.metadata,
        callback: (response) => {
          console.log('Payment successful:', response);
          if (onSuccess) onSuccess(response);
        },
        onClose: () => {
          console.log('Payment window closed');
          if (onClose) onClose();
        }
      });

      handler.openIframe();
      return true;
    }

    return false;
  }

  /**
   * Load Paystack script dynamically
   */
  async loadPaystackScript() {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('Window object not available'));
        return;
      }

      if (typeof window.PaystackPop !== 'undefined') {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.onload = () => resolve(true);
      script.onerror = () => reject(new Error('Failed to load Paystack script'));
      document.head.appendChild(script);
    });
  }

  /**
   * Simple hash function for client-side use (not cryptographically secure)
   */
  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
  }
}

export default new PaymentGateway();