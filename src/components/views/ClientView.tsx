import React, { useState } from 'react';
import { WayaWayaLogo } from '../shared/WayaWayaLogo';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import {
  Search, Calendar, Star, User, BarChart3, MessageCircle, CreditCard,
  Clock, MapPin, CheckCircle, AlertCircle, TrendingUp, Award, Zap
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <div className="max-w-md mx-auto p-4">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="ghost" 
              onClick={() => setCurrentView('home')}
              className="text-gray-700 hover:text-gray-900 hover:bg-white/50"
            >
              ← Back
            </Button>
            <WayaWayaLogo size="sm" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Client Dashboard
            </h1>
          </div>

          {!isConnected && (
            <Alert className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Connecting to WAYA WAYA services...
              </AlertDescription>
            </Alert>
          )}

          {/* Welcome Section */}
          <Card className="bg-gradient-to-r from-white to-gray-50 shadow-xl border-0 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
              <div className="text-center text-white">
                <h2 className="text-xl font-semibold mb-2">Welcome back!</h2>
                <p className="text-indigo-100">
                  Find trusted service providers for all your needs
                </p>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Ready to book?</p>
                    <p className="font-semibold text-gray-800">Let's get started</p>
                  </div>
                </div>
                <TrendingUp className="h-8 w-8 text-indigo-500" />
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg border-0 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-green-100 text-sm">
                  <Clock className="h-4 w-4" />
                  Active Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeRequests}</div>
                <p className="text-sm text-green-100">In progress</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg border-0 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-blue-100 text-sm">
                  <CreditCard className="h-4 w-4" />
                  Total Spent
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R{totalSpent.toFixed(2)}</div>
                <p className="text-sm text-blue-100">This month</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-500 to-orange-500 shadow-lg border-0 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-yellow-100 text-sm">
                  <Star className="h-4 w-4" />
                  Average Rating
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{averageRating}</div>
                <p className="text-sm text-yellow-100">From your reviews</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="bg-white shadow-xl border-0 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4">
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </div>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <Button
                  className="h-16 flex-col bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg"
                  onClick={() => setCurrentView('service-selection')}
                >
                  <Search className="h-6 w-6 mb-2" />
                  Find Services
                </Button>
                <Button
                  variant="outline"
                  className="h-16 flex-col border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 hover:from-purple-100 hover:to-pink-100 shadow-md"
                  onClick={() => setCurrentView('bookings')}
                >
                  <Calendar className="h-6 w-6 mb-2" />
                  My Bookings
                </Button>
                <Button
                  variant="outline"
                  className="h-16 flex-col border-2 border-indigo-200 bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700 hover:from-indigo-100 hover:to-blue-100 shadow-md"
                  onClick={() => setCurrentView('profile')}
                >
                  <User className="h-6 w-6 mb-2" />
                  My Profile
                </Button>
                <Button
                  variant="outline"
                  className="h-16 flex-col border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 hover:from-green-100 hover:to-emerald-100 shadow-md"
                  onClick={() => setCurrentView('messages')}
                >
                  <MessageCircle className="h-6 w-6 mb-2" />
                  Messages
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-white shadow-xl border-0 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-4">
              <CardTitle className="text-white flex items-center gap-2">
                <Award className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </div>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 font-semibold">Plumbing service completed</p>
                    <p className="text-sm text-gray-600">John's Plumbing • R450</p>
                  </div>
                  <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">2h ago</span>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 font-semibold">Electrical repair scheduled</p>
                    <p className="text-sm text-gray-600">Spark Electric • R320</p>
                  </div>
                  <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">Tomorrow</span>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                  <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                    <Star className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 font-semibold">You rated a service</p>
                    <p className="text-sm text-gray-600">Cleaning Pro • 5 stars</p>
                  </div>
                  <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">1d ago</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Categories */}
          <Card className="bg-white shadow-xl border-0 overflow-hidden">
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-4">
              <CardTitle className="text-white flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Popular Services
              </CardTitle>
            </div>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button
                  variant="outline"
                  className="h-12 border-2 border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 hover:from-indigo-100 hover:to-purple-100 shadow-md"
                  onClick={() => setCurrentView('service-selection')}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Plumbing
                </Button>
                <Button
                  variant="outline"
                  className="h-12 border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50 text-yellow-700 hover:from-yellow-100 hover:to-orange-100 shadow-md"
                  onClick={() => setCurrentView('service-selection')}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Electrical
                </Button>
                <Button
                  variant="outline"
                  className="h-12 border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 hover:from-green-100 hover:to-emerald-100 shadow-md"
                  onClick={() => setCurrentView('service-selection')}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Cleaning
                </Button>
                <Button
                  variant="outline"
                  className="h-12 border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 hover:from-purple-100 hover:to-pink-100 shadow-md"
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