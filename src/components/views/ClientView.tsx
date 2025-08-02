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
      {/* Modern Header */}
      <div className="bg-black/20 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Button 
                variant="ghost" 
                onClick={() => setCurrentView('home')}
                className="text-white hover:text-yellow-200 hover:bg-white/20 rounded-full p-2"
              >
                ← Back
              </Button>
              <div className="flex items-center gap-3">
                <WayaWayaLogo size="sm" />
                <div>
                  <h1 className="text-2xl font-bold text-white">Client Dashboard</h1>
                  <p className="text-white/70 text-sm">Manage your service requests</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setShowFilterDialog(true)}
                variant="outline"
                className="border-white/40 bg-white/10 text-white hover:bg-white/20 rounded-full"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button
                onClick={() => setShowNewRequestDialog(true)}
                className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white rounded-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Request
              </Button>
              <Button
                onClick={() => setShowChatDialog(true)}
                className="bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 text-white rounded-full"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Stats & Quick Actions */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Connection Status */}
            {!isConnected && (
              <Alert className="bg-white/20 border-white/30 backdrop-blur-sm rounded-xl">
                <AlertCircle className="h-4 w-4 text-yellow-200" />
                <AlertDescription className="text-white">
                  Connecting to WAYA WAYA services...
                </AlertDescription>
              </Alert>
            )}

            {/* Welcome Card */}
            <Card className="bg-gradient-to-r from-purple-900/80 to-pink-900/80 backdrop-blur-md border border-white/30 shadow-2xl rounded-2xl">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-white mb-2">Welcome back!</h2>
                  <p className="text-white/90 text-sm">
                    Find trusted service providers for all your needs
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="space-y-4">
              <Card className="bg-gradient-to-r from-blue-900/80 to-cyan-900/80 border-white/30 backdrop-blur-sm rounded-xl">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-cyan-200 text-sm font-medium">Active Requests</p>
                      <p className="text-2xl font-bold text-white">{activeRequests}</p>
                    </div>
                    <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center">
                      <Clock className="h-6 w-6 text-cyan-200" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-900/80 to-emerald-900/80 border-white/30 backdrop-blur-sm rounded-xl">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-emerald-200 text-sm font-medium">Total Spent</p>
                      <p className="text-2xl font-bold text-white">R{totalSpent.toFixed(2)}</p>
                    </div>
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
                      <CreditCard className="h-6 w-6 text-emerald-200" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-yellow-900/80 to-orange-900/80 border-white/30 backdrop-blur-sm rounded-xl">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-200 text-sm font-medium">Average Rating</p>
                      <p className="text-2xl font-bold text-white">{averageRating}</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
                      <Star className="h-6 w-6 text-orange-200" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="bg-gradient-to-r from-indigo-900/80 to-purple-900/80 backdrop-blur-md border border-white/30 shadow-2xl rounded-2xl">
              <CardHeader>
                <CardTitle className="text-white text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    className="h-14 flex-col bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white shadow-lg rounded-xl"
                    onClick={() => setCurrentView('service-selection')}
                  >
                    <Search className="h-5 w-5 mb-1" />
                    <span className="text-xs">Find Services</span>
                  </Button>
                  <Button
                    className="h-14 flex-col bg-gradient-to-r from-blue-400 to-cyan-500 hover:from-blue-500 hover:to-cyan-600 text-white shadow-lg rounded-xl"
                    onClick={() => setCurrentView('bookings')}
                  >
                    <Calendar className="h-5 w-5 mb-1" />
                    <span className="text-xs">My Bookings</span>
                  </Button>
                  <Button
                    className="h-14 flex-col bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white shadow-lg rounded-xl"
                    onClick={() => setCurrentView('profile')}
                  >
                    <User className="h-5 w-5 mb-1" />
                    <span className="text-xs">My Profile</span>
                  </Button>
                  <Button
                    className="h-14 flex-col bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 text-white shadow-lg rounded-xl"
                    onClick={() => setShowChatDialog(true)}
                  >
                    <MessageCircle className="h-5 w-5 mb-1" />
                    <span className="text-xs">Messages</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Available Service Providers */}
            <Card className="bg-gradient-to-r from-indigo-900/80 to-purple-900/80 backdrop-blur-md border border-white/30 shadow-2xl rounded-2xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span>Available Service Providers</span>
                  <Badge variant="secondary" className="bg-white/20 text-white rounded-full">
                    {availableProviders.filter(p => p.isOnline).length} online
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableProviders.map((provider) => (
                    <div key={provider.id} className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/30 hover:bg-black/50 transition-all duration-200 hover:scale-105">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {provider.name.charAt(0)}
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                            provider.isOnline ? 'bg-green-500' : 'bg-gray-400'
                          }`} />
                        </div>
                        <div>
                          <h3 className="text-white font-medium">{provider.name}</h3>
                          <p className="text-sm text-white/80">{provider.service}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-white/80">{provider.rating}</span>
                            <span className="text-xs text-white/60">•</span>
                            <span className="text-xs text-white/60">{provider.location}</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleStartChat(provider)}
                        className="bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white rounded-full"
                        size="sm"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Chat
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Service Requests */}
            <Card className="bg-gradient-to-r from-slate-900/80 to-gray-900/80 backdrop-blur-md border border-white/30 shadow-2xl rounded-2xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span>Service Requests</span>
                  <Badge variant="secondary" className="bg-white/20 text-white rounded-full">
                    {filteredRequests.length} requests
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredRequests.length === 0 ? (
                    <div className="text-center py-12 text-white/70">
                      <Target className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-semibold mb-2">No service requests found</h3>
                      <p className="text-sm">Create your first service request to get started</p>
                    </div>
                  ) : (
                    filteredRequests.map((request) => (
                      <div key={request.id} className="flex items-center gap-4 p-4 bg-black/40 rounded-xl border border-white/30 hover:bg-black/50 transition-all duration-200">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center">
                            {getCategoryIcon(request.category)}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-white font-medium">{request.title}</h3>
                            <Badge className={`${getStatusColor(request.status)} rounded-full text-xs`}>
                              {request.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-white/80 mb-2">{request.description}</p>
                          <div className="flex items-center gap-4 text-xs text-white/60">
                            <span className="flex items-center gap-1">
                              <LocationIcon className="h-3 w-3" />
                              {request.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <CreditCard className="h-3 w-3" />
                              R{request.budget}
                            </span>
                            {request.provider && (
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {request.provider}
                              </span>
                            )}
                            {request.rating && (
                              <span className="flex items-center gap-1">
                                <Star className="h-3 w-3" />
                                {request.rating}/5
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="border-white/40 bg-white/20 text-white hover:bg-white/30 rounded-full">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="border-red-400/40 bg-red-500/20 text-red-200 hover:bg-red-500/30 rounded-full">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Service Categories */}
            <Card className="bg-gradient-to-r from-teal-900/80 to-cyan-900/80 backdrop-blur-md border border-white/30 shadow-2xl rounded-2xl">
              <CardHeader>
                <CardTitle className="text-white">Popular Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button
                    className="h-12 bg-gradient-to-r from-blue-400 to-cyan-500 hover:from-blue-500 hover:to-cyan-600 text-white shadow-lg rounded-xl"
                    onClick={() => setCurrentView('service-selection')}
                  >
                    <Wrench className="h-4 w-4 mr-2" />
                    Plumbing
                  </Button>
                  <Button
                    className="h-12 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white shadow-lg rounded-xl"
                    onClick={() => setCurrentView('service-selection')}
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Electrical
                  </Button>
                  <Button
                    className="h-12 bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white shadow-lg rounded-xl"
                    onClick={() => setCurrentView('service-selection')}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Cleaning
                  </Button>
                  <Button
                    className="h-12 bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 text-white shadow-lg rounded-xl"
                    onClick={() => setCurrentView('service-selection')}
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Gardening
                  </Button>
                  <Button
                    className="h-12 bg-gradient-to-r from-red-400 to-orange-500 hover:from-red-500 hover:to-orange-600 text-white shadow-lg rounded-xl"
                    onClick={() => setCurrentView('service-selection')}
                  >
                    <Car className="h-4 w-4 mr-2" />
                    Mechanic
                  </Button>
                  <Button
                    className="h-12 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-white shadow-lg rounded-xl"
                    onClick={() => setCurrentView('service-selection')}
                  >
                    <Wrench className="h-4 w-4 mr-2" />
                    Carpentry
                  </Button>
                  <Button
                    className="h-12 bg-gradient-to-r from-indigo-400 to-purple-500 hover:from-indigo-500 hover:to-purple-600 text-white shadow-lg rounded-xl"
                    onClick={() => setCurrentView('service-selection')}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Security
                  </Button>
                  <Button
                    className="h-12 bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-500 hover:to-cyan-600 text-white shadow-lg rounded-xl"
                    onClick={() => setCurrentView('service-selection')}
                  >
                    <Award className="h-4 w-4 mr-2" />
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
