import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { CheckCircle, Clock, Mail, Phone, ArrowLeft, AlertCircle } from 'lucide-react';
import ProfilePictureUpload from './ProfilePictureUpload';

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
    profilePicture: null as File | null
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
  const [canResendOtp, setCanResendOtp] = useState(false);
  
  // Forgot password/username states
  const [forgotType, setForgotType] = useState(''); // 'password' or 'username'
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Timer for OTP resend
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    } else if (otpTimer === 0 && currentStep === 'phone-otp') {
      setCanResendOtp(true);
    }
    return () => clearInterval(interval);
  }, [otpTimer, currentStep]);

  // Password validation effect
  useEffect(() => {
    if (formData.password) {
      setPasswordValidation(validatePassword(formData.password));
    }
  }, [formData.password, validatePassword]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
    setSuccess('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await apiClient.auth.login({
        emailOrPhone: formData.emailOrPhone,
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
    
    if (!passwordValidation.isValid) {
      setError('Password does not meet requirements');
      setLoading(false);
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (!formData.phoneNumber || !formData.email) {
      setError('Phone number and email are required');
      setLoading(false);
      return;
    }
    
    const fullPhoneNumber = `${formData.countryCode}${formData.phoneNumber}`;
    
    try {
      const response = await apiClient.auth.sendPhoneOtp({
        phoneNumber: fullPhoneNumber,
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        userType: formData.userType
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setCurrentStep('phone-otp');
        setOtpTimer(60);
        setCanResendOtp(false);
        setSuccess('OTP sent to your phone number');
      } else {
        setError(data.error || 'Failed to send OTP');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneOtpVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const fullPhoneNumber = `${formData.countryCode}${formData.phoneNumber}`;
      const response = await apiClient.auth.verifyPhoneOtp({
        phoneNumber: fullPhoneNumber,
        otp: phoneOtp,
        registrationData: formData
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setCurrentStep('email-verification');
        setSuccess('Phone verified! Check your email for verification code.');
      } else {
        setError(data.error || 'Invalid OTP');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
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
        // If user is a provider and has a profile picture, upload it
        if (formData.userType === 'provider' && formData.profilePicture) {
          try {
            const uploadResponse = await apiClient.providers.uploadProfilePicture(
              formData.profilePicture,
              data.token
            );
            
            if (!uploadResponse.ok) {
              console.warn('Profile picture upload failed, but registration was successful');
            }
          } catch (uploadErr) {
            console.warn('Profile picture upload error:', uploadErr);
          }
        }
        
        onAuthSuccess(data.token, data.user);
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
    setLoading(true);
    setError('');
    
    try {
      const fullPhoneNumber = `${formData.countryCode}${formData.phoneNumber}`;
      const response = await apiClient.auth.resendPhoneOtp({
        phoneNumber: fullPhoneNumber
      });
      
      if (response.ok) {
        setOtpTimer(60);
        setCanResendOtp(false);
        setSuccess('New OTP sent to your phone');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to resend OTP');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
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
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" onClick={() => onNavigate('landing')}>
              ← Back
            </Button>
            <WayaWayaLogo size="sm" />
            <h1>Sign In</h1>
          </div>
          
          <Card>
            <CardHeader>
              <div className="text-center">
                <WayaWayaLogo size="md" showText={false} />
                <CardTitle className="mt-4">Welcome Back</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                {success && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}
                
                <Input
                  placeholder="Email or Phone"
                  value={formData.emailOrPhone}
                  onChange={(e) => handleInputChange('emailOrPhone', e.target.value)}
                  required
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                />
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>
              
              {/* Forgot Password/Username Links */}
              <div className="mt-4 space-y-2 text-center">
                <div className="flex justify-center gap-4 text-sm">
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-blue-600"
                    onClick={() => {
                      setForgotType('password');
                      onNavigate('forgot-password');
                    }}
                  >
                    Forgot Password?
                  </Button>
                  <span className="text-muted-foreground">•</span>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-blue-600"
                    onClick={() => {
                      setForgotType('username');
                      onNavigate('forgot-username');
                    }}
                  >
                    Forgot Username?
                  </Button>
                </div>
                
                <Button variant="link" onClick={() => onNavigate('signup')}>
                  Don't have an account? Sign up
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Forgot Password view
  if (view === 'forgot-password') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" onClick={() => onNavigate('login')}>
              ← Back to Login
            </Button>
            <WayaWayaLogo size="sm" />
            <h1>Forgot Password</h1>
          </div>
          
          <Card>
            <CardHeader>
              <div className="text-center">
                <WayaWayaLogo size="md" showText={false} />
                <CardTitle className="mt-4">Reset Your Password</CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                  Enter your email address and we'll send you instructions to reset your password.
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleForgotPassword} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                {success && (
                  <Alert>
                    <Mail className="h-4 w-4" />
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}
                
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                />
                
                <Button type="submit" className="w-full" disabled={loading}>
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
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" onClick={() => onNavigate('login')}>
              ← Back to Login
            </Button>
            <WayaWayaLogo size="sm" />
            <h1>Forgot Username</h1>
          </div>
          
          <Card>
            <CardHeader>
              <div className="text-center">
                <WayaWayaLogo size="md" showText={false} />
                <CardTitle className="mt-4">Recover Your Username</CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                  Enter your email address and we'll send you your username.
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleForgotUsername} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                {success && (
                  <Alert>
                    <Mail className="h-4 w-4" />
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}
                
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                />
                
                <Button type="submit" className="w-full" disabled={loading}>
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
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" onClick={() => {
              if (currentStep !== 'form') {
                setCurrentStep('form');
                setError('');
                setSuccess('');
              } else {
                onNavigate('landing');
              }
            }}>
              ← Back
            </Button>
            <WayaWayaLogo size="sm" />
            <div>
              <h1>Create Account</h1>
              {currentStep === 'phone-otp' && <p className="text-sm text-muted-foreground">Verify Phone Number</p>}
              {currentStep === 'email-verification' && <p className="text-sm text-muted-foreground">Verify Email Address</p>}
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <div className="text-center">
                <WayaWayaLogo size="md" showText={false} />
                <CardTitle className="mt-4">
                  {currentStep === 'form' && 'Create Account'}
                  {currentStep === 'phone-otp' && 'Verify Phone Number'}
                  {currentStep === 'email-verification' && 'Verify Email Address'}
                </CardTitle>
                {currentStep === 'phone-otp' && (
                  <p className="text-sm text-muted-foreground mt-2">
                    We've sent a 6-digit code to {formData.countryCode}{formData.phoneNumber}
                  </p>
                )}
                {currentStep === 'email-verification' && (
                  <p className="text-sm text-muted-foreground mt-2">
                    We've sent a verification code to {formData.email}
                  </p>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {/* Initial Signup Form */}
              {currentStep === 'form' && (
                <form onSubmit={handleSignupSubmit} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <Input
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    required
                  />
                  
                  {/* Phone Number with International Country Code */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                    <div className="flex gap-2">
                      <Select value={formData.countryCode} onValueChange={(value) => handleInputChange('countryCode', value)}>
                        <SelectTrigger className="w-36">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {internationalCountryCodes.map((country) => (
                            <SelectItem key={country.id} value={country.code}>
                              <div className="flex items-center gap-2">
                                <span>{country.flag}</span>
                                <span className="font-medium">{country.code}</span>
                                <span className="text-xs text-muted-foreground truncate">{country.country}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder="Phone number"
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                        className="flex-1"
                        required
                      />
                    </div>
                  </div>
                  
                  <Input
                    placeholder="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                  
                  <div>
                    <Input
                      type="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      required
                    />
                    {/* Password Requirements */}
                    {formData.password && (
                      <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs font-medium mb-2">Password Requirements:</p>
                        <div className="space-y-1">
                          <div className={`flex items-center gap-2 text-xs ${passwordValidation.minLength ? 'text-green-600' : 'text-red-600'}`}>
                            {passwordValidation.minLength ? '✓' : '✗'} At least 8 characters
                          </div>
                          <div className={`flex items-center gap-2 text-xs ${passwordValidation.hasDigit ? 'text-green-600' : 'text-red-600'}`}>
                            {passwordValidation.hasDigit ? '✓' : '✗'} Contains a number
                          </div>
                          <div className={`flex items-center gap-2 text-xs ${passwordValidation.hasSpecialChar ? 'text-green-600' : 'text-red-600'}`}>
                            {passwordValidation.hasSpecialChar ? '✓' : '✗'} Contains a special character (!@#$%^&*(),.?":{}|&lt;&gt;)
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <Input
                    type="password"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    required
                  />
                  
                  {view === 'signup' && (
                    <Tabs value={formData.userType} onValueChange={(value) => handleInputChange('userType', value)}>
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="client">I need services</TabsTrigger>
                        <TabsTrigger value="provider">I provide services</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  )}
                  
                  {/* Profile Picture Upload for Providers */}
                  {(view === 'signup-provider' || formData.userType === 'provider') && (
                    <div className="mt-4">
                      <ProfilePictureUpload
                        onFileSelect={(file) => {
                          setFormData(prev => ({ ...prev, profilePicture: file }));
                        }}
                        className="mb-4"
                      />
                    </div>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading || !passwordValidation.isValid}
                  >
                    {loading ? 'Sending OTP...' : 'Send Verification Code'}
                  </Button>
                </form>
              )}

              {/* Phone OTP Verification */}
              {currentStep === 'phone-otp' && (
                <form onSubmit={handlePhoneOtpVerification} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  {success && (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>{success}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="space-y-4">
                    <Input
                      placeholder="Enter 6-digit code"
                      value={phoneOtp}
                      onChange={(e) => setPhoneOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="text-center tracking-widest text-lg"
                      required
                      maxLength={6}
                    />
                    
                    <div className="text-center">
                      {otpTimer > 0 ? (
                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>Resend code in {otpTimer}s</span>
                        </div>
                      ) : (
                        <Button
                          type="button"
                          variant="link"
                          onClick={handleResendOtp}
                          disabled={loading || !canResendOtp}
                          className="text-sm"
                        >
                          Resend Code
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={loading || phoneOtp.length !== 6}>
                    {loading ? 'Verifying...' : 'Verify Phone Number'}
                  </Button>
                </form>
              )}

              {/* Email Verification */}
              {currentStep === 'email-verification' && (
                <form onSubmit={handleEmailVerification} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  {success && (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>{success}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="space-y-4">
                    <Input
                      placeholder="Enter verification code"
                      value={emailOtp}
                      onChange={(e) => setEmailOtp(e.target.value)}
                      className="text-center tracking-widest text-lg"
                      required
                    />
                    
                    <div className="text-center">
                      <Button
                        type="button"
                        variant="link"
                        onClick={async () => {
                          setLoading(true);
                          try {
                            await apiClient.auth.resendEmailVerification({ email: formData.email });
                            setSuccess('Verification email resent');
                          } catch (err) {
                            setError('Failed to resend email');
                          } finally {
                            setLoading(false);
                          }
                        }}
                        disabled={loading}
                        className="text-sm"
                      >
                        Resend Email
                      </Button>
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={loading || !emailOtp}>
                    {loading ? 'Verifying...' : 'Complete Registration'}
                  </Button>
                </form>
              )}

              {/* Navigation links */}
              {currentStep === 'form' && (
                <div className="mt-4 text-center">
                  <Button variant="link" onClick={() => onNavigate('login')}>
                    Already have an account? Sign in
                  </Button>
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