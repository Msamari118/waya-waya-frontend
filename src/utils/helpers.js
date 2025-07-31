// Password validation function
export const validatePassword = (password) => {
  const minLength = password.length >= 8;
  const hasDigit = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  return {
    isValid: minLength && hasDigit && hasSpecialChar,
    minLength,
    hasDigit,
    hasSpecialChar
  };
};

// Admin access functions
export const checkAdminAccess = () => {
  // Check URL parameters for admin access
  const urlParams = new URLSearchParams(window.location.search);
  const adminKey = urlParams.get('admin');
  const storedAdminAccess = localStorage.getItem('adminAccess');
  
  // Allow admin access with URL parameter ?admin=wayawaya2024 or if previously authenticated
  return adminKey === 'wayawaya2024' || storedAdminAccess === 'true';
};

export const setAdminAccess = (access) => {
  localStorage.setItem('adminAccess', access.toString());
};

// OTP Functions
export const createOtpFunctions = (apiClient, setOtpState) => {
  const sendPhoneOtp = async (phoneData) => {
    setOtpState(prev => ({ ...prev, otpLoading: true, otpError: '' }));
    
    try {
      const response = await apiClient.auth.sendPhoneOtp(phoneData);
      if (response.ok) {
        setOtpState(prev => ({ 
          ...prev, 
          phoneOtpSent: true, 
          otpLoading: false,
          resendCooldown: 60 
        }));
        
        // Start cooldown timer
        const interval = setInterval(() => {
          setOtpState(prev => {
            if (prev.resendCooldown <= 1) {
              clearInterval(interval);
              return { ...prev, resendCooldown: 0 };
            }
            return { ...prev, resendCooldown: prev.resendCooldown - 1 };
          });
        }, 1000);
        
        return { success: true };
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send OTP');
      }
    } catch (error) {
      setOtpState(prev => ({ 
        ...prev, 
        otpLoading: false, 
        otpError: error.message 
      }));
      return { success: false, error: error.message };
    }
  };

  const verifyPhoneOtp = async (otpData) => {
    setOtpState(prev => ({ ...prev, otpLoading: true, otpError: '' }));
    
    try {
      const response = await apiClient.auth.verifyPhoneOtp(otpData);
      if (response.ok) {
        setOtpState(prev => ({ 
          ...prev, 
          phoneOtpVerified: true, 
          otpLoading: false 
        }));
        return { success: true };
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Invalid OTP');
      }
    } catch (error) {
      setOtpState(prev => ({ 
        ...prev, 
        otpLoading: false, 
        otpError: error.message 
      }));
      return { success: false, error: error.message };
    }
  };

  const resendPhoneOtp = async (phoneData, otpState) => {
    if (otpState.resendCooldown > 0) return;
    return await sendPhoneOtp(phoneData);
  };

  const verifyEmail = async (emailData) => {
    setOtpState(prev => ({ ...prev, otpLoading: true, otpError: '' }));
    
    try {
      const response = await apiClient.auth.verifyEmail(emailData);
      if (response.ok) {
        setOtpState(prev => ({ 
          ...prev, 
          emailVerified: true, 
          otpLoading: false 
        }));
        return { success: true };
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Email verification failed');
      }
    } catch (error) {
      setOtpState(prev => ({ 
        ...prev, 
        otpLoading: false, 
        otpError: error.message 
      }));
      return { success: false, error: error.message };
    }
  };

  return {
    sendPhoneOtp,
    verifyPhoneOtp,
    resendPhoneOtp,
    verifyEmail
  };
};

// Registration validation
export const validateRegistrationStep = (registrationData, step) => {
  const errors = {};
  
  switch (step) {
    case 1: // Personal Information
      if (!registrationData.firstName.trim()) {
        errors.firstName = 'First name is required';
      }
      if (!registrationData.lastName.trim()) {
        errors.lastName = 'Last name is required';
      }
      if (!registrationData.email.trim()) {
        errors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registrationData.email)) {
        errors.email = 'Please enter a valid email address';
      }
      if (!registrationData.phone.trim()) {
        errors.phone = 'Phone number is required';
      }
      if (!registrationData.idNumber.trim()) {
        errors.idNumber = 'ID number is required';
      }
      break;
      
    case 2: // Service Information
      if (!registrationData.primaryService) {
        errors.primaryService = 'Please select your primary service';
      }
      if (!registrationData.serviceDescription.trim()) {
        errors.serviceDescription = 'Service description is required';
      }
      break;
      
    case 3: // Location & Availability
      if (!registrationData.address.trim()) {
        errors.address = 'Address is required';
      }
      if (!registrationData.city.trim()) {
        errors.city = 'City is required';
      }
      if (!registrationData.province) {
        errors.province = 'Province is required';
      }
      if (!registrationData.postalCode.trim()) {
        errors.postalCode = 'Postal code is required';
      }
      break;
      
    case 4: // Pricing & Experience
      if (!registrationData.hourlyRate || registrationData.hourlyRate <= 0) {
        errors.hourlyRate = 'Please enter a valid hourly rate';
      }
      if (!registrationData.experienceYears || registrationData.experienceYears < 0) {
        errors.experienceYears = 'Please enter your years of experience';
      }
      break;
      
    case 5: // Terms & Payment
      if (!registrationData.agreeToTerms) {
        errors.agreeToTerms = 'You must agree to the terms and conditions';
      }
      if (!registrationData.agreeToBackgroundCheck) {
        errors.agreeToBackgroundCheck = 'Background check consent is required';
      }
      break;
  }
  
  return errors;
};

// Connection retry function
export const createConnectionRetryFunction = (apiClient, setIsConnected, setConnectionError) => {
  return async () => {
    setConnectionError('');
    try {
      const connected = await apiClient.testConnection();
      setIsConnected(connected);
      if (connected === 'demo') {
        setConnectionError('Demo mode active - all functionality is simulated for testing');
      } else if (!connected) {
        setConnectionError('Connection failed - running in offline mode');
      } else {
        setConnectionError('');
      }
    } catch (error) {
      // Silent fallback
      setIsConnected('demo');
      setConnectionError('Demo mode active - all functionality is simulated for testing');
    }
  };
};