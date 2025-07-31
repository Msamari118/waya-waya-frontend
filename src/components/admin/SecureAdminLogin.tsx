import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Label } from '../ui/label';
import { Shield, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { WayaWayaLogo } from '../shared/WayaWayaLogo';
import { adminLogin, AdminLoginRequest } from '../../utils/adminAuth';

interface SecureAdminLoginProps {
  onLoginSuccess: () => void;
  onCancel: () => void;
}

export const SecureAdminLogin: React.FC<SecureAdminLoginProps> = ({
  onLoginSuccess,
  onCancel
}) => {
  const [credentials, setCredentials] = useState<AdminLoginRequest>({
    username: '',
    password: '',
    twoFactorCode: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [requiresTwoFactor, setRequiresTwoFactor] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await adminLogin(credentials);
      
      if (response.success) {
        if (response.requiresTwoFactor) {
          setRequiresTwoFactor(true);
          setError('');
        } else {
          onLoginSuccess();
        }
      } else {
        setError(response.error || 'Login failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTwoFactorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await adminLogin({
        ...credentials,
        twoFactorCode: credentials.twoFactorCode
      });
      
      if (response.success) {
        onLoginSuccess();
      } else {
        setError(response.error || 'Two-factor authentication failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <WayaWayaLogo size="lg" />
          </div>
          <CardTitle className="flex items-center justify-center gap-2">
            <Shield className="h-6 w-6 text-red-600" />
            Secure Admin Access
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Backend-authenticated admin panel
          </p>
        </CardHeader>
        
        <CardContent>
          {error && (
            <Alert className="mb-4 border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {!requiresTwoFactor ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Admin Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="Enter admin username"
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Admin Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={credentials.password}
                    onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Enter admin password"
                    required
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={loading || !credentials.username || !credentials.password}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Lock className="h-4 w-4 mr-2" />
                  )}
                  {loading ? 'Authenticating...' : 'Login'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleTwoFactorSubmit} className="space-y-4">
              <div className="text-center mb-4">
                <Shield className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold">Two-Factor Authentication</h3>
                <p className="text-sm text-muted-foreground">
                  Enter the 6-digit code from your authenticator app
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="twoFactorCode">Authentication Code</Label>
                <Input
                  id="twoFactorCode"
                  type="text"
                  value={credentials.twoFactorCode || ''}
                  onChange={(e) => setCredentials(prev => ({ ...prev, twoFactorCode: e.target.value }))}
                  placeholder="000000"
                  maxLength={6}
                  required
                  disabled={loading}
                  className="text-center text-lg tracking-widest"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={loading || !credentials.twoFactorCode || credentials.twoFactorCode.length !== 6}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Shield className="h-4 w-4 mr-2" />
                  )}
                  {loading ? 'Verifying...' : 'Verify'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setRequiresTwoFactor(false)}
                  disabled={loading}
                >
                  Back
                </Button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              <Lock className="h-3 w-3 inline mr-1" />
              Secure backend authentication required
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 