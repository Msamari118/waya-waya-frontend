import React, { useState } from 'react';
import { WayaWayaLogo } from '../shared/WayaWayaLogo';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  DollarSign, Calendar, Star, User, BarChart3, MessageCircle, Server,
  ToggleLeft, ToggleRight
} from 'lucide-react';
import { apiClient } from '../../utils/apiClient.js';

interface ProviderViewProps {
  isConnected: boolean;
  authToken: string | null;
  setCurrentView: (view: string) => void;
}

export const ProviderView: React.FC<ProviderViewProps> = ({
  isConnected,
  authToken,
  setCurrentView
}) => {
  const [isAvailable, setIsAvailable] = useState(true);
  const [todaysEarnings, setTodaysEarnings] = useState(245.50);

  const handleToggleAvailability = async () => {
    try {
      const response = await apiClient.providers.updateAvailability({ isAvailable: !isAvailable }, authToken || '');
      if (response.ok) {
        setIsAvailable(!isAvailable);
        alert(`You are now ${!isAvailable ? 'available' : 'unavailable'} for new bookings`);
      }
    } catch (error) {
      setIsAvailable(!isAvailable);
      alert(`You are now ${!isAvailable ? 'available' : 'unavailable'} for new bookings`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => setCurrentView('home')}>
          ← Back
        </Button>
        <WayaWayaLogo size="sm" />
        <h1>Provider Dashboard</h1>
      </div>

      {!isConnected && (
        <Alert className="bg-blue-50 border-blue-200">
          <Server className="h-4 w-4" />
          <AlertDescription className="text-blue-800">
            
          </AlertDescription>
        </Alert>
      )}

      {/* Availability Toggle */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3>Availability Status</h3>
              <p className="text-sm text-muted-foreground">
                {isAvailable ? 'You are currently accepting new bookings' : 'You are currently unavailable'}
              </p>
            </div>
            <Button 
              onClick={handleToggleAvailability}
              variant={isAvailable ? "default" : "outline"}
              className="flex items-center gap-2"
            >
              {isAvailable ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
              {isAvailable ? 'Available' : 'Unavailable'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Today's Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R{todaysEarnings.toFixed(2)}</div>
            <p className="text-sm text-muted-foreground">From 3 completed jobs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Pending Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-sm text-muted-foreground">Require confirmation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-600" />
              Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8</div>
            <p className="text-sm text-muted-foreground">Based on 127 reviews</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Button className="h-16 flex-col" onClick={() => alert('View bookings functionality')}>
              <Calendar className="h-6 w-6 mb-2" />
              View Bookings
            </Button>
            <Button variant="outline" className="h-16 flex-col" onClick={() => alert('Update profile functionality')}>
              <User className="h-6 w-6 mb-2" />
              Update Profile
            </Button>
            <Button variant="outline" className="h-16 flex-col" onClick={() => alert('View earnings functionality')}>
              <BarChart3 className="h-6 w-6 mb-2" />
              View Earnings
            </Button>
            <Button variant="outline" className="h-16 flex-col" onClick={() => alert('Messages functionality')}>
              <MessageCircle className="h-6 w-6 mb-2" />
              Messages
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};