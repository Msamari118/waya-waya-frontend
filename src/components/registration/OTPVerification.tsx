import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Check } from 'lucide-react';
import otpService from '../../utils/otpService.js';

interface OTPVerificationProps {
  type: 'phone' | 'email';
  identifier: string;
  label: string;
  verified: boolean;
  onVerified: () => void;
  onError: (error: string) => void;
  disabled?: boolean;
}

export const OTPVerification: React.FC<OTPVerificationProps> = ({
  type,
  identifier,
  label,
  verified,
  onVerified,
  onError,
  disabled = false
}) => {
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const sendOTP = async () => {
    if (!identifier) {
      onError(`${label} is required`);
      return;
    }

    setLoading(true);
    try {
      const result = type === 'phone' 
        ? await otpService.sendSMSOTP(identifier, '', 'verification')
        : await otpService.sendEmailOTP(identifier, '', 'verification');

      if (result.success) {
        setOtpSent(true);
        alert(`OTP sent to ${result.masked}`);
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      onError(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      onError('Please enter valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const result = await otpService.verifyOTP(identifier, otp, type);

      if (result.success) {
        onVerified();
        setOtp('');
        alert(`${label} verified successfully!`);
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      onError(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    setOtp('');
    setOtpSent(false);
    await sendOTP();
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="flex-1">
          <div className="flex gap-2">
            <Input
              value={identifier}
              disabled={verified || disabled}
              className={verified ? 'bg-green-50 border-green-200' : ''}
              readOnly
            />
            <Button
              type="button"
              variant={verified ? "outline" : "default"}
              onClick={verified ? undefined : sendOTP}
              disabled={!identifier || verified || loading || disabled}
              className="min-w-24"
            >
              {verified ? <Check className="h-4 w-4" /> : loading ? 'Sending...' : 'Verify'}
            </Button>
          </div>
        </div>
      </div>

      {otpSent && !verified && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder={`Enter 6-digit ${type === 'phone' ? 'SMS' : 'email'} code`}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
              className="flex-1"
              disabled={loading || disabled}
            />
            <Button 
              onClick={verifyOTP} 
              disabled={loading || otp.length !== 6 || disabled}
              className="min-w-20"
            >
              {loading ? 'Verifying...' : 'Confirm'}
            </Button>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">
              Didn't receive the code?
            </span>
            <Button 
              variant="link" 
              size="sm" 
              onClick={resendOTP}
              disabled={loading || disabled}
              className="p-0 h-auto"
            >
              Resend
            </Button>
          </div>
        </div>
      )}

      {verified && (
        <div className="text-sm text-green-600 flex items-center gap-1">
          <Check className="h-4 w-4" />
          {label} verified
        </div>
      )}
    </div>
  );
};