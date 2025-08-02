import React, { useState, useEffect } from 'react';
import { WayaWayaLogo } from '../shared/WayaWayaLogo';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import ChatSystem from '../ChatSystem';
import {
  Search, Calendar, Star, User, BarChart3, MessageCircle, CreditCard,
  Clock, MapPin, CheckCircle, AlertCircle, TrendingUp, Award, Zap,
  Shield, Wrench, Sparkles, Car, Heart, Target, Plus, Filter,
  X, Edit, Trash2, Phone, Mail, MapPin as LocationIcon, MessageSquare
} from 'lucide-react';
import { apiClient } from '../../utils/apiClient.js';

interface ClientViewProps {
  isConnected: boolean;
  authToken: string | null;
  setCurrentView: (view: string) => void;
}

interface ServiceRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  budget: number;
  location: string;
  createdAt: string;
  provider?: string;
  rating?: number;
}

interface ServiceProvider {
  id: string;
  name: string;
  service: string;
  rating: number;
  location: string;
  isOnline: boolean;
  avatar?: string;
}

export const ClientView: React.FC<ClientViewProps> = ({
  isConnected,
  authToken,
  setCurrentView
}) => {
  const [activeRequests, setActiveRequests] = useState(2);
  const [totalSpent, setTotalSpent] = useState(1250.75);
  const [averageRating, setAverageRating] = useState(4.6);
  const [showNewRequestDialog, setShowNewRequestDialog] = useState(false);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [showChatDialog, setShowChatDialog] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  const [currentUser, setCurrentUser] = useState({
    id: 'client-1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: undefined
  });
  
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([
    {
      id: '1',
      title: 'Plumbing Repair',
      description: 'Leaky faucet in kitchen needs fixing',
      category: 'Plumbing',
      status: 'completed',
      budget: 450,
      location: 'Cape Town, Western Cape',
      createdAt: '2024-01-15',
      provider: "John's Plumbing",
      rating: 5
    },
    {
      id: '2',
      title: 'Electrical Installation',
      description: 'New ceiling fan installation',
      category: 'Electrical',
      status: 'in-progress',
      budget: 320,
      location: 'Cape Town, Western Cape',
      createdAt: '2024-01-20',
      provider: 'Spark Electric'
    },
    {
      id: '3',
      title: 'Car Engine Repair',
      description: 'Engine making strange noises, needs diagnosis',
      category: 'Mechanic',
      status: 'pending',
      budget: 800,
      location: 'Cape Town, Western Cape',
      createdAt: '2024-01-25',
      provider: "Mike's Auto Repair"
    },
    {
      id: '4',
      title: 'House Cleaning',
      description: 'Deep cleaning of 3-bedroom house',
      category: 'Cleaning',
      status: 'completed',
      budget: 280,
      location: 'Cape Town, Western Cape',
      createdAt: '2024-01-18',
      provider: 'Clean Pro Services',
      rating: 4
    },
    {
      id: '5',
      title: 'Garden Maintenance',
      description: 'Monthly garden maintenance and pruning',
      category: 'Gardening',
      status: 'in-progress',
      budget: 150,
      location: 'Cape Town, Western Cape',
      createdAt: '2024-01-22',
      provider: 'Green Thumb Gardening'
    }
  ]);

  const [availableProviders, setAvailableProviders] = useState<ServiceProvider[]>([
    {
      id: 'provider-1',
      name: "John's Plumbing",
      service: 'Plumbing',
      rating: 4.8,
      location: 'Cape Town, Western Cape',
      isOnline: true,
      avatar: undefined
    },
    {
      id: 'provider-2',
      name: 'Spark Electric',
      service: 'Electrical',
      rating: 4.6,
      location: 'Cape Town, Western Cape',
      isOnline: true,
      avatar: undefined
    },
    {
      id: 'provider-3',
      name: 'Clean Pro Services',
      service: 'Cleaning',
      rating: 4.9,
      location: 'Cape Town, Western Cape',
      isOnline: false,
      avatar: undefined
    },
    {
      id: 'provider-4',
      name: 'Green Thumb Gardening',
      service: 'Gardening',
      rating: 4.7,
      location: 'Cape Town, Western Cape',
      isOnline: true,
      avatar: undefined
    },
    {
      id: 'provider-5',
      name: 'Mike\'s Auto Repair',
      service: 'Mechanic',
      rating: 4.5,
      location: 'Cape Town, Western Cape',
      isOnline: true,
      avatar: undefined
    },
    {
      id: 'provider-6',
      name: 'Carpentry Masters',
      service: 'Carpentry',
      rating: 4.4,
      location: 'Cape Town, Western Cape',
      isOnline: true,
      avatar: undefined
    },
    {
      id: 'provider-7',
      name: 'Paint Pro Services',
      service: 'Painting',
      rating: 4.3,
      location: 'Cape Town, Western Cape',
      isOnline: false,
      avatar: undefined
    },
    {
      id: 'provider-8',
      name: 'Security Solutions',
      service: 'Security',
      rating: 4.8,
      location: 'Cape Town, Western Cape',
      isOnline: true,
      avatar: undefined
    }
  ]);

  const [newRequest, setNewRequest] = useState({
    title: '',
    description: '',
    category: '',
    budget: '',
    location: ''
  });

  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    minBudget: '',
    maxBudget: ''
  });

  const handleCreateRequest = () => {
    if (newRequest.title && newRequest.description && newRequest.category && newRequest.budget && newRequest.location) {
      const request: ServiceRequest = {
        id: Date.now().toString(),
        title: newRequest.title,
        description: newRequest.description,
        category: newRequest.category,
        status: 'pending',
        budget: parseFloat(newRequest.budget),
        location: newRequest.location,
        createdAt: new Date().toISOString().split('T')[0]
      };
      
      setServiceRequests([request, ...serviceRequests]);
      setActiveRequests(activeRequests + 1);
      setNewRequest({ title: '', description: '', category: '', budget: '', location: '' });
      setShowNewRequestDialog(false);
    }
  };

  const handleStartChat = (provider: ServiceProvider) => {
    setSelectedProvider(provider);
    setShowChatDialog(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500 text-yellow-900';
      case 'in-progress': return 'bg-blue-500 text-blue-900';
      case 'completed': return 'bg-green-500 text-green-900';
      case 'cancelled': return 'bg-red-500 text-red-900';
      default: return 'bg-gray-500 text-gray-900';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'plumbing': return <Wrench className="h-4 w-4" />;
      case 'electrical': return <Zap className="h-4 w-4" />;
      case 'cleaning': return <Sparkles className="h-4 w-4" />;
      case 'gardening': return <Heart className="h-4 w-4" />;
      case 'carpentry': return <Wrench className="h-4 w-4" />;
      case 'mechanic': return <Car className="h-4 w-4" />;
      case 'security': return <Shield className="h-4 w-4" />;
      case 'painting': return <Award className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const filteredRequests = serviceRequests.filter(request => {
    if (filters.status !== 'all' && request.status !== filters.status) return false;
    if (filters.category !== 'all' && request.category !== filters.category) return false;
    if (filters.minBudget && request.budget < parseFloat(filters.minBudget)) return false;
    if (filters.maxBudget && request.budget > parseFloat(filters.maxBudget)) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 via-yellow-500 to-red-600">
      {/* COMPLETELY NEW HEADER DESIGN */}
      <div className="bg-black/30 backdrop-blur-lg border-b border-white/40 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Button 
                variant="ghost" 
                onClick={() => setCurrentView('home')}
                className="text-white hover:text-yellow-200 hover:bg-white/30 rounded-2xl p-3 transition-all duration-300"
              >
                ← Back to Home
              </Button>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center shadow-lg">
                  <WayaWayaLogo size="sm" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white drop-shadow-lg">Client Dashboard</h1>
                  <p className="text-white/80 text-sm font-medium">Your service management hub</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setShowFilterDialog(true)}
                variant="outline"
                className="border-white/50 bg-white/20 text-white hover:bg-white/30 rounded-2xl px-6 py-3 transition-all duration-300"
              >
                <Filter className="h-5 w-5 mr-3" />
                Filter Requests
              </Button>
              <Button
                onClick={() => setShowNewRequestDialog(true)}
                className="bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white rounded-2xl px-6 py-3 shadow-lg transition-all duration-300"
              >
                <Plus className="h-5 w-5 mr-3" />
                New Request
              </Button>
              <Button
                onClick={() => setShowChatDialog(true)}
                className="bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 text-white rounded-2xl px-6 py-3 shadow-lg transition-all duration-300"
              >
                <MessageSquare className="h-5 w-5 mr-3" />
                Chat Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* COMPLETELY NEW MAIN CONTENT LAYOUT */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          
          {/* NEW LEFT SIDEBAR - COMPACT DESIGN */}
          <div className="xl:col-span-1 space-y-6">
            
            {/* NEW CONNECTION STATUS */}
            {!isConnected && (
              <Alert className="bg-gradient-to-r from-yellow-900/80 to-orange-900/80 border-yellow-400/50 backdrop-blur-lg rounded-2xl shadow-xl">
                <AlertCircle className="h-5 w-5 text-yellow-200" />
                <AlertDescription className="text-white font-medium">
                  Connecting to WAYA WAYA services...
                </AlertDescription>
              </Alert>
            )}

            {/* NEW WELCOME CARD - COMPLETELY REDESIGNED */}
            <Card className="bg-gradient-to-r from-purple-900/90 to-pink-900/90 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl overflow-hidden">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <User className="h-10 w-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-3 drop-shadow-lg">Welcome back!</h2>
                  <p className="text-white/90 text-base leading-relaxed">
                    Ready to find amazing service providers? Let's get started!
                  </p>
                  <div className="mt-6 flex justify-center">
                    <div className="w-16 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* NEW STATS CARDS - COMPLETELY REDESIGNED */}
            <div className="space-y-4">
              <Card className="bg-gradient-to-r from-blue-900/90 to-cyan-900/90 border-white/40 backdrop-blur-xl rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-cyan-200 text-sm font-semibold uppercase tracking-wide">Active Requests</p>
                      <p className="text-3xl font-bold text-white mt-1">{activeRequests}</p>
                      <p className="text-cyan-200/70 text-xs mt-1">Currently processing</p>
                    </div>
                    <div className="w-14 h-14 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <Clock className="h-7 w-7 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-900/90 to-emerald-900/90 border-white/40 backdrop-blur-xl rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-emerald-200 text-sm font-semibold uppercase tracking-wide">Total Spent</p>
                      <p className="text-3xl font-bold text-white mt-1">R{totalSpent.toFixed(2)}</p>
                      <p className="text-emerald-200/70 text-xs mt-1">This month</p>
                    </div>
                    <div className="w-14 h-14 bg-gradient-to-r from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <CreditCard className="h-7 w-7 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-yellow-900/90 to-orange-900/90 border-white/40 backdrop-blur-xl rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-200 text-sm font-semibold uppercase tracking-wide">Average Rating</p>
                      <p className="text-3xl font-bold text-white mt-1">{averageRating}</p>
                      <p className="text-orange-200/70 text-xs mt-1">Out of 5 stars</p>
                    </div>
                    <div className="w-14 h-14 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <Star className="h-7 w-7 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* NEW QUICK ACTIONS - COMPLETELY REDESIGNED */}
            <Card className="bg-gradient-to-r from-indigo-900/90 to-purple-900/90 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="text-white text-xl font-bold">Quick Actions</CardTitle>
                <p className="text-white/70 text-sm">Access your most used features</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    className="h-16 flex-col bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white shadow-xl rounded-2xl transition-all duration-300 hover:scale-105"
                    onClick={() => setCurrentView('service-selection')}
                  >
                    <Search className="h-6 w-6 mb-2" />
                    <span className="text-sm font-medium">Find Services</span>
                  </Button>
                  <Button
                    className="h-16 flex-col bg-gradient-to-r from-blue-400 to-cyan-500 hover:from-blue-500 hover:to-cyan-600 text-white shadow-xl rounded-2xl transition-all duration-300 hover:scale-105"
                    onClick={() => setCurrentView('bookings')}
                  >
                    <Calendar className="h-6 w-6 mb-2" />
                    <span className="text-sm font-medium">My Bookings</span>
                  </Button>
                  <Button
                    className="h-16 flex-col bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white shadow-xl rounded-2xl transition-all duration-300 hover:scale-105"
                    onClick={() => setCurrentView('profile')}
                  >
                    <User className="h-6 w-6 mb-2" />
                    <span className="text-sm font-medium">My Profile</span>
                  </Button>
                  <Button
                    className="h-16 flex-col bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 text-white shadow-xl rounded-2xl transition-all duration-300 hover:scale-105"
                    onClick={() => setShowChatDialog(true)}
                  >
                    <MessageCircle className="h-6 w-6 mb-2" />
                    <span className="text-sm font-medium">Messages</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* NEW MAIN CONTENT AREA - COMPLETELY REDESIGNED */}
          <div className="xl:col-span-3 space-y-8">
            
            {/* NEW SERVICE PROVIDERS SECTION - COMPLETELY REDESIGNED */}
            <Card className="bg-gradient-to-r from-indigo-900/90 to-purple-900/90 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl overflow-hidden">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white text-2xl font-bold">Available Service Providers</CardTitle>
                    <p className="text-white/70 text-sm mt-1">Connect with trusted professionals</p>
                  </div>
                  <Badge variant="secondary" className="bg-white/20 text-white rounded-full px-4 py-2 text-sm font-semibold">
                    {availableProviders.filter(p => p.isOnline).length} online now
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {availableProviders.map((provider) => (
                    <div key={provider.id} className="group flex items-center justify-between p-6 bg-black/50 rounded-2xl border border-white/30 hover:bg-black/70 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                            {provider.name.charAt(0)}
                          </div>
                          <div className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-3 border-white shadow-lg ${
                            provider.isOnline ? 'bg-green-500' : 'bg-gray-400'
                          }`} />
                        </div>
                        <div>
                          <h3 className="text-white font-bold text-lg">{provider.name}</h3>
                          <p className="text-white/80 text-sm font-medium">{provider.service}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="text-sm text-white/90 font-semibold">{provider.rating}</span>
                            </div>
                            <span className="text-white/60">•</span>
                            <span className="text-sm text-white/80">{provider.location}</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleStartChat(provider)}
                        className="bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white rounded-2xl px-6 py-3 shadow-lg transition-all duration-300 group-hover:scale-110"
                        size="sm"
                      >
                        <MessageSquare className="h-5 w-5 mr-2" />
                        Chat Now
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* NEW SERVICE REQUESTS SECTION - COMPLETELY REDESIGNED */}
            <Card className="bg-gradient-to-r from-slate-900/90 to-gray-900/90 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl overflow-hidden">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white text-2xl font-bold">Service Requests</CardTitle>
                    <p className="text-white/70 text-sm mt-1">Track your service requests</p>
                  </div>
                  <Badge variant="secondary" className="bg-white/20 text-white rounded-full px-4 py-2 text-sm font-semibold">
                    {filteredRequests.length} requests
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {filteredRequests.length === 0 ? (
                    <div className="text-center py-16 text-white/70">
                      <Target className="h-20 w-20 mx-auto mb-6 opacity-50" />
                      <h3 className="text-2xl font-bold mb-3">No service requests found</h3>
                      <p className="text-lg">Create your first service request to get started</p>
                      <Button
                        onClick={() => setShowNewRequestDialog(true)}
                        className="mt-6 bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white rounded-2xl px-8 py-3 shadow-lg"
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        Create First Request
                      </Button>
                    </div>
                  ) : (
                    filteredRequests.map((request) => (
                      <div key={request.id} className="group flex items-center gap-6 p-6 bg-black/50 rounded-2xl border border-white/30 hover:bg-black/70 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                        <div className="flex-shrink-0">
                          <div className="w-14 h-14 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                            {getCategoryIcon(request.category)}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-white font-bold text-lg">{request.title}</h3>
                            <Badge className={`${getStatusColor(request.status)} rounded-full text-xs font-semibold px-3 py-1`}>
                              {request.status}
                            </Badge>
                          </div>
                          <p className="text-white/80 text-base mb-4 leading-relaxed">{request.description}</p>
                          <div className="flex items-center gap-6 text-sm text-white/70">
                            <span className="flex items-center gap-2">
                              <LocationIcon className="h-4 w-4" />
                              {request.location}
                            </span>
                            <span className="flex items-center gap-2">
                              <CreditCard className="h-4 w-4" />
                              R{request.budget}
                            </span>
                            {request.provider && (
                              <span className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                {request.provider}
                              </span>
                            )}
                            {request.rating && (
                              <span className="flex items-center gap-2">
                                <Star className="h-4 w-4" />
                                {request.rating}/5
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Button size="sm" variant="outline" className="border-white/40 bg-white/20 text-white hover:bg-white/30 rounded-2xl px-4 py-2 transition-all duration-300">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="border-red-400/40 bg-red-500/20 text-red-200 hover:bg-red-500/30 rounded-2xl px-4 py-2 transition-all duration-300">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* NEW SERVICE CATEGORIES SECTION - COMPLETELY REDESIGNED */}
            <Card className="bg-gradient-to-r from-teal-900/90 to-cyan-900/90 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl overflow-hidden">
              <CardHeader className="pb-6">
                <CardTitle className="text-white text-2xl font-bold">Popular Services</CardTitle>
                <p className="text-white/70 text-sm mt-1">Browse our most requested services</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button
                    className="h-16 bg-gradient-to-r from-blue-400 to-cyan-500 hover:from-blue-500 hover:to-cyan-600 text-white shadow-xl rounded-2xl transition-all duration-300 hover:scale-105"
                    onClick={() => setCurrentView('service-selection')}
                  >
                    <Wrench className="h-5 w-5 mr-3" />
                    Plumbing
                  </Button>
                  <Button
                    className="h-16 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white shadow-xl rounded-2xl transition-all duration-300 hover:scale-105"
                    onClick={() => setCurrentView('service-selection')}
                  >
                    <Zap className="h-5 w-5 mr-3" />
                    Electrical
                  </Button>
                  <Button
                    className="h-16 bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white shadow-xl rounded-2xl transition-all duration-300 hover:scale-105"
                    onClick={() => setCurrentView('service-selection')}
                  >
                    <Sparkles className="h-5 w-5 mr-3" />
                    Cleaning
                  </Button>
                  <Button
                    className="h-16 bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 text-white shadow-xl rounded-2xl transition-all duration-300 hover:scale-105"
                    onClick={() => setCurrentView('service-selection')}
                  >
                    <Heart className="h-5 w-5 mr-3" />
                    Gardening
                  </Button>
                  <Button
                    className="h-16 bg-gradient-to-r from-red-400 to-orange-500 hover:from-red-500 hover:to-orange-600 text-white shadow-xl rounded-2xl transition-all duration-300 hover:scale-105"
                    onClick={() => setCurrentView('service-selection')}
                  >
                    <Car className="h-5 w-5 mr-3" />
                    Mechanic
                  </Button>
                  <Button
                    className="h-16 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-white shadow-xl rounded-2xl transition-all duration-300 hover:scale-105"
                    onClick={() => setCurrentView('service-selection')}
                  >
                    <Wrench className="h-5 w-5 mr-3" />
                    Carpentry
                  </Button>
                  <Button
                    className="h-16 bg-gradient-to-r from-indigo-400 to-purple-500 hover:from-indigo-500 hover:to-purple-600 text-white shadow-xl rounded-2xl transition-all duration-300 hover:scale-105"
                    onClick={() => setCurrentView('service-selection')}
                  >
                    <Shield className="h-5 w-5 mr-3" />
                    Security
                  </Button>
                  <Button
                    className="h-16 bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-500 hover:to-cyan-600 text-white shadow-xl rounded-2xl transition-all duration-300 hover:scale-105"
                    onClick={() => setCurrentView('service-selection')}
                  >
                    <Award className="h-5 w-5 mr-3" />
                    Painting
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* New Request Dialog */}
      <Dialog open={showNewRequestDialog} onOpenChange={setShowNewRequestDialog}>
        <DialogContent className="bg-white/95 backdrop-blur-md border border-white/30">
          <DialogHeader>
            <DialogTitle className="text-gray-800">Create New Service Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-gray-700">Service Title</Label>
              <Input
                id="title"
                value={newRequest.title}
                onChange={(e) => setNewRequest({...newRequest, title: e.target.value})}
                placeholder="e.g., Plumbing Repair"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="description" className="text-gray-700">Description</Label>
              <Textarea
                id="description"
                value={newRequest.description}
                onChange={(e) => setNewRequest({...newRequest, description: e.target.value})}
                placeholder="Describe your service need..."
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="category" className="text-gray-700">Category</Label>
              <Select value={newRequest.category} onValueChange={(value) => setNewRequest({...newRequest, category: value})}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Plumbing">Plumbing</SelectItem>
                  <SelectItem value="Electrical">Electrical</SelectItem>
                  <SelectItem value="Cleaning">Cleaning</SelectItem>
                  <SelectItem value="Gardening">Gardening</SelectItem>
                  <SelectItem value="Carpentry">Carpentry</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="budget" className="text-gray-700">Budget (R)</Label>
              <Input
                id="budget"
                type="number"
                value={newRequest.budget}
                onChange={(e) => setNewRequest({...newRequest, budget: e.target.value})}
                placeholder="500"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="location" className="text-gray-700">Location</Label>
              <Input
                id="location"
                value={newRequest.location}
                onChange={(e) => setNewRequest({...newRequest, location: e.target.value})}
                placeholder="e.g., Cape Town, Western Cape"
                className="mt-1"
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleCreateRequest}
                className="flex-1 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white"
              >
                Create Request
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowNewRequestDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Filter Dialog */}
      <Dialog open={showFilterDialog} onOpenChange={setShowFilterDialog}>
        <DialogContent className="bg-white/95 backdrop-blur-md border border-white/30">
          <DialogHeader>
            <DialogTitle className="text-gray-800">Filter Requests</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="status" className="text-gray-700">Status</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="category" className="text-gray-700">Category</Label>
              <Select value={filters.category} onValueChange={(value) => setFilters({...filters, category: value})}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Plumbing">Plumbing</SelectItem>
                  <SelectItem value="Electrical">Electrical</SelectItem>
                  <SelectItem value="Cleaning">Cleaning</SelectItem>
                  <SelectItem value="Gardening">Gardening</SelectItem>
                  <SelectItem value="Carpentry">Carpentry</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minBudget" className="text-gray-700">Min Budget</Label>
                <Input
                  id="minBudget"
                  type="number"
                  value={filters.minBudget}
                  onChange={(e) => setFilters({...filters, minBudget: e.target.value})}
                  placeholder="0"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="maxBudget" className="text-gray-700">Max Budget</Label>
                <Input
                  id="maxBudget"
                  type="number"
                  value={filters.maxBudget}
                  onChange={(e) => setFilters({...filters, maxBudget: e.target.value})}
                  placeholder="1000"
                  className="mt-1"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                onClick={() => setFilters({status: 'all', category: 'all', minBudget: '', maxBudget: ''})}
                variant="outline"
                className="flex-1"
              >
                Clear Filters
              </Button>
              <Button
                onClick={() => setShowFilterDialog(false)}
                className="flex-1 bg-gradient-to-r from-blue-400 to-cyan-500 hover:from-blue-500 hover:to-cyan-600 text-white"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Chat System */}
      <ChatSystem
        currentUser={currentUser}
        selectedProvider={selectedProvider}
        isOpen={showChatDialog}
        onClose={() => {
          setShowChatDialog(false);
          setSelectedProvider(null);
        }}
      />
    </div>
  );
};
