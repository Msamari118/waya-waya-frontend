import React, { useState } from 'react';
import { WayaWayaLogo } from '../shared/WayaWayaLogo';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import {
  Search, Calendar, Star, User, BarChart3, MessageCircle, CreditCard,
  Clock, MapPin, CheckCircle, AlertCircle, TrendingUp, Award, Zap,
  Shield, Wrench, Sparkles, Car, Heart, Target
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
    <div className="min-h-screen bg-gradient-to-br from-green-500 via-yellow-500 to-red-600">
      <div className="max-w-md mx-auto p-4">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="ghost" 
              onClick={() => setCurrentView('home')}
              className="text-white hover:text-yellow-200 hover:bg-white/20"
            >
              ← Back
            </Button>
            <WayaWayaLogo size="sm" />
            <h1 className="text-2xl font-bold text-white">
              Client Dashboard
            </h1>
          </div>

          {!isConnected && (
            <Alert className="bg-white/20 border-white/30 backdrop-blur-sm">
              <AlertCircle className="h-4 w-4 text-yellow-200" />
              <AlertDescription className="text-white">
                Connecting to WAYA WAYA services...
              </AlertDescription>
            </Alert>
          )}

          {/* Welcome Section */}
          <Card className="bg-white/20 backdrop-blur-md border border-white/30 shadow-2xl">
            <CardContent className="p-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-white mb-2">Welcome back!</h2>
                <p className="text-white/90">
                  Find trusted service providers for all your needs
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white/20 border-white/30 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-yellow-200 text-sm">
                  <Clock className="h-4 w-4" />
                  Active Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{activeRequests}</div>
                <p className="text-sm text-white/80">In progress</p>
              </CardContent>
            </Card>

            <Card className="bg-white/20 border-white/30 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-green-200 text-sm">
                  <CreditCard className="h-4 w-4" />
                  Total Spent
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">R{totalSpent.toFixed(2)}</div>
                <p className="text-sm text-white/80">This month</p>
              </CardContent>
            </Card>

            <Card className="bg-white/20 border-white/30 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-blue-200 text-sm">
                  <Star className="h-4 w-4" />
                  Average Rating
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{averageRating}</div>
                <p className="text-sm text-white/80">From your reviews</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="bg-white/20 backdrop-blur-md border border-white/30 shadow-2xl">
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
                  className="h-16 flex-col border-white/40 bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
                  onClick={() => setCurrentView('bookings')}
                >
                  <Calendar className="h-6 w-6 mb-2" />
                  My Bookings
                </Button>
                <Button
                  variant="outline"
                  className="h-16 flex-col border-white/40 bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
                  onClick={() => setCurrentView('profile')}
                >
                  <User className="h-6 w-6 mb-2" />
                  My Profile
                </Button>
                <Button
                  variant="outline"
                  className="h-16 flex-col border-white/40 bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
                  onClick={() => setCurrentView('messages')}
                >
                  <MessageCircle className="h-6 w-6 mb-2" />
                  Messages
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-white/20 backdrop-blur-md border border-white/30 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-white/20 rounded-lg border border-white/30">
                  <CheckCircle className="h-5 w-5 text-green-200" />
                  <div className="flex-1">
                    <p className="text-white font-medium">Plumbing service completed</p>
                    <p className="text-sm text-white/80">John's Plumbing • R450</p>
                  </div>
                  <span className="text-xs text-white/60">2 hours ago</span>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white/20 rounded-lg border border-white/30">
                  <Clock className="h-5 w-5 text-blue-200" />
                  <div className="flex-1">
                    <p className="text-white font-medium">Electrical repair scheduled</p>
                    <p className="text-sm text-white/80">Spark Electric • R320</p>
                  </div>
                  <span className="text-xs text-white/60">Tomorrow</span>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white/20 rounded-lg border border-white/30">
                  <Star className="h-5 w-5 text-yellow-200" />
                  <div className="flex-1">
                    <p className="text-white font-medium">You rated a service</p>
                    <p className="text-sm text-white/80">Cleaning Pro • 5 stars</p>
                  </div>
                  <span className="text-xs text-white/60">1 day ago</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Categories */}
          <Card className="bg-white/20 backdrop-blur-md border border-white/30 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white">Popular Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button
                  variant="outline"
                  className="h-12 border-white/40 bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
                  onClick={() => setCurrentView('service-selection')}
                >
                  <Wrench className="h-4 w-4 mr-2" />
                  Plumbing
                </Button>
                <Button
                  variant="outline"
                  className="h-12 border-white/40 bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
                  onClick={() => setCurrentView('service-selection')}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Electrical
                </Button>
                <Button
                  variant="outline"
                  className="h-12 border-white/40 bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
                  onClick={() => setCurrentView('service-selection')}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Cleaning
                </Button>
                <Button
                  variant="outline"
                  className="h-12 border-white/40 bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
                  onClick={() => setCurrentView('service-selection')}
                >
                  <Heart className="h-4 w-4 mr-2" />
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