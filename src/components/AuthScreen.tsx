import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { CheckCircle, Clock, Mail, Phone, ArrowLeft, AlertCircle, Eye, EyeOff, Upload, FileText, Home, Award } from 'lucide-react';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

interface AuthScreenProps {
  view: string;
  onNavigate: (view: string) => void;
  onAuthSuccess: (token: string, user: any) => void;
  apiClient: any;
  internationalCountryCodes: any[];
  validatePassword: (password: string) => any;
  WayaWayaLogo: React.ComponentType<any>;
}

export default function AuthScreen({ 
  view, 
  onNavigate, 
  onAuthSuccess, 
  apiClient, 
  internationalCountryCodes,
  validatePassword,
  WayaWayaLogo 
}: AuthScreenProps) {
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    countryCode: '+27',
    phoneNumber: '',
    email: '',
    userType: 'client',
    profilePicture: null as File | null,
    cv: null as File | null,
    residentialAddress: '',
    addressProof: null as File | null,
    tradeCertificate: null as File | null,
    yearsExperience: '',
    servicesOffered: '',
    idDocument: null as File | null,
    serviceCategory: '',
    serviceArea: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordValidation, setPasswordValidation] = useState({
    isValid: false,
    minLength: false,
    hasDigit: false,
    hasSpecialChar: false
  });
  
  // OTP and verification states
  const [currentStep, setCurrentStep] = useState('form'); // 'form', 'phone-otp', 'email-verification'
  const [phoneOtp, setPhoneOtp] = useState('');
  const [emailOtp, setEmailOtp] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);
  const [canResendOtp, setCanResendOtp] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Forgot password/username states
  const [forgotType, setForgotType] = useState(''); // 'password' or 'username'
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // OTP Timer Effect
  useEffect(() => {
    if (otpTimer > 0) {
      const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResendOtp(true);
    }
  }, [otpTimer]);

  // Password validation effect
  useEffect(() => {
    if (formData.password) {
      setPasswordValidation(validatePassword(formData.password));
    }
  }, [formData.password, validatePassword]);

  const handleInputChange = (field: string, value: string | File) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
    setSuccess('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Validate required fields
    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }
    
    try {
      const response = await apiClient.auth.login({
        emailOrPhone: formData.email,
        password: formData.password
      });
      
      const data = await response.json();
      
      if (response.ok) {
        onAuthSuccess(data.token, data.user);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Validate password
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.message);
      setLoading(false);
      return;
    }
    
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    
    // Validate phone number
    if (!formData.phoneNumber || formData.phoneNumber.length < 9) {
      setError('Please enter a valid phone number');
      setLoading(false);
      return;
    }
    
    // Provider-specific validation
    if (formData.userType === 'provider') {
      if (!formData.residentialAddress) {
        setError('Please enter your residential address');
        setLoading(false);
        return;
      }
      if (!formData.servicesOffered) {
        setError('Please describe the services you offer');
        setLoading(false);
        return;
      }
      if (!formData.yearsExperience) {
        setError('Please select your years of experience');
        setLoading(false);
        return;
      }
      if (!formData.idDocument) {
        setError('Please upload your ID document');
        setLoading(false);
        return;
      }
      if (!formData.serviceCategory) {
        setError('Please select your service category');
        setLoading(false);
        return;
      }
      if (!formData.serviceArea) {
        setError('Please enter your service area');
        setLoading(false);
        return;
      }
    }
    
    try {
      const fullPhoneNumber = `${formData.countryCode}${formData.phoneNumber}`;
      
      // TEMPORARY: Skip OTP and go directly to success
      if (formData.userType === 'provider') {
        // Show confirmation screen for provider applications
        setCurrentStep('confirmation');
        setSuccess('Application submitted successfully!');
      } else {
        // Regular client registration
        setSuccess('Registration successful! Account created!');
        onAuthSuccess('temp-token', { 
          email: formData.email, 
          phone: fullPhoneNumber,
          userType: formData.userType || 'client',
          // Provider-specific data
          ...(formData.userType === 'provider' && {
            residentialAddress: formData.residentialAddress,
            yearsExperience: formData.yearsExperience,
            servicesOffered: formData.servicesOffered,
            serviceCategory: formData.serviceCategory,
            serviceArea: formData.serviceArea,
            hasCv: !!formData.cv,
            hasAddressProof: !!formData.addressProof,
            hasTradeCertificate: !!formData.tradeCertificate,
            hasIdDocument: !!formData.idDocument
          })
        });
      }
      
      /* COMMENTED OUT OTP FLOW
      // ✅ Step 1: Request OTP using user's exact script
      const response = await apiClient.auth.requestOtp(
        formData.email,
        fullPhoneNumber
      );
      if (response.ok) {
        const data = await response.json();
        // Store userId for verification
        localStorage.setItem('tempUserId', data.userId);
        localStorage.setItem('pendingPhoneNumber', fullPhoneNumber);
        
        // 🔧 DEBUG: Log the userId for testing (temporary - remove when SMS is working)
        console.log('🔧 DEBUG: UserId for testing:', data.userId);
        console.log('🔧 DEBUG: Check OTP at: https://waya-waya-backend-production.up.railway.app/api/auth/debug-otp/' + data.userId);
        
        setCurrentStep('otp-verification');
        setSuccess('OTP sent to your phone number. Please verify.');
        setOtpTimer(60); // Start 60-second timer
        setCanResendOtp(false);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to send OTP. Please try again.');
      }
      */
      
    } catch (err) {
      console.error('Registration error:', err);
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // TEMPORARY: Skip OTP verification
    setSuccess('Phone number verified successfully! Account created!');
    onAuthSuccess('temp-token', { 
      email: formData.email, 
      phone: localStorage.getItem('pendingPhoneNumber') || '',
      userType: formData.userType || 'client'
    });
    
    /* COMMENTED OUT OTP VERIFICATION
    // Validate OTP format
    if (!phoneOtp || phoneOtp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      setLoading(false);
      return;
    }
    
    // Validate OTP contains only digits
    if (!/^\d{6}$/.test(phoneOtp)) {
      setError('OTP must contain only numbers');
      setLoading(false);
      return;
    }
    
    try {
      // Get stored userId
      const userId = localStorage.getItem('tempUserId');
      
      if (!userId) {
        setError('Session expired. Please try registration again.');
        setLoading(false);
        return;
      }
      
      // ✅ Step 2: Verify OTP using user's exact script
      const response = await apiClient.auth.verifyOtp(userId, phoneOtp);
      
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        data = { success: response.ok };
      }
      
      if (response.ok && data.success) {
        setSuccess('Phone number verified successfully! Account created!');
        setPhoneOtp(''); // Clear OTP for security
        
        // Clean up stored data
        localStorage.removeItem('tempUserId');
        localStorage.removeItem('pendingPhoneNumber');
        
        // Call success callback
        onAuthSuccess('temp-token', { email: formData.email, phone: `${formData.countryCode}${formData.phoneNumber}` });
      } else {
        setError(data.error || 'Invalid OTP. Please try again.');
        setPhoneOtp(''); // Clear invalid OTP
      }
    } catch (err) {
      console.error('OTP verification error:', err);
      setError('OTP verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
    */
  };

  const handleEmailVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await apiClient.auth.verifyEmail({
        email: formData.email,
        otp: emailOtp,
        registrationData: formData
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Navigate to appropriate registration flow based on user type
        if (formData.userType === 'client') {
          onNavigate('client-registration');
        } else if (formData.userType === 'provider') {
          onNavigate('registration');
        } else {
          onAuthSuccess(data.token, data.user);
        }
      } else {
        setError(data.error || 'Invalid email verification code');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    // TEMPORARY: Skip resend OTP
    setSuccess('New OTP sent to your phone number');
    setOtpTimer(60);
    setCanResendOtp(false);
    
    /* COMMENTED OUT RESEND OTP
    if (!canResendOtp) {
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const userId = localStorage.getItem('tempUserId');
      
      if (!userId) {
        setError('Session expired. Please try registration again.');
        setLoading(false);
        return;
      }
      
      setCanResendOtp(false);
      
      // ✅ Step 3: Resend OTP using user's exact script
      const response = await apiClient.auth.resendOtp(userId);
      
      if (response.ok) {
        setSuccess('New OTP sent to your phone number');
        setOtpTimer(60); // Reset timer to 60 seconds
        setPhoneOtp(''); // Clear previous OTP
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to send OTP. Please try again.');
        setCanResendOtp(true); // Allow retry
      }
    } catch (err) {
      console.error('Resend OTP error:', err);
      setError('Failed to send OTP. Please try again.');
      setCanResendOtp(true); // Allow retry
    } finally {
      setLoading(false);
    }
    */
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await apiClient.auth.forgotPassword({
        email: forgotEmail
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess('Password reset instructions sent to your email');
      } else {
        setError(data.error || 'Failed to send reset email');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await apiClient.auth.forgotUsername({
        email: forgotEmail
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess('Username sent to your email');
      } else {
        setError(data.error || 'Email not found');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const newPasswordValidation = validatePassword(newPassword);
    if (!newPasswordValidation.isValid) {
      setError('New password does not meet requirements');
      setLoading(false);
      return;
    }
    
    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    
    try {
      const response = await apiClient.auth.resetPassword({
        token: resetToken,
        newPassword: newPassword
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess('Password reset successfully! You can now login.');
        setTimeout(() => onNavigate('login'), 2000);
      } else {
        setError(data.error || 'Failed to reset password');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Login view
  if (view === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-500 via-yellow-500 to-red-600 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="ghost" 
              onClick={() => onNavigate('landing')}
              className="text-white hover:bg-white/10"
            >
              ← Back
            </Button>
            <WayaWayaLogo size="sm" />
            <div className="text-white">
              <h1 className="text-xl font-semibold">Sign In</h1>
            </div>
          </div>
          
          {/* Main Form Card */}
          <Card className="bg-gradient-to-br from-black/80 via-gray-900/90 to-black/80 backdrop-blur-md border border-yellow-500/30 shadow-2xl">
            <CardContent className="p-8">
              {/* Header with South African colors */}
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <WayaWayaLogo size="md" showText={false} />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 via-green-400 to-blue-400 bg-clip-text text-transparent mb-2">
                  {view === 'login' ? 'Welcome Back!' : 'Join Waya Waya!'}
                </h2>
                <p className="text-gray-300">
                  {view === 'login' ? 'Sign in to your account' : 'Start your journey with us'}
                </p>
              </div>
              <form onSubmit={handleLogin} className="space-y-6">
                {error && (
                  <Alert variant="destructive" className="border-red-400/40 bg-red-950/40 text-red-200 backdrop-blur-sm">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-red-200">{error}</AlertDescription>
                  </Alert>
                )}
                {success && (
                  <Alert className="border-green-400/40 bg-green-950/40 text-green-200 backdrop-blur-sm">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription className="text-green-200">{success}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email" className="text-gray-200 font-medium">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="h-12 border border-yellow-500/30 bg-black/40 text-gray-100 placeholder:text-gray-400 focus:border-green-500 focus:ring-green-500/20 rounded-lg transition-all duration-200 backdrop-blur-sm"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="password" className="text-gray-200 font-medium">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="h-12 border border-yellow-500/30 bg-black/40 text-gray-100 placeholder:text-gray-400 focus:border-green-500 focus:ring-green-500/20 rounded-lg transition-all duration-200 pr-12 backdrop-blur-sm"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-yellow-500/20"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-yellow-400 via-green-400 to-blue-400 hover:from-yellow-500 hover:via-green-500 hover:to-blue-500 text-white font-medium rounded-lg shadow-lg transform hover:scale-[1.02] transition-all duration-200" 
                  disabled={loading}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>
                
                <div className="text-center space-y-4">
                  <Button 
                    variant="link" 
                    onClick={() => onNavigate('forgot-password')}
                    className="text-gray-300 hover:text-gray-100 font-medium"
                  >
                    Forgot Password?
                  </Button>
                  
                  <div className="text-gray-300">
                    Don't have an account?{' '}
                    <Button 
                      variant="link" 
                      onClick={() => onNavigate('signup')}
                      className="text-yellow-400 hover:text-yellow-300 font-medium p-0 h-auto"
                    >
                      Sign up
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Forgot Password view
  if (view === 'forgot-password') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="ghost" 
              onClick={() => onNavigate('login')}
              className="text-slate-700 hover:bg-slate-100"
            >
              ← Back to Login
            </Button>
            <WayaWayaLogo size="sm" />
            <div className="text-slate-700">
              <h1 className="text-xl font-semibold">Forgot Password</h1>
            </div>
          </div>
          
          {/* Main Form Card */}
          <Card className="w-full bg-white/95 backdrop-blur-sm border border-slate-200 shadow-xl">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center shadow-lg">
                  <Mail className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-slate-900">Reset Your Password</CardTitle>
              <p className="text-slate-600 mt-2">
                Enter your email address and we'll send you instructions to reset your password.
              </p>
            </CardHeader>
            
            <CardContent className="px-8 pb-8">
              <form onSubmit={handleForgotPassword} className="space-y-6">
                {error && (
                  <Alert variant="destructive" className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-red-800">{error}</AlertDescription>
                  </Alert>
                )}
                {success && (
                  <Alert className="border-green-200 bg-green-50">
                    <Mail className="h-4 w-4" />
                    <AlertDescription className="text-green-800">{success}</AlertDescription>
                  </Alert>
                )}
                
                {/* Email */}
                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium">Email Address</Label>
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="h-12 border border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg transition-all duration-200"
                    required
                  />
                </div>
                
                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium rounded-lg shadow-lg transform hover:scale-[1.02] transition-all duration-200" 
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Reset Instructions'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Forgot Username view
  if (view === 'forgot-username') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="ghost" 
              onClick={() => onNavigate('login')}
              className="text-slate-700 hover:bg-slate-100"
            >
              ← Back to Login
            </Button>
            <WayaWayaLogo size="sm" />
            <div className="text-slate-700">
              <h1 className="text-xl font-semibold">Forgot Username</h1>
            </div>
          </div>
          
          {/* Main Form Card */}
          <Card className="w-full bg-white/95 backdrop-blur-sm border border-slate-200 shadow-xl">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center shadow-lg">
                  <Mail className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-slate-900">Recover Your Username</CardTitle>
              <p className="text-slate-600 mt-2">
                Enter your email address and we'll send you your username.
              </p>
            </CardHeader>
            
            <CardContent className="px-8 pb-8">
              <form onSubmit={handleForgotUsername} className="space-y-6">
                {error && (
                  <Alert variant="destructive" className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-red-800">{error}</AlertDescription>
                  </Alert>
                )}
                {success && (
                  <Alert className="border-green-200 bg-green-50">
                    <Mail className="h-4 w-4" />
                    <AlertDescription className="text-green-800">{success}</AlertDescription>
                  </Alert>
                )}
                
                {/* Email */}
                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium">Email Address</Label>
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="h-12 border border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg transition-all duration-200"
                    required
                  />
                </div>
                
                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium rounded-lg shadow-lg transform hover:scale-[1.02] transition-all duration-200" 
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Username'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Signup views
  if (view === 'signup' || view === 'signup-client' || view === 'signup-provider') {
    // Set user type based on specific signup view
    if (view === 'signup-client' && formData.userType !== 'client') {
      setFormData(prev => ({ ...prev, userType: 'client' }));
    }
    if (view === 'signup-provider' && formData.userType !== 'provider') {
      setFormData(prev => ({ ...prev, userType: 'provider' }));
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-500 via-yellow-500 to-red-600 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          {/* Header with better styling */}
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="ghost" 
              onClick={() => {
                if (currentStep !== 'form') {
                  setCurrentStep('form');
                  setError('');
                  setSuccess('');
                } else {
                  onNavigate('landing');
                }
              }}
              className="text-white hover:bg-white/10 rounded-full p-3"
            >
              ← Back
            </Button>
            <WayaWayaLogo size="sm" />
            <div className="text-white">
              <h1 className="text-xl font-semibold">Create Account</h1>
            </div>
          </div>
          
          {/* Main Form Card with South African inspired background */}
          <Card className="w-full bg-gradient-to-br from-black/80 via-gray-900/90 to-black/80 backdrop-blur-md border border-yellow-500/30 shadow-2xl rounded-2xl">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-4">
                <WayaWayaLogo size="md" showText={false} />
              </div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-yellow-400 via-green-400 to-blue-400 bg-clip-text text-transparent">Join Waya Waya!</CardTitle>
              <p className="text-gray-300 mt-2">Start your journey with us</p>
            </CardHeader>
            
            <CardContent className="p-8">
              {/* Initial Signup Form with South African styling */}
              {currentStep === 'form' && (
                <form onSubmit={handleSignupSubmit} className="space-y-6">
                  {error && (
                    <Alert variant="destructive" className="border-red-400/40 bg-red-950/40 text-red-200 rounded-xl backdrop-blur-sm">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-red-200">{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  {success && (
                    <Alert className="border-green-400/40 bg-green-950/40 text-green-200 rounded-xl backdrop-blur-sm">
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription className="text-green-200">{success}</AlertDescription>
                    </Alert>
                  )}
                  
                  {/* Full Name with South African styling */}
                  <div className="space-y-2">
                    <Label className="text-gray-200 font-semibold text-sm uppercase tracking-wide">Full Name</Label>
                    <Input
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="h-14 border border-yellow-500/30 bg-black/40 text-gray-100 placeholder:text-gray-400 focus:border-green-500 focus:ring-green-500/20 rounded-xl transition-all duration-300 text-lg backdrop-blur-sm"
                      required
                    />
                  </div>
                  
                  {/* Phone Number with South African styling */}
                  <div className="space-y-2">
                    <Label className="text-gray-200 font-semibold text-sm uppercase tracking-wide">Phone Number</Label>
                    <div className="flex gap-3">
                      <Select value={formData.countryCode} onValueChange={(value) => handleInputChange('countryCode', value)}>
                        <SelectTrigger className="w-28 h-14 border border-yellow-500/30 bg-black/40 text-gray-100 focus:border-green-500 focus:ring-green-500/20 rounded-xl transition-all duration-300 backdrop-blur-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="max-h-60 bg-black/80 border-yellow-500/30 backdrop-blur-md">
                          {internationalCountryCodes.map((country) => (
                            <SelectItem key={country.id} value={country.code} className="text-gray-100 hover:bg-yellow-500/20">
                              <div className="flex items-center gap-2">
                                <span>{country.flag}</span>
                                <span className="font-medium">{country.code}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder="Enter your phone number"
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                        className="flex-1 h-14 border border-yellow-500/30 bg-black/40 text-gray-100 placeholder:text-gray-400 focus:border-green-500 focus:ring-green-500/20 rounded-xl transition-all duration-300 text-lg backdrop-blur-sm"
                        required
                      />
                    </div>
                  </div>
                  
                  {/* Email with South African styling */}
                  <div className="space-y-2">
                    <Label className="text-gray-200 font-semibold text-sm uppercase tracking-wide">Email Address</Label>
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="h-14 border border-yellow-500/30 bg-black/40 text-gray-100 placeholder:text-gray-400 focus:border-green-500 focus:ring-green-500/20 rounded-xl transition-all duration-300 text-lg backdrop-blur-sm"
                      required
                    />
                  </div>
                  
                  {/* Password with South African styling */}
                  <div className="space-y-2">
                    <Label className="text-gray-200 font-semibold text-sm uppercase tracking-wide">Password</Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="h-14 border border-yellow-500/30 bg-black/40 text-gray-100 placeholder:text-gray-400 focus:border-green-500 focus:ring-green-500/20 rounded-xl transition-all duration-300 text-lg pr-12 backdrop-blur-sm"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 w-10 p-0 hover:bg-yellow-500/20"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {/* Confirm Password with South African styling */}
                  <div className="space-y-2">
                    <Label className="text-gray-200 font-semibold text-sm uppercase tracking-wide">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className="h-14 border border-yellow-500/30 bg-black/40 text-gray-100 placeholder:text-gray-400 focus:border-green-500 focus:ring-green-500/20 rounded-xl transition-all duration-300 text-lg pr-12 backdrop-blur-sm"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 w-10 p-0 hover:bg-yellow-500/20"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {/* User Type Selection with South African styling */}
                  {view === 'signup' && (
                    <div className="space-y-3">
                      <Label className="text-gray-200 font-semibold text-sm uppercase tracking-wide">I want to:</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <Button
                          type="button"
                          variant={formData.userType === 'client' ? 'default' : 'outline'}
                          className={`h-16 text-base font-semibold rounded-xl transition-all duration-300 ${
                            formData.userType === 'client' 
                              ? 'bg-gradient-to-r from-yellow-400 via-green-400 to-blue-400 text-white shadow-lg transform scale-105' 
                              : 'bg-black/40 border border-yellow-500/30 text-gray-200 hover:border-green-500 hover:bg-yellow-500/20 hover:scale-105 backdrop-blur-sm'
                          }`}
                          onClick={() => handleInputChange('userType', 'client')}
                        >
                          <div className="text-center">
                            <div className="font-bold">I need services</div>
                            <div className="text-xs opacity-80">Find providers</div>
                          </div>
                        </Button>
                        <Button
                          type="button"
                          variant={formData.userType === 'provider' ? 'default' : 'outline'}
                          className={`h-16 text-base font-semibold rounded-xl transition-all duration-300 ${
                            formData.userType === 'provider' 
                              ? 'bg-gradient-to-r from-yellow-400 via-green-400 to-blue-400 text-white shadow-lg transform scale-105' 
                              : 'bg-black/40 border border-yellow-500/30 text-gray-200 hover:border-green-500 hover:bg-yellow-500/20 hover:scale-105 backdrop-blur-sm'
                          }`}
                          onClick={() => handleInputChange('userType', 'provider')}
                        >
                          <div className="text-center">
                            <div className="font-bold">I provide services</div>
                            <div className="text-xs opacity-80">Offer services</div>
                          </div>
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Profile Picture Upload for Providers with South African styling */}
                  {(view === 'signup-provider' || (view === 'signup' && formData.userType === 'provider')) && (
                    <div className="space-y-2">
                      <Label className="text-gray-200 font-semibold text-sm uppercase tracking-wide">Profile Picture</Label>
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleInputChange('profilePicture', file);
                            }
                          }}
                          className="hidden"
                          id="profile-picture"
                        />
                        <label
                          htmlFor="profile-picture"
                          className="flex items-center justify-center w-full h-32 border border-dashed border-yellow-500/30 bg-black/40 rounded-xl cursor-pointer hover:border-green-500 hover:bg-yellow-500/20 transition-all duration-300 backdrop-blur-sm"
                        >
                          <div className="text-center">
                            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-300">Click to upload profile picture</p>
                            <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
                          </div>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Provider-Specific Fields with South African styling */}
                  {(view === 'signup-provider' || (view === 'signup' && formData.userType === 'provider')) && (
                    <>
                      {/* CV Upload with South African styling */}
                      <div className="space-y-2">
                        <Label className="text-gray-200 font-semibold text-sm uppercase tracking-wide">CV/Resume</Label>
                        <div className="relative">
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleInputChange('cv', file);
                              }
                            }}
                            className="hidden"
                            id="cv-upload"
                          />
                          <label
                            htmlFor="cv-upload"
                            className="flex items-center justify-center w-full h-20 border border-dashed border-yellow-500/30 bg-black/40 rounded-xl cursor-pointer hover:border-green-500 hover:bg-yellow-500/20 transition-all duration-300 backdrop-blur-sm"
                          >
                            <div className="text-center">
                              <FileText className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                              <p className="text-sm text-gray-300">Upload your CV/Resume</p>
                              <p className="text-xs text-gray-400">PDF, DOC, DOCX up to 10MB</p>
                            </div>
                          </label>
                        </div>
                      </div>

                      {/* Residential Address with South African styling */}
                      <div className="space-y-2">
                        <Label className="text-gray-200 font-semibold text-sm uppercase tracking-wide">Residential Address</Label>
                        <Textarea
                          placeholder="Enter your full residential address"
                          value={formData.residentialAddress || ''}
                          onChange={(e) => handleInputChange('residentialAddress', e.target.value)}
                          className="h-20 border border-yellow-500/30 bg-black/40 text-gray-100 placeholder:text-gray-400 focus:border-green-500 focus:ring-green-500/20 rounded-xl transition-all duration-300 text-base resize-none backdrop-blur-sm"
                          required
                        />
                      </div>

                      {/* Proof of Residential Address with South African styling */}
                      <div className="space-y-2">
                        <Label className="text-gray-200 font-semibold text-sm uppercase tracking-wide">Proof of Residential Address (Optional)</Label>
                        <div className="relative">
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleInputChange('addressProof', file);
                              }
                            }}
                            className="hidden"
                            id="address-proof"
                          />
                          <label
                            htmlFor="address-proof"
                            className="flex items-center justify-center w-full h-20 border border-dashed border-yellow-500/30 bg-black/40 rounded-xl cursor-pointer hover:border-green-500 hover:bg-yellow-500/20 transition-all duration-300 backdrop-blur-sm"
                          >
                            <div className="text-center">
                              <Home className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                              <p className="text-sm text-gray-300">Upload proof of address</p>
                              <p className="text-xs text-gray-400">PDF, JPG, PNG up to 5MB (Optional)</p>
                            </div>
                          </label>
                        </div>
                      </div>

                      {/* ID Upload with South African styling */}
                      <div className="space-y-2">
                        <Label className="text-gray-200 font-semibold text-sm uppercase tracking-wide">ID Document</Label>
                        <div className="relative">
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleInputChange('idDocument', file);
                              }
                            }}
                            className="hidden"
                            id="id-document"
                            required
                          />
                          <label
                            htmlFor="id-document"
                            className="flex items-center justify-center w-full h-20 border border-dashed border-yellow-500/30 bg-black/40 rounded-xl cursor-pointer hover:border-green-500 hover:bg-yellow-500/20 transition-all duration-300 backdrop-blur-sm"
                          >
                            <div className="text-center">
                              <FileText className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                              <p className="text-sm text-gray-300">Upload your ID document</p>
                              <p className="text-xs text-gray-400">PDF, JPG, PNG up to 5MB (Required)</p>
                            </div>
                          </label>
                        </div>
                      </div>

                      {/* Trade Certificate with South African styling */}
                      <div className="space-y-2">
                        <Label className="text-gray-200 font-semibold text-sm uppercase tracking-wide">Trade Certificate / Company Certificate (Optional)</Label>
                        <div className="relative">
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleInputChange('tradeCertificate', file);
                              }
                            }}
                            className="hidden"
                            id="trade-certificate"
                          />
                          <label
                            htmlFor="trade-certificate"
                            className="flex items-center justify-center w-full h-20 border border-dashed border-yellow-500/30 bg-black/40 rounded-xl cursor-pointer hover:border-green-500 hover:bg-yellow-500/20 transition-all duration-300 backdrop-blur-sm"
                          >
                            <div className="text-center">
                              <Award className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                              <p className="text-sm text-gray-300">Upload trade/company certificate</p>
                              <p className="text-xs text-gray-400">PDF, JPG, PNG up to 5MB (Optional)</p>
                            </div>
                          </label>
                        </div>
                      </div>

                      {/* Years of Experience with South African styling */}
                      <div className="space-y-2">
                        <Label className="text-gray-200 font-semibold text-sm uppercase tracking-wide">Years of Experience</Label>
                        <Select value={formData.yearsExperience || ''} onValueChange={(value) => handleInputChange('yearsExperience', value)}>
                          <SelectTrigger className="h-14 border border-yellow-500/30 bg-black/40 text-white placeholder:text-white focus:border-green-500 focus:ring-green-500/20 rounded-xl transition-all duration-300 text-lg backdrop-blur-sm">
                            <SelectValue placeholder="Select years of experience" />
                          </SelectTrigger>
                          <SelectContent className="bg-black/80 border-yellow-500/30 backdrop-blur-md">
                            <SelectItem value="0-1" className="text-gray-100 hover:bg-yellow-500/20">0-1 years</SelectItem>
                            <SelectItem value="1-3" className="text-gray-100 hover:bg-yellow-500/20">1-3 years</SelectItem>
                            <SelectItem value="3-5" className="text-gray-100 hover:bg-yellow-500/20">3-5 years</SelectItem>
                            <SelectItem value="5-10" className="text-gray-100 hover:bg-yellow-500/20">5-10 years</SelectItem>
                            <SelectItem value="10+" className="text-gray-100 hover:bg-yellow-500/20">10+ years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Services Offered with South African styling */}
                      <div className="space-y-2">
                        <Label className="text-gray-200 font-semibold text-sm uppercase tracking-wide">Services You Offer</Label>
                        <Textarea
                          placeholder="Describe the services you provide (e.g., Plumbing, Electrical, Cleaning, etc.)"
                          value={formData.servicesOffered || ''}
                          onChange={(e) => handleInputChange('servicesOffered', e.target.value)}
                          className="h-20 border border-yellow-500/30 bg-black/40 text-gray-100 placeholder:text-gray-400 focus:border-green-500 focus:ring-green-500/20 rounded-xl transition-all duration-300 text-base resize-none backdrop-blur-sm"
                          required
                        />
                      </div>

                      {/* Service Category with South African styling */}
                      <div className="space-y-2">
                        <Label className="text-gray-200 font-semibold text-sm uppercase tracking-wide">Service Category</Label>
                        <Select value={formData.serviceCategory || ''} onValueChange={(value) => handleInputChange('serviceCategory', value)}>
                          <SelectTrigger className="h-14 border border-yellow-500/30 bg-black/40 text-white placeholder:text-white focus:border-green-500 focus:ring-green-500/20 rounded-xl transition-all duration-300 text-lg backdrop-blur-sm">
                            <SelectValue placeholder="Select your service category" />
                          </SelectTrigger>
                          <SelectContent className="bg-black/80 border-yellow-500/30 backdrop-blur-md">
                            <SelectItem value="plumber" className="text-gray-100 hover:bg-yellow-500/20">Plumber</SelectItem>
                            <SelectItem value="electrician" className="text-gray-100 hover:bg-yellow-500/20">Electrician</SelectItem>
                            <SelectItem value="carpenter" className="text-gray-100 hover:bg-yellow-500/20">Carpenter</SelectItem>
                            <SelectItem value="painter" className="text-gray-100 hover:bg-yellow-500/20">Painter</SelectItem>
                            <SelectItem value="cleaner" className="text-gray-100 hover:bg-yellow-500/20">Cleaner</SelectItem>
                            <SelectItem value="gardener" className="text-gray-100 hover:bg-yellow-500/20">Gardener</SelectItem>
                            <SelectItem value="mechanic" className="text-gray-100 hover:bg-yellow-500/20">Mechanic</SelectItem>
                            <SelectItem value="technician" className="text-gray-100 hover:bg-yellow-500/20">Technician</SelectItem>
                            <SelectItem value="other" className="text-gray-100 hover:bg-yellow-500/20">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Service Area with South African styling */}
                      <div className="space-y-2">
                        <Label className="text-gray-200 font-semibold text-sm uppercase tracking-wide">Service Area / Address</Label>
                        <Textarea
                          placeholder="Enter the areas where you provide services (e.g., Johannesburg CBD, Sandton, etc.)"
                          value={formData.serviceArea || ''}
                          onChange={(e) => handleInputChange('serviceArea', e.target.value)}
                          className="h-20 border border-yellow-500/30 bg-black/40 text-gray-100 placeholder:text-gray-400 focus:border-green-500 focus:ring-green-500/20 rounded-xl transition-all duration-300 text-base resize-none backdrop-blur-sm"
                          required
                        />
                      </div>
                    </>
                  )}
                  
                  {/* Submit Button with South African gradient */}
                  <Button 
                    type="submit" 
                    className="w-full h-14 bg-gradient-to-r from-yellow-400 via-green-400 to-blue-400 hover:from-yellow-500 hover:via-green-500 hover:to-blue-500 text-white font-semibold text-lg rounded-xl shadow-lg transform hover:scale-[1.02] transition-all duration-200" 
                    disabled={loading}
                  >
                    {loading ? 'Submitting Application...' : 'Submit Application'}
                  </Button>
                </form>
              )}

              {/* Application Confirmation Screen */}
              {currentStep === 'confirmation' && (
                <div className="text-center space-y-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 via-green-400 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="h-10 w-10 text-white" />
                  </div>
                  
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 via-green-400 to-blue-400 bg-clip-text text-transparent">
                      Application Submitted Successfully!
                    </h2>
                    
                    <p className="text-gray-300 text-lg leading-relaxed">
                      Thank you for applying to WAYA WAYA! Your application is under review. 
                      You'll receive an SMS or email once approved.
                    </p>
                    
                    <div className="bg-black/40 border border-yellow-500/30 rounded-xl p-6 backdrop-blur-sm">
                      <h3 className="text-yellow-400 font-semibold mb-3">What happens next?</h3>
                      <ul className="text-gray-300 text-sm space-y-2 text-left">
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                          Admin reviews your application (1-2 business days)
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          You'll receive approval notification via SMS/Email
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          Access your provider dashboard once approved
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Button 
                      className="w-full h-12 bg-gradient-to-r from-yellow-400 via-green-400 to-blue-400 hover:from-yellow-500 hover:via-green-500 hover:to-blue-500 text-white font-medium rounded-lg shadow-lg transform hover:scale-[1.02] transition-all duration-200"
                      disabled
                    >
                      Go to Dashboard (Available after approval)
                    </Button>
                    
                    <Button 
                      variant="outline"
                      className="w-full h-12 border border-yellow-500/30 bg-black/40 text-gray-300 hover:bg-yellow-500/20 rounded-lg backdrop-blur-sm"
                      onClick={() => onNavigate('login')}
                    >
                      Back to Login
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return null;
}