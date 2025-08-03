import React, { useState, useEffect } from 'react';
import { WayaWayaLogo } from '../shared/WayaWayaLogo';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
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
  X, Edit, Trash2, Phone, Mail, MapPin as LocationIcon, MessageSquare, FileText, Users, DollarSign
} from 'lucide-react';
import { apiClient } from '../../utils/apiClient.js';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

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
  date?: string; // Added for new code
  reviews?: number; // Added for new code
}

interface ServiceProvider {
  id: string;
  name: string;
  service: string;
  rating: number;
  location: string;
  isOnline: boolean;
  avatar?: string;
  reviews?: number; // Added for new code
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
      rating: 5,
      date: '2024-01-15',
      reviews: 10
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
      provider: 'Spark Electric',
      date: '2024-01-20',
      reviews: 5
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
      provider: "Mike's Auto Repair",
      date: '2024-01-25',
      reviews: 2
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
      rating: 4,
      date: '2024-01-18',
      reviews: 8
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
      provider: 'Green Thumb Gardening',
      date: '2024-01-22',
      reviews: 3
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
      avatar: undefined,
      reviews: 15
    },
    {
      id: 'provider-2',
      name: 'Spark Electric',
      service: 'Electrical',
      rating: 4.6,
      location: 'Cape Town, Western Cape',
      isOnline: true,
      avatar: undefined,
      reviews: 10
    },
    {
      id: 'provider-3',
      name: 'Clean Pro Services',
      service: 'Cleaning',
      rating: 4.9,
      location: 'Cape Town, Western Cape',
      isOnline: false,
      avatar: undefined,
      reviews: 20
    },
    {
      id: 'provider-4',
      name: 'Green Thumb Gardening',
      service: 'Gardening',
      rating: 4.7,
      location: 'Cape Town, Western Cape',
      isOnline: true,
      avatar: undefined,
      reviews: 12
    },
    {
      id: 'provider-5',
      name: 'Mike\'s Auto Repair',
      service: 'Mechanic',
      rating: 4.5,
      location: 'Cape Town, Western Cape',
      isOnline: true,
      avatar: undefined,
      reviews: 8
    },
    {
      id: 'provider-6',
      name: 'Carpentry Masters',
      service: 'Carpentry',
      rating: 4.4,
      location: 'Cape Town, Western Cape',
      isOnline: true,
      avatar: undefined,
      reviews: 10
    },
    {
      id: 'provider-7',
      name: 'Paint Pro Services',
      service: 'Painting',
      rating: 4.3,
      location: 'Cape Town, Western Cape',
      isOnline: false,
      avatar: undefined,
      reviews: 15
    },
    {
      id: 'provider-8',
      name: 'Security Solutions',
      service: 'Security',
      rating: 4.8,
      location: 'Cape Town, Western Cape',
      isOnline: true,
      avatar: undefined,
      reviews: 25
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
        createdAt: new Date().toISOString().split('T')[0],
        date: new Date().toISOString().split('T')[0], // Added for new code
        reviews: 0 // Added for new code
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

  const handleProviderClick = (provider: ServiceProvider) => {
    setSelectedProvider(provider);
    setShowChatDialog(true);
  };

  const handleRequestClick = (request: ServiceRequest) => {
    // Logic to view request details
    console.log('Viewing request:', request);
  };

  const handleCategoryClick = (category: string) => {
    // Logic to navigate to service selection based on category
    console.log('Navigating to service selection for category:', category);
    setCurrentView('service-selection');
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
      {/* Simple Header */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => setCurrentView('home')}
              className="text-white hover:text-white hover:bg-white/20 rounded-xl p-3 transition-all duration-300"
            >
              ← Back
            </Button>
            <WayaWayaLogo size="sm" />
          </div>
          <div className="text-right text-white">
            <div className="text-lg font-bold">Client Dashboard</div>
            <div className="text-sm opacity-80">Manage your service requests</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-gradient-to-br from-slate-400 via-blue-500 to-slate-600 backdrop-blur-sm border-0 shadow-2xl rounded-2xl overflow-hidden">
          <div className="p-8">
            <div className="max-w-6xl mx-auto">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">Welcome back, {currentUser.name}!</h1>
                <p className="text-white/80 text-lg">Manage your service requests and connect with providers</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="bg-gradient-to-br from-blue-600 via-grey-600 to-red-600 backdrop-blur-sm border border-gray-300 shadow-lg rounded-xl">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/90 text-sm font-medium uppercase tracking-wide">Active Requests</p>
                        <p className="text-white text-3xl font-bold mt-1">{serviceRequests.length}</p>
                        <p className="text-white/70 text-xs mt-1">In progress</p>
                      </div>
                      <div className="bg-white/20 p-3 rounded-full">
                        <FileText className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-600 via-grey-600 to-red-600 backdrop-blur-sm border border-gray-300 shadow-lg rounded-xl">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/90 text-sm font-medium uppercase tracking-wide">Available Providers</p>
                        <p className="text-white text-3xl font-bold mt-1">{availableProviders.length}</p>
                        <p className="text-white/70 text-xs mt-1">Ready to help</p>
                      </div>
                      <div className="bg-white/20 p-3 rounded-full">
                        <Users className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-600 via-grey-600 to-red-600 backdrop-blur-sm border border-gray-300 shadow-lg rounded-xl">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/90 text-sm font-medium uppercase tracking-wide">Completed</p>
                        <p className="text-white text-3xl font-bold mt-1">12</p>
                        <p className="text-white/70 text-xs mt-1">This month</p>
                      </div>
                      <div className="bg-white/20 p-3 rounded-full">
                        <CheckCircle className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-600 via-grey-600 to-red-600 backdrop-blur-sm border border-gray-300 shadow-lg rounded-xl">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/90 text-sm font-medium uppercase tracking-wide">Total Spent</p>
                        <p className="text-white text-3xl font-bold mt-1">R2,450</p>
                        <p className="text-white/70 text-xs mt-1">This month</p>
                      </div>
                      <div className="bg-white/20 p-3 rounded-full">
                        <DollarSign className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                {/* Available Providers */}
                <div className="xl:col-span-2">
                  <Card className="bg-gradient-to-br from-blue-600 via-grey-600 to-red-600 backdrop-blur-sm border border-gray-300 shadow-lg rounded-xl">
                    <CardHeader>
                      <CardTitle className="text-white text-xl font-semibold">Available Service Providers</CardTitle>
                      <CardDescription className="text-white/80">Connect with trusted professionals</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {availableProviders.slice(0, 4).map((provider) => (
                          <div key={provider.id} className="bg-white/10 border border-white/20 rounded-xl p-4 hover:bg-white/20 transition-all duration-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <Avatar className="h-12 w-12">
                                  <AvatarImage src={provider.avatar} />
                                  <AvatarFallback className="bg-white/20 text-white">
                                    {provider.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h3 className="text-white font-semibold text-lg">{provider.name}</h3>
                                  <p className="text-white/80 text-sm">{provider.service}</p>
                                  <div className="flex items-center mt-1">
                                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                    <span className="text-white/80 text-sm ml-1">{provider.rating}</span>
                                    <span className="text-white/60 text-xs ml-2">({provider.reviews} reviews)</span>
                                  </div>
                                </div>
                              </div>
                              <Button 
                                size="sm" 
                                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                                onClick={() => handleProviderClick(provider)}
                              >
                                Contact
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Service Requests */}
                <div className="xl:col-span-2">
                  <Card className="bg-gradient-to-br from-blue-600 via-grey-600 to-red-600 backdrop-blur-sm border border-gray-300 shadow-lg rounded-xl">
                    <CardHeader>
                      <CardTitle className="text-white text-xl font-semibold">Your Service Requests</CardTitle>
                      <CardDescription className="text-white/80">Track your ongoing projects</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {filteredRequests.slice(0, 3).map((request) => (
                          <div key={request.id} className="bg-white/10 border border-white/20 rounded-xl p-4 hover:bg-white/20 transition-all duration-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="bg-white/20 p-2 rounded-lg">
                                  {getCategoryIcon(request.category)}
                                </div>
                                <div>
                                  <h3 className="text-white font-semibold text-lg">{request.title}</h3>
                                  <p className="text-white/80 text-sm">{request.description}</p>
                                  <div className="flex items-center mt-2 space-x-4">
                                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                                      {request.status}
                                    </Badge>
                                    <span className="text-white/60 text-xs">{request.date}</span>
                                  </div>
                                </div>
                              </div>
                              <Button 
                                size="sm" 
                                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                                onClick={() => handleRequestClick(request)}
                              >
                                View
                              </Button>
                            </div>
                          </div>
                        ))}
                        {filteredRequests.length === 0 && (
                          <div className="text-center py-8">
                            <FileText className="h-12 w-12 text-white/40 mx-auto mb-4" />
                            <h3 className="text-white font-semibold mb-2">No service requests yet</h3>
                            <p className="text-white/60 mb-4">Start by creating your first service request</p>
                            <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                              Create Request
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Service Categories */}
              <div className="mt-8">
                <Card className="bg-gradient-to-br from-blue-600 via-grey-600 to-red-600 backdrop-blur-sm border border-gray-300 shadow-lg rounded-xl">
                  <CardHeader>
                    <CardTitle className="text-white text-xl font-semibold">Popular Service Categories</CardTitle>
                    <CardDescription className="text-white/80">Find the right service for your needs</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {['Plumbing', 'Electrical', 'Cleaning', 'Carpentry'].map((category) => (
                        <Button
                          key={category}
                          variant="outline"
                          className="bg-white/20 hover:bg-white/30 text-white border-white/30 h-16 text-sm font-medium"
                          onClick={() => handleCategoryClick(category)}
                        >
                          {category}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
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
