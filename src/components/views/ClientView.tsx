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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md mx-auto p-4">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              onClick={() => setCurrentView('home')}
              className="text-gray-600 hover:text-gray-800"
            >
              ← Back
            </Button>
            <WayaWayaLogo size="sm" />
            <h1 className="text-2xl font-bold text-gray-800">
              Client Dashboard
            </h1>
          </div>

          {!isConnected && (
            <Alert className="bg-blue-50 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                Connecting to WAYA WAYA services...
              </AlertDescription>
            </Alert>
          )}

          {/* Welcome Section */}
          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Welcome back!</h2>
                <p className="text-gray-600">
                  Find trusted service providers for all your needs
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white shadow-lg border-0">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-green-600 text-sm">
                  <Clock className="h-4 w-4" />
                  Active Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-800">{activeRequests}</div>
                <p className="text-sm text-gray-500">In progress</p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg border-0">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-blue-600 text-sm">
                  <CreditCard className="h-4 w-4" />
                  Total Spent
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-800">R{totalSpent.toFixed(2)}</div>
                <p className="text-sm text-gray-500">This month</p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg border-0">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-yellow-600 text-sm">
                  <Star className="h-4 w-4" />
                  Average Rating
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-800">{averageRating}</div>
                <p className="text-sm text-gray-500">From your reviews</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="bg-white shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-gray-800">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  className="h-16 flex-col bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                  onClick={() => setCurrentView('service-selection')}
                >
                  <Search className="h-6 w-6 mb-2" />
                  Find Services
                </Button>
                <Button
                  variant="outline"
                  className="h-16 flex-col border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                  onClick={() => setCurrentView('bookings')}
                >
                  <Calendar className="h-6 w-6 mb-2" />
                  My Bookings
                </Button>
                <Button
                  variant="outline"
                  className="h-16 flex-col border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                  onClick={() => setCurrentView('profile')}
                >
                  <User className="h-6 w-6 mb-2" />
                  My Profile
                </Button>
                <Button
                  variant="outline"
                  className="h-16 flex-col border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                  onClick={() => setCurrentView('messages')}
                >
                  <MessageCircle className="h-6 w-6 mb-2" />
                  Messages
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-white shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-gray-800">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium">Plumbing service completed</p>
                    <p className="text-sm text-gray-600">John's Plumbing • R450</p>
                  </div>
                  <span className="text-xs text-gray-500">2 hours ago</span>
                </div>

                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium">Electrical repair scheduled</p>
                    <p className="text-sm text-gray-600">Spark Electric • R320</p>
                  </div>
                  <span className="text-xs text-gray-500">Tomorrow</span>
                </div>

                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <Star className="h-5 w-5 text-yellow-600" />
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium">You rated a service</p>
                    <p className="text-sm text-gray-600">Cleaning Pro • 5 stars</p>
                  </div>
                  <span className="text-xs text-gray-500">1 day ago</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Categories */}
          <Card className="bg-white shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-gray-800">Popular Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button
                  variant="outline"
                  className="h-12 border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                  onClick={() => setCurrentView('service-selection')}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Plumbing
                </Button>
                <Button
                  variant="outline"
                  className="h-12 border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                  onClick={() => setCurrentView('service-selection')}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Electrical
                </Button>
                <Button
                  variant="outline"
                  className="h-12 border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                  onClick={() => setCurrentView('service-selection')}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Cleaning
                </Button>
                <Button
                  variant="outline"
                  className="h-12 border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                  onClick={() => setCurrentView('service-selection')}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Gardening
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}; 