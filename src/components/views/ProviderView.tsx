import React, { useState } from 'react';
import { WayaWayaLogo } from '../shared/WayaWayaLogo';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import ChatSystem from '../ChatSystem';
import { 
  DollarSign, Calendar, Star, User, BarChart3, MessageCircle, Server,
  ToggleLeft, ToggleRight, CheckCircle, Clock, MapPin, FileText, Users,
  TrendingUp, Award, Zap, Shield, Wrench, Sparkles, Car, Heart, Target,
  CalendarDays
} from 'lucide-react';
import { apiClient } from '../../utils/apiClient.js';

interface ProviderViewProps {
  isConnected: boolean;
  authToken: string | null;
  setCurrentView: (view: string) => void;
}

interface Booking {
  id: string;
  clientId: string;
  clientName: string;
  service: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  description: string;
  location: string;
  estimatedHours: number;
  totalCost: number;
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
  clientName?: string;
  rating?: number;
  date?: string;
  reviews?: number;
}

export const ProviderView: React.FC<ProviderViewProps> = ({
  isConnected,
  authToken,
  setCurrentView
}) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAvailable, setIsAvailable] = useState(true);
  const [todaysEarnings, setTodaysEarnings] = useState(245.50);
  const [showChatDialog, setShowChatDialog] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [currentProvider, setCurrentProvider] = useState({
    id: 'provider-1',
    name: 'John Smith',
    email: 'john@example.com',
    avatar: undefined,
    service: 'Plumbing',
    rating: 4.8,
    hourlyRate: 225
  });

  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: 'booking-1',
      clientId: 'client-1',
      clientName: 'Sarah Johnson',
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
      clientId: 'client-2',
      clientName: 'Mike Wilson',
      service: 'Pipe Installation',
      date: '2024-02-20',
      time: '14:00',
      status: 'pending',
      description: 'Install new bathroom pipes',
      location: 'Cape Town, Western Cape',
      estimatedHours: 3,
      totalCost: 675
    },
    {
      id: 'booking-3',
      clientId: 'client-3',
      clientName: 'Lisa Brown',
      service: 'Drain Cleaning',
      date: '2024-02-18',
      time: '10:00',
      status: 'completed',
      description: 'Clear blocked kitchen drain',
      location: 'Cape Town, Western Cape',
      estimatedHours: 1.5,
      totalCost: 337.50
    }
  ]);

  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([
    {
      id: '1',
      title: 'Emergency Plumbing',
      description: 'Burst pipe in bathroom',
      category: 'Plumbing',
      status: 'in-progress',
      budget: 500,
      location: 'Cape Town, Western Cape',
      createdAt: '2024-01-15',
      clientName: 'David Miller',
      date: '2024-01-15',
      reviews: 0
    },
    {
      id: '2',
      title: 'Kitchen Sink Installation',
      description: 'New sink and faucet installation',
      category: 'Plumbing',
      status: 'completed',
      budget: 320,
      location: 'Cape Town, Western Cape',
      createdAt: '2024-01-20',
      clientName: 'Emma Davis',
      rating: 5,
      date: '2024-01-20',
      reviews: 1
    }
  ]);

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

  const handleStartChat = (client: any) => {
    setSelectedClient(client);
    setShowChatDialog(true);
  };

  const handleBookingAction = (bookingId: string, action: 'confirm' | 'complete' | 'cancel') => {
    setBookings(prev => prev.map(booking => {
      if (booking.id === bookingId) {
        switch (action) {
          case 'confirm':
            return { ...booking, status: 'confirmed' as const };
          case 'complete':
            return { ...booking, status: 'completed' as const };
          case 'cancel':
            return { ...booking, status: 'cancelled' as const };
          default:
            return booking;
        }
      }
      return booking;
    }));
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

  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const completedBookings = bookings.filter(b => b.status === 'completed').length;
  const totalEarnings = bookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + b.totalCost, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 via-yellow-500 to-red-600">
      {/* Header */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => setCurrentView('landing')}
              className="text-white hover:bg-white/20 rounded-xl p-3"
            >
              ← Back
            </Button>
            <WayaWayaLogo size="sm" />
          </div>
          <div className="text-right text-white">
            <div className="text-lg font-bold">Provider Dashboard</div>
            <div className="text-sm opacity-80">Manage your services</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-gradient-to-br from-slate-400 via-blue-500 to-slate-600 backdrop-blur-sm border-0 shadow-2xl rounded-2xl overflow-hidden">
          <div className="p-8">
            <div className="max-w-6xl mx-auto">
              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-white/20 backdrop-blur-sm">
                  <TabsTrigger value="dashboard" className="text-white data-[state=active]:bg-white/30">
                    Dashboard
                  </TabsTrigger>
                  <TabsTrigger value="bookings" className="text-white data-[state=active]:bg-white/30">
                    My Bookings
                  </TabsTrigger>
                  <TabsTrigger value="requests" className="text-white data-[state=active]:bg-white/30">
                    Service Requests
                  </TabsTrigger>
                  <TabsTrigger value="earnings" className="text-white data-[state=active]:bg-white/30">
                    Earnings
                  </TabsTrigger>
                </TabsList>

                {/* Dashboard Tab */}
                <TabsContent value="dashboard" className="mt-6">
                  <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Welcome back, {currentProvider.name}!</h1>
                    <p className="text-white/80 text-lg">Manage your bookings and service requests</p>
                  </div>

                  {/* Availability Toggle */}
                  <Card className="bg-gradient-to-br from-black/40 to-black-60 border border-yellow-500/30 backdrop-blur-sm shadow-2xl mb-8">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-white font-semibold text-lg">Availability Status</h3>
                          <p className="text-white/80 text-sm">
                            {isAvailable ? 'You are currently accepting new bookings' : 'You are currently unavailable'}
                          </p>
                        </div>
                        <Button 
                          onClick={handleToggleAvailability}
                          className={`flex items-center gap-2 ${
                            isAvailable 
                              ? 'bg-gradient-to-r from-yellow-400 via-green-400 to-blue-400 hover:from-yellow-500 hover:via-green-500 hover:to-blue-500 text-white border-0' 
                              : 'bg-gray-500 hover:bg-gray-600 text-white border-0'
                          }`}
                        >
                          {isAvailable ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
                          {isAvailable ? 'Available' : 'Unavailable'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="bg-gradient-to-br from-black/40 to-black-60 border border-yellow-500/30 backdrop-blur-sm shadow-2xl">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white/90 text-sm font-medium uppercase tracking-wide">Today's Earnings</p>
                            <p className="text-white text-3xl font-bold mt-1">R{todaysEarnings.toFixed(2)}</p>
                            <p className="text-white/70 text-xs mt-1">From 3 completed jobs</p>
                          </div>
                          <div className="bg-yellow-500/20 p-3 rounded-full">
                            <DollarSign className="h-8 w-8 text-yellow-400" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-black/40 to-black-60 border border-yellow-500/30 backdrop-blur-sm shadow-2xl">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white/90 text-sm font-medium uppercase tracking-wide">Pending Bookings</p>
                            <p className="text-white text-3xl font-bold mt-1">{pendingBookings}</p>
                            <p className="text-white/70 text-xs mt-1">Require confirmation</p>
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
                            <p className="text-white/90 text-sm font-medium uppercase tracking-wide">Rating</p>
                            <p className="text-white text-3xl font-bold mt-1">{currentProvider.rating}</p>
                            <p className="text-white/70 text-xs mt-1">Based on 127 reviews</p>
                          </div>
                          <div className="bg-yellow-500/20 p-3 rounded-full">
                            <Star className="h-8 w-8 text-yellow-400" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-black/40 to-black-60 border border-yellow-500/30 backdrop-blur-sm shadow-2xl">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white/90 text-sm font-medium uppercase tracking-wide">Total Earnings</p>
                            <p className="text-white text-3xl font-bold mt-1">R{totalEarnings.toFixed(2)}</p>
                            <p className="text-white/70 text-xs mt-1">This month</p>
                          </div>
                          <div className="bg-yellow-500/20 p-3 rounded-full">
                            <TrendingUp className="h-8 w-8 text-yellow-400" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-gradient-to-br from-black/40 to-black-60 border border-yellow-500/30 backdrop-blur-sm shadow-2xl">
                      <CardHeader>
                        <CardTitle className="text-white text-xl font-semibold">Quick Actions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
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
                            Service Requests
                          </Button>
                          <Button 
                            onClick={() => setActiveTab('earnings')}
                            className="h-12 bg-gradient-to-r from-yellow-400 via-green-400 to-blue-400 hover:from-yellow-500 hover:via-green-500 hover:to-blue-500 text-white border-0"
                          >
                            <BarChart3 className="h-4 w-4 mr-2" />
                            View Earnings
                          </Button>
                          <Button 
                            onClick={() => setShowChatDialog(true)}
                            className="h-12 bg-gradient-to-r from-yellow-400 via-green-400 to-blue-400 hover:from-yellow-500 hover:via-green-500 hover:to-blue-500 text-white border-0"
                          >
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Messages
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-black/40 to-black-60 border border-yellow-500/30 backdrop-blur-sm shadow-2xl">
                      <CardHeader>
                        <CardTitle className="text-white text-xl font-semibold">Recent Activity</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {bookings.slice(0, 3).map((booking) => (
                            <div key={booking.id} className="flex items-center justify-between bg-black/20 rounded-lg p-3">
                              <div>
                                <p className="text-white font-medium">{booking.clientName}</p>
                                <p className="text-white/80 text-sm">{booking.service}</p>
                              </div>
                              <Badge className={`${getStatusColor(booking.status)}`}>
                                {booking.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
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
                                <h3 className="text-white font-semibold text-lg">{booking.clientName}</h3>
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
                              {booking.status === 'pending' && (
                                <>
                                  <Button 
                                    size="sm" 
                                    className="flex-1 bg-gradient-to-r from-yellow-400 via-green-400 to-blue-400 hover:from-yellow-500 hover:via-green-500 hover:to-blue-500 text-white border-0"
                                    onClick={() => handleBookingAction(booking.id, 'confirm')}
                                  >
                                    Confirm
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="bg-red-500 hover:bg-red-600 text-white border-red-500"
                                    onClick={() => handleBookingAction(booking.id, 'cancel')}
                                  >
                                    Decline
                                  </Button>
                                </>
                              )}
                              {booking.status === 'confirmed' && (
                                <Button 
                                  size="sm" 
                                  className="flex-1 bg-gradient-to-r from-yellow-400 via-green-400 to-blue-400 hover:from-yellow-500 hover:via-green-500 hover:to-blue-500 text-white border-0"
                                  onClick={() => handleBookingAction(booking.id, 'complete')}
                                >
                                  Mark Complete
                                </Button>
                              )}
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="bg-black/40 border-yellow-500/30 text-white hover:bg-yellow-500/20"
                                onClick={() => handleStartChat({ id: booking.clientId, name: booking.clientName })}
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

                {/* Service Requests Tab */}
                <TabsContent value="requests" className="mt-6">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white mb-4">Service Requests</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {serviceRequests.map((request) => (
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
                              >
                                View Details
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="bg-black/40 border-yellow-500/30 text-white hover:bg-yellow-500/20"
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

                {/* Earnings Tab */}
                <TabsContent value="earnings" className="mt-6">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white mb-4">Earnings Overview</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <Card className="bg-gradient-to-br from-black/40 to-black-60 border border-yellow-500/30 backdrop-blur-sm shadow-2xl">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-white/90 text-sm font-medium uppercase tracking-wide">This Month</p>
                              <p className="text-white text-3xl font-bold mt-1">R{totalEarnings.toFixed(2)}</p>
                              <p className="text-white/70 text-xs mt-1">From {completedBookings} jobs</p>
                            </div>
                            <div className="bg-yellow-500/20 p-3 rounded-full">
                              <DollarSign className="h-8 w-8 text-yellow-400" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-black/40 to-black-60 border border-yellow-500/30 backdrop-blur-sm shadow-2xl">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-white/90 text-sm font-medium uppercase tracking-wide">Average Per Job</p>
                              <p className="text-white text-3xl font-bold mt-1">
                                R{completedBookings > 0 ? (totalEarnings / completedBookings).toFixed(2) : '0.00'}
                              </p>
                              <p className="text-white/70 text-xs mt-1">Per completed job</p>
                            </div>
                            <div className="bg-yellow-500/20 p-3 rounded-full">
                              <TrendingUp className="h-8 w-8 text-yellow-400" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-black/40 to-black-60 border border-yellow-500/30 backdrop-blur-sm shadow-2xl">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-white/90 text-sm font-medium uppercase tracking-wide">Completed Jobs</p>
                              <p className="text-white text-3xl font-bold mt-1">{completedBookings}</p>
                              <p className="text-white/70 text-xs mt-1">This month</p>
                            </div>
                            <div className="bg-yellow-500/20 p-3 rounded-full">
                              <CheckCircle className="h-8 w-8 text-yellow-400" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Earnings Chart Placeholder */}
                    <Card className="bg-gradient-to-br from-black/40 to-black-60 border border-yellow-500/30 backdrop-blur-sm shadow-2xl">
                      <CardHeader>
                        <CardTitle className="text-white">Earnings Trend</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-64 flex items-center justify-center text-white/60">
                          <div className="text-center">
                            <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                            <p>Earnings chart will be displayed here</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      {/* Chat System */}
      <ChatSystem
        currentUser={currentProvider}
        selectedProvider={selectedClient}
        isOpen={showChatDialog}
        onClose={() => {
          setShowChatDialog(false);
          setSelectedClient(null);
        }}
      />
    </div>
  );
};