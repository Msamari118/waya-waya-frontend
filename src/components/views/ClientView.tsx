import React, { useState } from 'react';
import { WayaWayaLogo } from '../shared/WayaWayaLogo';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import {
  Search, Calendar, Star, User, BarChart3, MessageCircle, CreditCard,
  Clock, MapPin, CheckCircle, AlertCircle, TrendingUp, Award, Zap,
  Shield, Wrench, Sparkles, Car, Heart, Crown, Target, Rocket
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-md mx-auto p-4">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="ghost" 
              onClick={() => setCurrentView('home')}
              className="text-white hover:text-yellow-400 hover:bg-white/10"
            >
              ← Back
            </Button>
            <WayaWayaLogo size="sm" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 via-green-400 to-blue-400 bg-clip-text text-transparent">
              Client Dashboard
            </h1>
          </div>

          {!isConnected && (
            <Alert className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Connecting to WAYA WAYA services...
              </AlertDescription>
            </Alert>
          )}

          {/* Hero Welcome Section */}
          <Card className="bg-gradient-to-br from-black/80 via-gray-900/90 to-black/80 backdrop-blur-md border border-yellow-500/30 shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-yellow-400 via-green-400 to-blue-400 p-1">
              <div className="bg-black/90 p-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-green-400 rounded-full flex items-center justify-center">
                      <Crown className="h-8 w-8 text-black" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">Welcome back!</h2>
                      <p className="text-yellow-400 font-medium">Premium Client</p>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-4">
                    Find trusted service providers for all your needs
                  </p>
                  <div className="flex items-center justify-center gap-6 text-sm">
                    <div className="flex items-center gap-2 text-green-400">
                      <CheckCircle className="h-4 w-4" />
                      <span>Verified</span>
                    </div>
                    <div className="flex items-center gap-2 text-blue-400">
                      <Shield className="h-4 w-4" />
                      <span>Protected</span>
                    </div>
                    <div className="flex items-center gap-2 text-yellow-400">
                      <Star className="h-4 w-4" />
                      <span>Premium</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-emerald-600 to-green-700 shadow-xl border-0 text-white overflow-hidden">
              <div className="bg-black/20 p-4">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-emerald-100 text-sm">
                    <Clock className="h-4 w-4" />
                    Active Requests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{activeRequests}</div>
                  <p className="text-sm text-emerald-100">In progress</p>
                </CardContent>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 shadow-xl border-0 text-white overflow-hidden">
              <div className="bg-black/20 p-4">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-blue-100 text-sm">
                    <CreditCard className="h-4 w-4" />
                    Total Spent
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">R{totalSpent.toFixed(2)}</div>
                  <p className="text-sm text-blue-100">This month</p>
                </CardContent>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-500 to-orange-600 shadow-xl border-0 text-white overflow-hidden">
              <div className="bg-black/20 p-4">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-yellow-100 text-sm">
                    <Star className="h-4 w-4" />
                    Average Rating
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{averageRating}</div>
                  <p className="text-sm text-yellow-100">From your reviews</p>
                </CardContent>
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="bg-gradient-to-br from-black/80 via-gray-900/90 to-black/80 backdrop-blur-md border border-yellow-500/30 shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4">
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </div>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <Button
                  className="h-16 flex-col bg-gradient-to-r from-yellow-400 via-green-400 to-blue-400 hover:from-yellow-500 hover:via-green-500 hover:to-blue-500 text-white shadow-lg"
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
          <Card className="bg-gradient-to-br from-black/80 via-gray-900/90 to-black/80 backdrop-blur-md border border-yellow-500/30 shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4">
              <CardTitle className="text-white flex items-center gap-2">
                <Award className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </div>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-500/30">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold">Plumbing service completed</p>
                    <p className="text-sm text-gray-300">John's Plumbing • R450</p>
                  </div>
                  <span className="text-xs text-gray-400 bg-black/40 px-3 py-1 rounded-full">2h ago</span>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl border border-blue-500/30">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold">Electrical repair scheduled</p>
                    <p className="text-sm text-gray-300">Spark Electric • R320</p>
                  </div>
                  <span className="text-xs text-gray-400 bg-black/40 px-3 py-1 rounded-full">Tomorrow</span>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl border border-yellow-500/30">
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold">You rated a service</p>
                    <p className="text-sm text-gray-300">Cleaning Pro • 5 stars</p>
                  </div>
                  <span className="text-xs text-gray-400 bg-black/40 px-3 py-1 rounded-full">1d ago</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Categories */}
          <Card className="bg-gradient-to-br from-black/80 via-gray-900/90 to-black/80 backdrop-blur-md border border-yellow-500/30 shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-pink-600 to-rose-600 p-4">
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="h-5 w-5" />
                Popular Services
              </CardTitle>
            </div>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button
                  variant="outline"
                  className="h-12 border-yellow-500/30 bg-black/40 text-gray-200 hover:bg-yellow-500/20 backdrop-blur-sm"
                  onClick={() => setCurrentView('service-selection')}
                >
                  <Wrench className="h-4 w-4 mr-2" />
                  Plumbing
                </Button>
                <Button
                  variant="outline"
                  className="h-12 border-yellow-500/30 bg-black/40 text-gray-200 hover:bg-yellow-500/20 backdrop-blur-sm"
                  onClick={() => setCurrentView('service-selection')}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Electrical
                </Button>
                <Button
                  variant="outline"
                  className="h-12 border-yellow-500/30 bg-black/40 text-gray-200 hover:bg-yellow-500/20 backdrop-blur-sm"
                  onClick={() => setCurrentView('service-selection')}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Cleaning
                </Button>
                <Button
                  variant="outline"
                  className="h-12 border-yellow-500/30 bg-black/40 text-gray-200 hover:bg-yellow-500/20 backdrop-blur-sm"
                  onClick={() => setCurrentView('service-selection')}
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Gardening
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Premium Features */}
          <Card className="bg-gradient-to-br from-black/80 via-gray-900/90 to-black/80 backdrop-blur-md border border-yellow-500/30 shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-4">
              <CardTitle className="text-white flex items-center gap-2">
                <Rocket className="h-5 w-5" />
                Premium Features
              </CardTitle>
            </div>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-500/30">
                  <Crown className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                  <p className="text-white font-semibold">Priority Booking</p>
                  <p className="text-xs text-gray-300">Skip the queue</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg border border-green-500/30">
                  <Shield className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <p className="text-white font-semibold">Insurance</p>
                  <p className="text-xs text-gray-300">Fully protected</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}; 