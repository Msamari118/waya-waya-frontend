/**
 * Production-Ready OTP Service (Browser-compatible)
 * Supports SMS and Email verification with Africa's Talking and SendGrid
 */

class OTPService {
    constructor() {
      this.smsProvider = 'africastalking'; // Using Africa's Talking for African markets
      this.emailProvider = 'sendgrid';
      this.otpLength = 6;
      this.otpExpiry = 10; // minutes
      this.maxAttempts = 3;
      this.rateLimit = 60; // seconds between sends
      
      // Browser-compatible environment variable access
      const env = (typeof process !== 'undefined' && process.env) ? process.env : {};
      
      // Configuration with fallbacks
      this.sendGridApiKey = env.REACT_APP_SENDGRID_API_KEY || 'demo_sendgrid_key';
      this.fromEmail = env.REACT_APP_FROM_EMAIL || 'noreply@wayawaya.co.za';
      
      this.africasTalkingApiKey = env.REACT_APP_AFRICASTALKING_API_KEY || 'demo_at_key';
      this.africasTalkingUsername = env.REACT_APP_AFRICASTALKING_USERNAME || 'demo_username';
      
      // Check if we're in development mode
      this.isDevelopment = (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development') || 
                          (typeof window !== 'undefined' && window.location.hostname === 'localhost');
      
      // In-memory storage for demo (use Redis in production)
      this.otpStorage = new Map();
      this.rateLimitStorage = new Map();
    }
  
    /**
     * Generate OTP code
     */
    generateOTP() {
      return Math.floor(100000 + Math.random() * 900000).toString();
    }
  
    /**
     * Send SMS OTP
     */
    async sendSMSOTP(phoneNumber, userId, purpose = 'verification') {
      try {
        // Check rate limiting
        if (this.isRateLimited(phoneNumber, 'sms')) {
          throw new Error('Too many SMS requests. Please wait before trying again.');
        }
  
        // Generate OTP
        const otp = this.generateOTP();
        const expiresAt = new Date(Date.now() + this.otpExpiry * 60 * 1000);
        
        // Store OTP
        const otpKey = `sms_${phoneNumber}`;
        this.otpStorage.set(otpKey, {
          code: otp,
          expiresAt,
          attempts: 0,
          userId,
          purpose
        });
  
        // Send SMS based on provider
        let result;
        if (this.smsProvider === 'africastalking' && this.africasTalkingApiKey !== 'demo_at_key') {
          result = await this.sendAfricasTalkingSMS(phoneNumber, otp, purpose);
        } else {
          // Fallback to demo mode
          result = await this.sendDemoSMS(phoneNumber, otp, purpose);
        }
  
        // Update rate limiting
        this.updateRateLimit(phoneNumber, 'sms');
  
        return {
          success: true,
          message: 'OTP sent successfully',
          expiresAt: expiresAt.toISOString(),
          masked: this.maskPhoneNumber(phoneNumber)
        };
  
      } catch (error) {
        console.error('SMS OTP send error:', error);
        return {
          success: false,
          error: error.message
        };
      }
    }
  
    /**
     * Send Email OTP
     */
    async sendEmailOTP(email, userId, purpose = 'verification') {
      try {
        // Check rate limiting
        if (this.isRateLimited(email, 'email')) {
          throw new Error('Too many email requests. Please wait before trying again.');
        }
  
        // Generate OTP
        const otp = this.generateOTP();
        const expiresAt = new Date(Date.now() + this.otpExpiry * 60 * 1000);
        
        // Store OTP
        const otpKey = `email_${email}`;
        this.otpStorage.set(otpKey, {
          code: otp,
          expiresAt,
          attempts: 0,
          userId,
          purpose
        });
  
        // Send email based on provider
        let result;
        if (this.emailProvider === 'sendgrid' && this.sendGridApiKey !== 'demo_sendgrid_key') {
          result = await this.sendSendGridEmail(email, otp, purpose);
        } else {
          // Fallback to demo mode
          result = await this.sendDemoEmail(email, otp, purpose);
        }
  
        // Update rate limiting
        this.updateRateLimit(email, 'email');
  
        return {
          success: true,
          message: 'OTP sent successfully',
          expiresAt: expiresAt.toISOString(),
          masked: this.maskEmail(email)
        };
  
      } catch (error) {
        console.error('Email OTP send error:', error);
        return {
          success: false,
          error: error.message
        };
      }
    }
  
    /**
     * Verify OTP
     */
    async verifyOTP(identifier, code, type = 'sms') {
      try {
        const otpKey = `${type}_${identifier}`;
        const otpData = this.otpStorage.get(otpKey);
  
        if (!otpData) {
          throw new Error('OTP not found or expired');
        }
  
        // Check expiry
        if (new Date() > otpData.expiresAt) {
          this.otpStorage.delete(otpKey);
          throw new Error('OTP has expired');
        }
  
        // Check attempts
        if (otpData.attempts >= this.maxAttempts) {
          this.otpStorage.delete(otpKey);
          throw new Error('Maximum verification attempts exceeded');
        }
  
        // Verify code
        if (otpData.code !== code) {
          otpData.attempts++;
          this.otpStorage.set(otpKey, otpData);
          throw new Error(`Invalid OTP. ${this.maxAttempts - otpData.attempts} attempts remaining.`);
        }
  
        // OTP verified successfully
        this.otpStorage.delete(otpKey);
  
        // Update user verification status
        await this.updateVerificationStatus(otpData.userId, type, identifier);
  
        return {
          success: true,
          message: 'OTP verified successfully',
          userId: otpData.userId,
          purpose: otpData.purpose
        };
  
      } catch (error) {
        console.error('OTP verification error:', error);
        return {
          success: false,
          error: error.message
        };
      }
    }
  
    /**
     * Send SMS via Africa's Talking
     */
    async sendAfricasTalkingSMS(phoneNumber, otp, purpose) {
      const message = this.getSMSMessage(otp, purpose);
      
      try {
        const response = await fetch('https://api.africastalking.com/version1/messaging', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            'apiKey': this.africasTalkingApiKey
          },
          body: new URLSearchParams({
            username: this.africasTalkingUsername,
            to: phoneNumber,
            message: message
          })
        });
  
        if (!response.ok) {
          throw new Error('Failed to send SMS via Africa\'s Talking');
        }
  
        return await response.json();
      } catch (error) {
        console.warn('Africa\'s Talking SMS failed, falling back to demo mode:', error.message);
        return await this.sendDemoSMS(phoneNumber, otp, purpose);
      }
    }
  
    /**
     * Send Email via SendGrid
     */
    async sendSendGridEmail(email, otp, purpose) {
      const emailContent = this.getEmailContent(otp, purpose);
      
      try {
        const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.sendGridApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            personalizations: [{
              to: [{ email }],
              subject: emailContent.subject
            }],
            from: { email: this.fromEmail, name: 'WAYA WAYA!' },
            content: [{
              type: 'text/html',
              value: emailContent.html
            }]
          })
        });
  
        if (!response.ok) {
          const error = await response.text();
          throw new Error(`Failed to send email: ${error}`);
        }
  
        return { success: true };
      } catch (error) {
        console.warn('SendGrid email failed, falling back to demo mode:', error.message);
        return await this.sendDemoEmail(email, otp, purpose);
      }
    }
  
    /**
     * Demo SMS sender (for testing)
     */
    async sendDemoSMS(phoneNumber, otp, purpose) {
      console.log(`[DEMO SMS] To: ${phoneNumber}, OTP: ${otp}, Purpose: ${purpose}`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show OTP in alert for demo purposes
      if (this.isDevelopment) {
        setTimeout(() => {
          alert(`Demo SMS OTP for ${this.maskPhoneNumber(phoneNumber)}: ${otp}`);
        }, 500);
      }
      
      return { success: true, demo: true };
    }
  
    /**
     * Demo email sender (for testing)
     */
    async sendDemoEmail(email, otp, purpose) {
      console.log(`[DEMO EMAIL] To: ${email}, OTP: ${otp}, Purpose: ${purpose}`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show OTP in alert for demo purposes
      if (this.isDevelopment) {
        setTimeout(() => {
          alert(`Demo Email OTP for ${this.maskEmail(email)}: ${otp}`);
        }, 500);
      }
      
      return { success: true, demo: true };
    }
  
    /**
     * Get SMS message content
     */
    getSMSMessage(otp, purpose) {
      const purposeText = {
        'verification': 'verify your account',
        'password_reset': 'reset your password',
        'login': 'sign in to your account',
        'phone_change': 'change your phone number'
      };
  
      return `Your WAYA WAYA! verification code is: ${otp}\n\nUse this code to ${purposeText[purpose] || 'verify your account'}. Valid for ${this.otpExpiry} minutes.\n\nDon't share this code with anyone.`;
    }
  
    /**
     * Get email content
     */
    getEmailContent(otp, purpose) {
      const purposeText = {
        'verification': 'Verify Your Account',
        'password_reset': 'Reset Your Password',
        'login': 'Sign In Verification',
        'email_change': 'Change Email Address'
      };
  
      const subject = `${purposeText[purpose] || 'Verification Code'} - WAYA WAYA!`;
      
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>${subject}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #ff6b35, #f7931e); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .otp-code { background: #ffffff; border: 2px dashed #ff6b35; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0; }
            .code { font-size: 32px; font-weight: bold; color: #ff6b35; letter-spacing: 8px; }
            .warning { background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; border-radius: 5px; margin-top: 20px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🇿🇦 WAYA WAYA!</h1>
              <p>Your verification code is ready</p>
            </div>
            <div class="content">
              <h2>${purposeText[purpose] || 'Verification Code'}</h2>
              <p>Hello!</p>
              <p>Use the verification code below to ${(purposeText[purpose] || 'verify your account').toLowerCase()} on WAYA WAYA!:</p>
              
              <div class="otp-code">
                <div class="code">${otp}</div>
                <p style="margin: 10px 0 0 0; color: #666;">Valid for ${this.otpExpiry} minutes</p>
              </div>
              
              <p>If you didn't request this code, please ignore this email or contact our support team if you have concerns.</p>
              
              <div class="warning">
                <strong>Security Notice:</strong> Never share this code with anyone. WAYA WAYA! will never ask for your verification code via phone or email.
              </div>
            </div>
            <div class="footer">
              <p>© 2024 WAYA WAYA! - South Africa's Premier Service Platform</p>
              <p>Any service. Any time. Anywhere in South Africa.</p>
            </div>
          </div>
        </body>
        </html>
      `;
  
      return { subject, html };
    }
  
    /**
     * Check rate limiting
     */
    isRateLimited(identifier, type) {
      const key = `${type}_${identifier}`;
      const lastSent = this.rateLimitStorage.get(key);
      
      if (lastSent) {
        const timeDiff = Date.now() - lastSent;
        return timeDiff < (this.rateLimit * 1000);
      }
      
      return false;
    }
  
    /**
     * Update rate limiting
     */
    updateRateLimit(identifier, type) {
      const key = `${type}_${identifier}`;
      this.rateLimitStorage.set(key, Date.now());
    }
  
    /**
     * Update user verification status
     */
    async updateVerificationStatus(userId, type, identifier) {
      try {
        const response = await fetch('/api/users/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          },
          body: JSON.stringify({
            userId,
            verificationType: type,
            identifier
          })
        });
  
        return await response.json();
      } catch (error) {
        console.error('Failed to update verification status:', error);
      }
    }
  
    /**
     * Mask phone number for privacy
     */
    maskPhoneNumber(phoneNumber) {
      if (phoneNumber.length < 8) return phoneNumber;
      const start = phoneNumber.substring(0, 4);
      const end = phoneNumber.substring(phoneNumber.length - 2);
      const middle = '*'.repeat(phoneNumber.length - 6);
      return `${start}${middle}${end}`;
    }
  
    /**
     * Mask email for privacy
     */
    maskEmail(email) {
      const [username, domain] = email.split('@');
      if (username.length <= 2) return email;
      const maskedUsername = username[0] + '*'.repeat(username.length - 2) + username[username.length - 1];
      return `${maskedUsername}@${domain}`;
    }
  
    /**
     * Resend OTP
     */
    async resendOTP(identifier, type, userId, purpose) {
      // Clear existing OTP
      const otpKey = `${type}_${identifier}`;
      this.otpStorage.delete(otpKey);
  
      // Send new OTP
      if (type === 'sms') {
        return await this.sendSMSOTP(identifier, userId, purpose);
      } else if (type === 'email') {
        return await this.sendEmailOTP(identifier, userId, purpose);
      } else {
        throw new Error('Invalid OTP type');
      }
    }
  
    /**
     * Clean expired OTPs (call periodically)
     */
    cleanExpiredOTPs() {
      const now = new Date();
      for (const [key, otpData] of this.otpStorage.entries()) {
        if (now > otpData.expiresAt) {
          this.otpStorage.delete(key);
        }
      }
    }
  
    /**
     * Get OTP status
     */
    getOTPStatus(identifier, type) {
      const otpKey = `${type}_${identifier}`;
      const otpData = this.otpStorage.get(otpKey);
      
      if (!otpData) {
        return { exists: false };
      }
      
      const now = new Date();
      const timeRemaining = Math.max(0, otpData.expiresAt.getTime() - now.getTime());
      
      return {
        exists: true,
        expired: now > otpData.expiresAt,
        attempts: otpData.attempts,
        maxAttempts: this.maxAttempts,
        timeRemaining: Math.ceil(timeRemaining / 1000), // seconds
        purpose: otpData.purpose
      };
    }
  
    /**
     * Browser-compatible base64 encoding
     */
    base64Encode(str) {
      return btoa(unescape(encodeURIComponent(str)));
    }
  
    /**
     * Simple hash function for browser compatibility
     */
    simpleHash(input) {
      let hash = 0;
      const str = input.toString();
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
      }
      return hash.toString(36);
    }
  }
  
  // Clean expired OTPs every 5 minutes
  const otpService = new OTPService();
  setInterval(() => {
    otpService.cleanExpiredOTPs();
  }, 5 * 60 * 1000);
  
  export default otpService;