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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import ChatSystem from '../ChatSystem';
import { BookingDialog } from '../BookingDialog';
import {
  Search, Calendar, Star, User, BarChart3, MessageCircle, CreditCard,
  Clock, MapPin, CheckCircle, AlertCircle, TrendingUp, Award, Zap,
  Shield, Wrench, Sparkles, Car, Heart, Target, Plus, Filter,
  X, Edit, Trash2, Phone, Mail, MessageSquare, FileText, Users, DollarSign,
  BookOpen, CalendarDays
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
  date?: string;
  reviews?: number;
}

interface ServiceProvider {
  id: string;
  name: string;
  service: string;
  rating: number;
  location: string;
  isOnline: boolean;
  avatar?: string;
  reviews?: number;
  hourlyRate?: number;
  availability?: string[];
}

interface Booking {
  id: string;
  providerId: string;
  providerName: string;
  service: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  description: string;
  location: string;
  estimatedHours: number;
  totalCost: number;
}

export const ClientView: React.FC<ClientViewProps> = ({
  isConnected,
  authToken,
  setCurrentView
}) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeRequests, setActiveRequests] = useState(2);
  const [totalSpent, setTotalSpent] = useState(1250.75);
  const [averageRating, setAverageRating] = useState(4.6);
  const [showNewRequestDialog, setShowNewRequestDialog] = useState(false);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [showChatDialog, setShowChatDialog] = useState(false);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
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
    }
  ]);

  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: 'booking-1',
      providerId: 'provider-1',
      providerName: "John's Plumbing",
      service: 'Plumbing Repair',
      date: '2024-02-15',
      time: '09:00',
      status: 'confirmed',
      description: 'Fix leaky kitchen faucet',
      location: 'Cape Town, Western Cape',
      estimatedHours: 2,
      totalCost: 450
    },
    {
      id: 'booking-2',
      providerId: 'provider-2',
      providerName: 'Spark Electric',
      service: 'Electrical Installation',
      date: '2024-02-20',
      time: '14:00',
      status: 'pending',
      description: 'Install new ceiling fan',
      location: 'Cape Town, Western Cape',
      estimatedHours: 3,
      totalCost: 320
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
      reviews: 15,
      hourlyRate: 225,
      availability: ['09:00', '10:00', '11:00', '14:00', '15:00']
    },
    {
      id: 'provider-2',
      name: 'Spark Electric',
      service: 'Electrical',
      rating: 4.6,
      location: 'Cape Town, Western Cape',
      isOnline: true,
      avatar: undefined,
      reviews: 10,
      hourlyRate: 280,
      availability: ['08:00', '09:00', '13:00', '14:00', '16:00']
    },
    {
      id: 'provider-3',
      name: 'Clean Pro Services',
      service: 'Cleaning',
      rating: 4.9,
      location: 'Cape Town, Western Cape',
      isOnline: false,
      avatar: undefined,
      reviews: 20,
      hourlyRate: 180,
      availability: ['08:00', '09:00', '10:00', '14:00', '15:00']
    },
    {
      id: 'provider-4',
      name: 'Green Thumb Gardening',
      service: 'Gardening',
      rating: 4.7,
      location: 'Cape Town, Western Cape',
      isOnline: true,
      avatar: undefined,
      reviews: 12,
      hourlyRate: 150,
      availability: ['07:00', '08:00', '09:00', '15:00', '16:00']
    },
    {
      id: 'provider-5',
      name: 'Mike\'s Auto Repair',
      service: 'Mechanic',
      rating: 4.5,
      location: 'Cape Town, Western Cape',
      isOnline: true,
      avatar: undefined,
      reviews: 8,
      hourlyRate: 300,
      availability: ['08:00', '09:00', '10:00', '14:00', '15:00']
    }
  ]);

  const [newRequest, setNewRequest] = useState({
    title: '',
    description: '',
    category: '',
    budget: '',
    location: ''
  });

  const [bookingDetails, setBookingDetails] = useState({
    date: '',
    time: '',
    description: '',
    location: '',
    urgency: 'normal',
    estimatedHours: 2
  });

  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    minBudget: '',
    maxBudget: ''
  });

  // Search and filter providers
  const filteredProviders = availableProviders.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         provider.service.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || provider.service.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
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
        date: new Date().toISOString().split('T')[0],
        reviews: 0
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

  const handleBookProvider = (provider: ServiceProvider) => {
    setSelectedProvider(provider);
    setBookingDetails({
      date: '',
      time: '',
      description: '',
      location: '',
      urgency: 'normal',
      estimatedHours: 2
    });
    setShowBookingDialog(true);
  };

  const handleBookingSubmit = () => {
    if (selectedProvider && bookingDetails.date && bookingDetails.time && bookingDetails.description && bookingDetails.location) {
      const booking: Booking = {
        id: `booking-${Date.now()}`,
        providerId: selectedProvider.id,
        providerName: selectedProvider.name,
        service: selectedProvider.service,
        date: bookingDetails.date,
        time: bookingDetails.time,
        status: 'pending',
        description: bookingDetails.description,
        location: bookingDetails.location,
        estimatedHours: bookingDetails.estimatedHours,
        totalCost: (selectedProvider.hourlyRate || 200) * bookingDetails.estimatedHours
      };
      
      setBookings([booking, ...bookings]);
      setShowBookingDialog(false);
      setSelectedProvider(null);
    }
  };

  const handleProviderClick = (provider: ServiceProvider) => {
    setSelectedProvider(provider);
    setShowChatDialog(true);
  };

  const handleRequestClick = (request: ServiceRequest) => {
    console.log('Viewing request:', request);
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category.toLowerCase());
    setActiveTab('search');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500 text-yellow-900';
      case 'in-progress': return 'bg-blue-500 text-blue-900';
      case 'completed': return 'bg-green-500 text-green-900';
      case 'cancelled': return 'bg-red-500 text-red-900';
      case 'confirmed': return 'bg-green-500 text-green-900';
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
      {/* Header */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => setCurrentView('landing')}
              className="text-white hover:bg-yellow-500/20 rounded-xl p-3 transition-all duration-200"
            >
              ← Back
            </Button>
            <WayaWayaLogo size="sm" />
          </div>
          <div className="text-right text-white">
            <div className="text-lg font-bold bg-gradient-to-r from-yellow-400 via-green-400 to-blue-400 bg-clip-text text-transparent">Client Dashboard</div>
            <div className="text-sm opacity-80">Manage your services</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-gradient-to-br from-black/40 via-gray-900/60 to-black/40 backdrop-blur-sm border border-yellow-500/30 shadow-2xl rounded-2xl overflow-hidden">
          <div className="p-8">
            <div className="max-w-6xl mx-auto">
              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                              <TabsList className="grid w-full grid-cols-4 bg-black/40 backdrop-blur-sm border border-yellow-500/30">
                <TabsTrigger value="dashboard" className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:via-green-400 data-[state=active]:to-blue-400 data-[state=active]:text-white hover:bg-yellow-500/20 transition-all duration-200">
                  Dashboard
                </TabsTrigger>
                <TabsTrigger value="search" className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:via-green-400 data-[state=active]:to-blue-400 data-[state=active]:text-white hover:bg-yellow-500/20 transition-all duration-200">
                  Search Services
                </TabsTrigger>
                <TabsTrigger value="bookings" className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:via-green-400 data-[state=active]:to-blue-400 data-[state=active]:text-white hover:bg-yellow-500/20 transition-all duration-200">
                  My Bookings
                </TabsTrigger>
                <TabsTrigger value="requests" className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:via-green-400 data-[state=active]:to-blue-400 data-[state=active]:text-white hover:bg-yellow-500/20 transition-all duration-200">
                  Service Requests
                </TabsTrigger>
              </TabsList>

                {/* Dashboard Tab */}
                <TabsContent value="dashboard" className="mt-6">
                  <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-green-400 to-blue-400 bg-clip-text text-transparent mb-2">Welcome back, {currentUser.name}!</h1>
                    <p className="text-white/80 text-lg">Manage your service requests and connect with providers</p>
                  </div>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="bg-gradient-to-br from-black/40 to-black-60 border border-yellow-500/30 backdrop-blur-sm shadow-2xl">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white/90 text-sm font-medium uppercase tracking-wide">Active Requests</p>
                            <p className="text-white text-3xl font-bold mt-1">{serviceRequests.length}</p>
                            <p className="text-white/70 text-xs mt-1">In progress</p>
                          </div>
                          <div className="bg-yellow-500/20 p-3 rounded-full">
                            <FileText className="h-8 w-8 text-yellow-400" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-black/40 to-black-60 border border-yellow-500/30 backdrop-blur-sm shadow-2xl">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white/90 text-sm font-medium uppercase tracking-wide">My Bookings</p>
                            <p className="text-white text-3xl font-bold mt-1">{bookings.length}</p>
                            <p className="text-white/70 text-xs mt-1">Scheduled</p>
                          </div>
                          <div className="bg-yellow-500/20 p-3 rounded-full">
                            <Calendar className="h-8 w-8 text-yellow-400" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-black/40 to-black-60 border border-yellow-500/30 backdrop-blur-sm shadow-2xl">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white/90 text-sm font-medium uppercase tracking-wide">Available Providers</p>
                            <p className="text-white text-3xl font-bold mt-1">{availableProviders.length}</p>
                            <p className="text-white/70 text-xs mt-1">Ready to help</p>
                          </div>
                          <div className="bg-yellow-500/20 p-3 rounded-full">
                            <Users className="h-8 w-8 text-yellow-400" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-black/40 to-black-60 border border-yellow-500/30 backdrop-blur-sm shadow-2xl">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white/90 text-sm font-medium uppercase tracking-wide">Total Spent</p>
                            <p className="text-white text-3xl font-bold mt-1">R2,450</p>
                            <p className="text-white/70 text-xs mt-1">This month</p>
                          </div>
                          <div className="bg-yellow-500/20 p-3 rounded-full">
                            <DollarSign className="h-8 w-8 text-yellow-400" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <Card className="bg-gradient-to-br from-black/40 to-black-60 border border-yellow-500/30 backdrop-blur-sm shadow-2xl">
                      <CardHeader>
                        <CardTitle className="text-white text-xl font-semibold">Quick Actions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <Button 
                            onClick={() => setActiveTab('search')}
                            className="h-12 bg-gradient-to-r from-yellow-400 via-green-400 to-blue-400 hover:from-yellow-500 hover:via-green-500 hover:to-blue-500 text-white border-0"
                          >
                            <Search className="h-4 w-4 mr-2" />
                            Find Services
                          </Button>
                          <Button 
                            onClick={() => setShowNewRequestDialog(true)}
                            className="h-12 bg-gradient-to-r from-yellow-400 via-green-400 to-blue-400 hover:from-yellow-500 hover:via-green-500 hover:to-blue-500 text-white border-0"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            New Request
                          </Button>
                          <Button 
                            onClick={() => setActiveTab('bookings')}
                            className="h-12 bg-gradient-to-r from-yellow-400 via-green-400 to-blue-400 hover:from-yellow-500 hover:via-green-500 hover:to-blue-500 text-white border-0"
                          >
                            <Calendar className="h-4 w-4 mr-2" />
                            View Bookings
                          </Button>
                          <Button 
                            onClick={() => setActiveTab('requests')}
                            className="h-12 bg-gradient-to-r from-yellow-400 via-green-400 to-blue-400 hover:from-yellow-500 hover:via-green-500 hover:to-blue-500 text-white border-0"
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            My Requests
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-black/40 to-black-60 border border-yellow-500/30 backdrop-blur-sm shadow-2xl">
                      <CardHeader>
                        <CardTitle className="text-white text-xl font-semibold">Popular Services</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-3">
                          {['Plumbing', 'Electrical', 'Cleaning', 'Carpentry'].map((category) => (
                            <Button
                              key={category}
                              variant="outline"
                              className="h-10 bg-black/40 border-yellow-500/30 text-white hover:bg-yellow-500/20 text-sm font-medium"
                              onClick={() => handleCategoryClick(category)}
                            >
                              {category}
                            </Button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Search Services Tab */}
                <TabsContent value="search" className="mt-6">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white mb-4">Find Service Providers</h2>
                    
                    {/* Search Bar */}
                    <div className="flex gap-4 mb-6">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
                        <Input
                          placeholder="Search for services or providers..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 bg-black/40 border-yellow-500/30 text-white placeholder:text-gray-400 focus:border-green-500"
                        />
                      </div>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-48 bg-black/40 border-yellow-500/30 text-white">
                          <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="plumbing">Plumbing</SelectItem>
                          <SelectItem value="electrical">Electrical</SelectItem>
                          <SelectItem value="cleaning">Cleaning</SelectItem>
                          <SelectItem value="gardening">Gardening</SelectItem>
                          <SelectItem value="mechanic">Mechanic</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Service Providers Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredProviders.map((provider) => (
                        <Card key={provider.id} className="bg-gradient-to-br from-black/40 to-black-60 border border-yellow-500/30 hover:border-green-500/50 transition-all duration-200 backdrop-blur-sm">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-12 w-12">
                                  <AvatarImage src={provider.avatar} />
                                  <AvatarFallback className="bg-yellow-500/20 text-yellow-400">
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
                              <div className={`w-3 h-3 rounded-full ${provider.isOnline ? 'bg-green-400' : 'bg-gray-400'}`} />
                            </div>
                            
                            <div className="space-y-3 mb-4">
                              <div className="flex items-center text-white/80 text-sm">
                                <MapPin className="h-4 w-4 mr-2" />
                                {provider.location}
                              </div>
                              <div className="flex items-center text-white/80 text-sm">
                                <DollarSign className="h-4 w-4 mr-2" />
                                R{provider.hourlyRate}/hour
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                className="flex-1 bg-gradient-to-r from-yellow-400 via-green-400 to-blue-400 hover:from-yellow-500 hover:via-green-500 hover:to-blue-500 text-white border-0"
                                onClick={() => handleBookProvider(provider)}
                              >
                                <BookOpen className="h-4 w-4 mr-2" />
                                Book Now
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="bg-black/40 border-yellow-500/30 text-white hover:bg-yellow-500/20"
                                onClick={() => handleStartChat(provider)}
                              >
                                <MessageCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* Bookings Tab */}
                <TabsContent value="bookings" className="mt-6">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white mb-4">My Bookings</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {bookings.map((booking) => (
                        <Card key={booking.id} className="bg-gradient-to-br from-black/40 to-black-60 border border-yellow-500/30 hover:border-green-500/50 transition-all duration-200 backdrop-blur-sm">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h3 className="text-white font-semibold text-lg">{booking.providerName}</h3>
                                <p className="text-white/80 text-sm">{booking.service}</p>
                                <Badge className={`mt-2 ${getStatusColor(booking.status)}`}>
                                  {booking.status}
                                </Badge>
                              </div>
                              <div className="text-right text-white/80">
                                <div className="text-sm">R{booking.totalCost}</div>
                                <div className="text-xs">{booking.estimatedHours}h</div>
                              </div>
                            </div>
                            
                            <div className="space-y-2 mb-4">
                              <div className="flex items-center text-white/80 text-sm">
                                <CalendarDays className="h-4 w-4 mr-2" />
                                {booking.date}
                              </div>
                                                              <div className="flex items-center text-white/80 text-sm">
                                  <Clock className="h-4 w-4 mr-2" />
                                  {booking.time}
                                </div>
                                <div className="flex items-center text-white/80 text-sm">
                                  <MapPin className="h-4 w-4 mr-2" />
                                  {booking.location}
                                </div>
                            </div>

                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                className="flex-1 bg-gradient-to-r from-yellow-400 via-green-400 to-blue-400 hover:from-yellow-500 hover:via-green-500 hover:to-blue-500 text-white border-0"
                                onClick={() => handleStartChat({ 
                                  id: booking.providerId, 
                                  name: booking.providerName,
                                  service: booking.service,
                                  rating: 4.5,
                                  location: booking.location,
                                  isOnline: true
                                })}
                              >
                                <MessageCircle className="h-4 w-4 mr-2" />
                                Chat
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="bg-black/40 border-yellow-500/30 text-white hover:bg-yellow-500/20"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* Service Requests Tab */}
                <TabsContent value="requests" className="mt-6">
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-bold text-white">Service Requests</h2>
                      <Button 
                        onClick={() => setShowNewRequestDialog(true)}
                        className="bg-gradient-to-r from-yellow-400 via-green-400 to-blue-400 hover:from-yellow-500 hover:via-green-500 hover:to-blue-500 text-white border-0"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        New Request
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredRequests.map((request) => (
                        <Card key={request.id} className="bg-gradient-to-br from-black/40 to-black-60 border border-yellow-500/30 hover:border-green-500/50 transition-all duration-200 backdrop-blur-sm">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center space-x-3">
                                <div className="bg-yellow-500/20 p-2 rounded-lg">
                                  {getCategoryIcon(request.category)}
                                </div>
                                <div>
                                  <h3 className="text-white font-semibold text-lg">{request.title}</h3>
                                  <p className="text-white/80 text-sm">{request.description}</p>
                                  <Badge className={`mt-2 ${getStatusColor(request.status)}`}>
                                    {request.status}
                                  </Badge>
                                </div>
                              </div>
                              <div className="text-right text-white/80">
                                <div className="text-sm">R{request.budget}</div>
                                <div className="text-xs">{request.date}</div>
                              </div>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                className="flex-1 bg-gradient-to-r from-yellow-400 via-green-400 to-blue-400 hover:from-yellow-500 hover:via-green-500 hover:to-blue-500 text-white border-0"
                                onClick={() => handleRequestClick(request)}
                              >
                                View Details
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="bg-black/40 border-yellow-500/30 text-white hover:bg-yellow-500/20"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      {/* New Request Dialog */}
      <Dialog open={showNewRequestDialog} onOpenChange={setShowNewRequestDialog}>
        <DialogContent className="bg-gradient-to-br from-black/80 via-gray-900/90 to-black/80 backdrop-blur-md border border-yellow-500/30 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">Create New Service Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-gray-200">Service Title</Label>
              <Input
                id="title"
                value={newRequest.title}
                onChange={(e) => setNewRequest({...newRequest, title: e.target.value})}
                placeholder="e.g., Plumbing Repair"
                className="mt-1 bg-black/40 border-yellow-500/30 text-white placeholder:text-gray-400"
              />
            </div>
            <div>
              <Label htmlFor="description" className="text-gray-200">Description</Label>
              <Textarea
                id="description"
                value={newRequest.description}
                onChange={(e) => setNewRequest({...newRequest, description: e.target.value})}
                placeholder="Describe your service need..."
                className="mt-1 bg-black/40 border-yellow-500/30 text-white placeholder:text-gray-400"
              />
            </div>
            <div>
              <Label htmlFor="category" className="text-gray-200">Category</Label>
              <Select value={newRequest.category} onValueChange={(value) => setNewRequest({...newRequest, category: value})}>
                <SelectTrigger className="mt-1 bg-black/40 border-yellow-500/30 text-white">
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
              <Label htmlFor="budget" className="text-gray-200">Budget (R)</Label>
              <Input
                id="budget"
                type="number"
                value={newRequest.budget}
                onChange={(e) => setNewRequest({...newRequest, budget: e.target.value})}
                placeholder="500"
                className="mt-1 bg-black/40 border-yellow-500/30 text-white placeholder:text-gray-400"
              />
            </div>
            <div>
              <Label htmlFor="location" className="text-gray-200">Location</Label>
              <Input
                id="location"
                value={newRequest.location}
                onChange={(e) => setNewRequest({...newRequest, location: e.target.value})}
                placeholder="e.g., Cape Town, Western Cape"
                className="mt-1 bg-black/40 border-yellow-500/30 text-white placeholder:text-gray-400"
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleCreateRequest}
                className="flex-1 bg-gradient-to-r from-yellow-400 via-green-400 to-blue-400 hover:from-yellow-500 hover:via-green-500 hover:to-blue-500 text-white border-0"
              >
                Create Request
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowNewRequestDialog(false)}
                className="flex-1 bg-black/40 border-yellow-500/30 text-white hover:bg-yellow-500/20"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Booking Dialog */}
      <BookingDialog
        showBookingDialog={showBookingDialog}
        setShowBookingDialog={setShowBookingDialog}
        selectedProvider={selectedProvider}
        bookingDetails={bookingDetails}
        setBookingDetails={setBookingDetails}
        handleBookingSubmit={handleBookingSubmit}
        isConnected={isConnected}
      />

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
