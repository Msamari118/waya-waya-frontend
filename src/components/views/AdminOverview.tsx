import React from 'react';
import { WayaWayaLogo } from '../shared/WayaWayaLogo';
import { ConnectionStatus } from '../shared/ConnectionStatus';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  Search, Shield, User, Clock, Zap, Star, CreditCard, Calendar, Users, Settings,
  MessageCircle, Server, Database, AlertTriangle
} from 'lucide-react';

interface AdminOverviewProps {
  isConnected: boolean;
  connectionError: string;
  retryConnection: () => void;
  handleLogout: () => void;
  setCurrentView: (view: string) => void;
  startProviderChat: (provider: any) => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  isConnected,
  connectionError,
  retryConnection,
  handleLogout,
  setCurrentView,
  startProviderChat
}) => (
  <div className="space-y-6">
    <div className="flex items-center gap-4 mb-6">
      <WayaWayaLogo size="lg" />
      <div>
        <h1>🔧 Admin Development Panel</h1>
        <p className="text-sm text-muted-foreground">Testing Backend: localhost:5000/api</p>
      </div>
      <div className="ml-auto">
        <ConnectionStatus isConnected={isConnected} onRetry={retryConnection} />
      </div>
    </div>

          {!isConnected ? (
      <Alert className="bg-blue-50 border-blue-200">
        <Server className="h-4 w-4" />
        <AlertDescription>
          
        </AlertDescription>
      </Alert>
    ) : (
      <Alert>
        <Database className="h-4 w-4" />
        <AlertDescription>
          <strong>Development Mode Active:</strong> Connected to localhost:5000/api for backend testing.
        </AlertDescription>
      </Alert>
    )}

    {connectionError && (
              <Alert className={!isConnected ? "bg-blue-50 border-blue-200" : "bg-red-50 border-red-200"}>
        <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className={!isConnected ? "text-blue-800" : "text-red-800"}>
          {connectionError}
        </AlertDescription>
      </Alert>
    )}

    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {/* App Views */}
      <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setCurrentView('home')}>
        <CardContent className="p-6 text-center">
          <Search className="h-12 w-12 mx-auto mb-4 text-blue-600" />
          <h3 className="font-semibold">Client View</h3>
          <p className="text-sm text-muted-foreground">Browse services & request</p>
        </CardContent>
      </Card>

      <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setCurrentView('provider')}>
        <CardContent className="p-6 text-center">
          <Shield className="h-12 w-12 mx-auto mb-4 text-green-600" />
          <h3 className="font-semibold">Provider View</h3>
          <p className="text-sm text-muted-foreground">Provider dashboard</p>
        </CardContent>
      </Card>

      <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setCurrentView('registration')}>
        <CardContent className="p-6 text-center">
          <User className="h-12 w-12 mx-auto mb-4 text-purple-600" />
          <h3 className="font-semibold">Registration</h3>
          <p className="text-sm text-muted-foreground">Provider signup flow</p>
        </CardContent>
      </Card>

      <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setCurrentView('service-request')}>
        <CardContent className="p-6 text-center">
          <Clock className="h-12 w-12 mx-auto mb-4 text-orange-600" />
          <h3 className="font-semibold">Service Request</h3>
          <p className="text-sm text-muted-foreground">Request a service</p>
        </CardContent>
      </Card>

      <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setCurrentView('matching')}>
        <CardContent className="p-6 text-center">
          <Zap className="h-12 w-12 mx-auto mb-4 text-yellow-600" />
          <h3 className="font-semibold">Matching Engine</h3>
          <p className="text-sm text-muted-foreground">Provider matching</p>
        </CardContent>
      </Card>

      <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setCurrentView('ratings-reviews')}>
        <CardContent className="p-6 text-center">
          <Star className="h-12 w-12 mx-auto mb-4 text-pink-600" />
          <h3 className="font-semibold">Ratings & Reviews</h3>
          <p className="text-sm text-muted-foreground">Review system</p>
        </CardContent>
      </Card>

      {/* Management Views */}
      <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setCurrentView('payment-management')}>
        <CardContent className="p-6 text-center">
          <CreditCard className="h-12 w-12 mx-auto mb-4 text-blue-600" />
          <h3 className="font-semibold">Payment Management</h3>
          <p className="text-sm text-muted-foreground">EFT & Commission</p>
        </CardContent>
      </Card>

      <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setCurrentView('trial-management')}>
        <CardContent className="p-6 text-center">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-green-600" />
          <h3 className="font-semibold">Trial Management</h3>
          <p className="text-sm text-muted-foreground">7-day trials & fees</p>
        </CardContent>
      </Card>

      <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setCurrentView('client-management')}>
        <CardContent className="p-6 text-center">
          <Users className="h-12 w-12 mx-auto mb-4 text-purple-600" />
          <h3 className="font-semibold">Client Management</h3>
          <p className="text-sm text-muted-foreground">Blocking & payments</p>
        </CardContent>
      </Card>

      <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setCurrentView('admin')}>
        <CardContent className="p-6 text-center">
          <Settings className="h-12 w-12 mx-auto mb-4 text-red-600" />
          <h3 className="font-semibold">Admin Interface</h3>
          <p className="text-sm text-muted-foreground">Manage platform</p>
        </CardContent>
      </Card>

      <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setCurrentView('login')}>
        <CardContent className="p-6 text-center">
          <User className="h-12 w-12 mx-auto mb-4 text-indigo-600" />
          <h3 className="font-semibold">Auth System</h3>
          <p className="text-sm text-muted-foreground">Login/Signup flows</p>
        </CardContent>
      </Card>

      <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => startProviderChat({ name: 'Demo Provider', service: 'General Services' })}>
        <CardContent className="p-6 text-center">
          <MessageCircle className="h-12 w-12 mx-auto mb-4 text-blue-600" />
          <h3 className="font-semibold">Chat System</h3>
          <p className="text-sm text-muted-foreground">Client-Provider messaging</p>
        </CardContent>
      </Card>
    </div>

    <Card className="bg-blue-50 border-blue-200">
      <CardContent className="p-4">
        <h4 className="font-bold mb-2 text-blue-800">📡 API Testing Info</h4>
        <div className="text-sm text-blue-700 space-y-1">
          <p>• Backend URL: <code className="bg-blue-100 px-1 rounded">http://localhost:5000/api</code></p>
          <p>• Connection Status: <strong>{isConnected ? 'Connected' : 'Offline'}</strong></p>
          <p>• Admin Mode: Active (bypass authentication)</p>
          <p>• Currency: South African Rand (ZAR) only</p>
                      <p>• {!isConnected ? 'Mock API responses for all endpoints' : 'All API calls will be made to your localhost backend'}</p>
          <p>• Chat system supports both provider-specific and general chats</p>
          <p>• OTP verification integrated for phone and email</p>
          <p>• All errors are handled gracefully with fallback responses</p>
        </div>
      </CardContent>
    </Card>

    <div className="flex gap-4">
      <Button 
        onClick={handleLogout} 
        variant="outline"
        className="flex-1"
      >
        Exit Admin Mode
      </Button>
      <Button 
        onClick={() => window.location.reload()} 
        variant="default"
        className="flex-1"
      >
        🔄 Reload App
      </Button>
    </div>
  </div>
);