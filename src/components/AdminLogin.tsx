import React from 'react';
import { WayaWayaLogo } from './shared/WayaWayaLogo';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';

interface AdminLoginProps {
  adminKey: string;
  setAdminKey: (key: string) => void;
  handleAdminLogin: () => void;
  setShowAdminLogin: (show: boolean) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  adminKey,
  setAdminKey,
  handleAdminLogin,
  setShowAdminLogin
}) => (
  <div className="min-h-screen bg-background flex items-center justify-center p-4">
    <div className="w-full max-w-md">
      <Card>
        <div className="p-6">
          <div className="text-center mb-6">
            <WayaWayaLogo size="md" />
            <h2 className="mt-4">🔧 Admin Access</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Enter admin key to access development panel
            </p>
          </div>
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Enter admin key"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
            />
            <div className="flex gap-2">
              <Button onClick={handleAdminLogin} className="flex-1">
                Access Admin Panel
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowAdminLogin(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  </div>
);