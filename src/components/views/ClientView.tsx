import React, { useState } from 'react';
import { WayaWayaLogo } from '../shared/WayaWayaLogo';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  Search, Calendar, Star, User, BarChart3, MessageCircle, CreditCard,
  Clock, MapPin, CheckCircle, AlertCircle
} from 'lucide-react';
import { apiClient } from '../../utils/apiClient.js';

interface ClientViewProps {
  isConnected: boolean;
  authToken: string | null;
  setCurrentView: (view: string) => void;
}

export const ClientView: React.FC<ClientViewProps> = ({
  isConnected,
  authToken,
  setCurrentView
}) => {
  const [activeRequests, setActiveRequests] = useState(2);
  const [totalSpent, setTotalSpent] = useState(1250.75);
  const [averageRating, setAverageRating] = useState(4.6);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => setCurrentView('home')}>
          ← Back
        </Button>
        <WayaWayaLogo size="sm" />
        <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 via-green-400 to-blue-400 bg-clip-text text-transparent">
          Client Dashboard
        </h1>
      </div>

      {!isConnected && (
        <Alert className="bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-blue-800">
            Connecting to WAYA WAYA services...
          </AlertDescription>
        </Alert>
      )}

      {/* Welcome Section */}
      <Card className="bg-gradient-to-br from-black/80 via-gray-900/90 to-black/80 backdrop-blur-md border border-yellow-500/30 shadow-2xl">
        <CardContent className="p-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-white mb-2">Welcome back!</h2>
            <p className="text-gray-300">
              Find trusted service providers for all your needs
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-400">
              <Clock className="h-5 w-5" />
              Active Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{activeRequests}</div>
            <p className="text-sm text-gray-300">In progress</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-400">
              <CreditCard className="h-5 w-5" />
              Total Spent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">R{totalSpent.toFixed(2)}</div>
            <p className="text-sm text-gray-300">This month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border-yellow-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-400">
              <Star className="h-5 w-5" />
              Average Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{averageRating}</div>
            <p className="text-sm text-gray-300">From your reviews</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-br from-black/80 via-gray-900/90 to-black/80 backdrop-blur-md border border-yellow-500/30 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Button 
              className="h-16 flex-col bg-gradient-to-r from-yellow-400 via-green-400 to-blue-400 hover:from-yellow-500 hover:via-green-500 hover:to-blue-500 text-white"
              onClick={() => setCurrentView('service-selection')}
            >
              <Search className="h-6 w-6 mb-2" />
              Find Services
            </Button>
            <Button 
              variant="outline" 
              className="h-16 flex-col border-yellow-500/30 bg-black/40 text-gray-200 hover:bg-yellow-500/20 backdrop-blur-sm" 
              onClick={() => setCurrentView('bookings')}
            >
              <Calendar className="h-6 w-6 mb-2" />
              My Bookings
            </Button>
            <Button 
              variant="outline" 
              className="h-16 flex-col border-yellow-500/30 bg-black/40 text-gray-200 hover:bg-yellow-500/20 backdrop-blur-sm" 
              onClick={() => setCurrentView('profile')}
            >
              <User className="h-6 w-6 mb-2" />
              My Profile
            </Button>
            <Button 
              variant="outline" 
              className="h-16 flex-col border-yellow-500/30 bg-black/40 text-gray-200 hover:bg-yellow-500/20 backdrop-blur-sm" 
              onClick={() => setCurrentView('messages')}
            >
              <MessageCircle className="h-6 w-6 mb-2" />
              Messages
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="bg-gradient-to-br from-black/80 via-gray-900/90 to-black/80 backdrop-blur-md border border-yellow-500/30 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-black/40 rounded-lg border border-yellow-500/20">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <div className="flex-1">
                <p className="text-white font-medium">Plumbing service completed</p>
                <p className="text-sm text-gray-300">John's Plumbing • R450</p>
              </div>
              <span className="text-xs text-gray-400">2 hours ago</span>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-black/40 rounded-lg border border-yellow-500/20">
              <Clock className="h-5 w-5 text-blue-400" />
              <div className="flex-1">
                <p className="text-white font-medium">Electrical repair scheduled</p>
                <p className="text-sm text-gray-300">Spark Electric • R320</p>
              </div>
              <span className="text-xs text-gray-400">Tomorrow</span>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-black/40 rounded-lg border border-yellow-500/20">
              <Star className="h-5 w-5 text-yellow-400" />
              <div className="flex-1">
                <p className="text-white font-medium">You rated a service</p>
                <p className="text-sm text-gray-300">Cleaning Pro • 5 stars</p>
              </div>
              <span className="text-xs text-gray-400">1 day ago</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service Categories */}
      <Card className="bg-gradient-to-br from-black/80 via-gray-900/90 to-black/80 backdrop-blur-md border border-yellow-500/30 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white">Popular Services</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button 
              variant="outline" 
              className="h-12 border-yellow-500/30 bg-black/40 text-gray-200 hover:bg-yellow-500/20 backdrop-blur-sm"
              onClick={() => setCurrentView('service-request')}
            >
              <MapPin className="h-4 w-4 mr-2" />
              Plumbing
            </Button>
            <Button 
              variant="outline" 
              className="h-12 border-yellow-500/30 bg-black/40 text-gray-200 hover:bg-yellow-500/20 backdrop-blur-sm"
              onClick={() => setCurrentView('service-request')}
            >
              <MapPin className="h-4 w-4 mr-2" />
              Electrical
            </Button>
            <Button 
              variant="outline" 
              className="h-12 border-yellow-500/30 bg-black/40 text-gray-200 hover:bg-yellow-500/20 backdrop-blur-sm"
              onClick={() => setCurrentView('service-request')}
            >
              <MapPin className="h-4 w-4 mr-2" />
              Cleaning
            </Button>
            <Button 
              variant="outline" 
              className="h-12 border-yellow-500/30 bg-black/40 text-gray-200 hover:bg-yellow-500/20 backdrop-blur-sm"
              onClick={() => setCurrentView('service-request')}
            >
              <MapPin className="h-4 w-4 mr-2" />
              Gardening
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 