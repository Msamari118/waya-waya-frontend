import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Star, 
  MapPin, 
  Clock, 
  Phone, 
  MessageCircle, 
  Filter, 
  Search, 
  SortAsc, 
  SortDesc,
  Shield,
  Award,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Zap,
  DollarSign,
  Users,
  Calendar,
  Heart,
  Bookmark,
  Share2,
  Info,
  RefreshCw,
  ArrowLeft,
  Settings
} from 'lucide-react';
import { WayaWayaLogo } from './shared/WayaWayaLogo';

interface Provider {
  id: number;
  name: string;
  email: string;
  phone: string;
  service: string;
  hourlyRate: number;
  rating: number;
  location: string;
  available: boolean;
  isVerified: boolean;
  services: string[];
  reviews: number;
  distance: string;
  currency: string;
  image: string | null;
  trialDaysLeft: number;
  commissionDue: number;
  responseTime: string;
  experience: number;
  languages: string[];
  certifications: string[];
  specialties: string[];
  availability: {
    today: boolean;
    tomorrow: boolean;
    thisWeek: boolean;
  };
  lastActive: string;
  completionRate: number;
  averageResponseTime: number;
  totalJobs: number;
  isPremium: boolean;
  isRecommended: boolean;
}

interface MatchingEngineProps {
  onNavigate: (view: string) => void;
  serviceRequest: any;
  onStartBooking?: (provider: any) => void;
  onStartChat?: (provider: any) => void;
}

export default function MatchingEngine({ onNavigate, serviceRequest, onStartBooking, onStartChat }: MatchingEngineProps) {
  const [matchedProviders, setMatchedProviders] = useState<Provider[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recommended');
  const [filterBy, setFilterBy] = useState('all');
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [ratingFilter, setRatingFilter] = useState(0);

  const mockProviders: Provider[] = [
    {
      id: 1,
      name: 'Ahmed Hassan',
      email: 'ahmed@example.com',
      phone: '+27123456789',
      service: 'Electrician',
      rating: 4.9,
      reviews: 127,
      distance: '2.3 km',
      available: true,
      location: 'Johannesburg, South Africa',
      isVerified: true,
      services: ['Electrical', 'Installation', 'Repair'],
      hourlyRate: 250,
      currency: 'R',
      responseTime: '5 mins',
      image: null,
      trialDaysLeft: 0,
      commissionDue: 0,
      experience: 8,
      languages: ['English', 'Afrikaans'],
      certifications: ['Licensed Electrician', 'Safety Certified'],
      specialties: ['Residential', 'Commercial', 'Emergency'],
      availability: { today: true, tomorrow: true, thisWeek: true },
      lastActive: '2 hours ago',
      completionRate: 98,
      averageResponseTime: 5,
      totalJobs: 450,
      isPremium: true,
      isRecommended: true
    },
    {
      id: 2,
      name: 'Maria Santos',
      email: 'maria@example.com',
      phone: '+27123456790',
      service: 'House Cleaning',
      rating: 4.8,
      reviews: 89,
      distance: '1.8 km',
      available: true,
      location: 'Cape Town, South Africa',
      isVerified: true,
      services: ['Cleaning', 'Deep Cleaning', 'Regular Maintenance'],
      hourlyRate: 180,
      currency: 'R',
      responseTime: '3 mins',
      image: null,
      trialDaysLeft: 0,
      commissionDue: 0,
      experience: 5,
      languages: ['English', 'Portuguese'],
      certifications: ['Cleaning Certified', 'Eco-Friendly'],
      specialties: ['Residential', 'Deep Cleaning', 'Move-in/out'],
      availability: { today: false, tomorrow: true, thisWeek: true },
      lastActive: '1 hour ago',
      completionRate: 95,
      averageResponseTime: 3,
      totalJobs: 320,
      isPremium: false,
      isRecommended: true
    },
    {
      id: 3,
      name: 'James Wilson',
      email: 'james@example.com',
      phone: '+27123456791',
      service: 'Plumber',
      rating: 4.7,
      reviews: 156,
      distance: '3.1 km',
      available: true,
      location: 'Durban, South Africa',
      isVerified: true,
      services: ['Plumbing', 'Installation', 'Repair'],
      hourlyRate: 300,
      currency: 'R',
      responseTime: '8 mins',
      image: null,
      trialDaysLeft: 0,
      commissionDue: 0,
      experience: 12,
      languages: ['English', 'Zulu'],
      certifications: ['Licensed Plumber', 'Gas Certified'],
      specialties: ['Emergency', 'Commercial', 'Residential'],
      availability: { today: true, tomorrow: false, thisWeek: true },
      lastActive: '30 mins ago',
      completionRate: 99,
      averageResponseTime: 8,
      totalJobs: 680,
      isPremium: true,
      isRecommended: false
    },
    {
      id: 4,
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+27123456792',
      service: 'Garden Maintenance',
      rating: 4.6,
      reviews: 73,
      distance: '4.2 km',
      available: true,
      location: 'Pretoria, South Africa',
      isVerified: true,
      services: ['Garden Care', 'Landscaping', 'Irrigation'],
      hourlyRate: 150,
      currency: 'R',
      responseTime: '12 mins',
      image: null,
      trialDaysLeft: 0,
      commissionDue: 0,
      experience: 6,
      languages: ['English', 'Afrikaans'],
      certifications: ['Horticulture Certified', 'Landscape Design'],
      specialties: ['Residential', 'Garden Design', 'Maintenance'],
      availability: { today: false, tomorrow: true, thisWeek: true },
      lastActive: '4 hours ago',
      completionRate: 92,
      averageResponseTime: 12,
      totalJobs: 240,
      isPremium: false,
      isRecommended: false
    },
    {
      id: 5,
      name: 'David Chen',
      email: 'david@example.com',
      phone: '+27123456793',
      service: 'IT Support',
      rating: 4.9,
      reviews: 94,
      distance: '1.5 km',
      available: true,
      location: 'Johannesburg, South Africa',
      isVerified: true,
      services: ['Computer Repair', 'Network Setup', 'Software Support'],
      hourlyRate: 350,
      currency: 'R',
      responseTime: '2 mins',
      image: null,
      trialDaysLeft: 0,
      commissionDue: 0,
      experience: 10,
      languages: ['English', 'Mandarin'],
      certifications: ['Microsoft Certified', 'Cisco Certified'],
      specialties: ['Business IT', 'Home Support', 'Network Security'],
      availability: { today: true, tomorrow: true, thisWeek: true },
      lastActive: '15 mins ago',
      completionRate: 97,
      averageResponseTime: 2,
      totalJobs: 520,
      isPremium: true,
      isRecommended: true
    }
  ];

  useEffect(() => {
    // Simulate matching process
    const timer = setTimeout(() => {
      setMatchedProviders(mockProviders);
      setFilteredProviders(mockProviders);
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Filter and sort providers
    let filtered = matchedProviders;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(provider =>
        provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.specialties.some(specialty => 
          specialty.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Status filter
    if (filterBy !== 'all') {
      switch (filterBy) {
        case 'available':
          filtered = filtered.filter(p => p.available);
          break;
        case 'verified':
          filtered = filtered.filter(p => p.isVerified);
          break;
        case 'premium':
          filtered = filtered.filter(p => p.isPremium);
          break;
        case 'recommended':
          filtered = filtered.filter(p => p.isRecommended);
          break;
      }
    }

    // Price filter
    filtered = filtered.filter(p => 
      p.hourlyRate >= priceRange[0] && p.hourlyRate <= priceRange[1]
    );

    // Rating filter
    if (ratingFilter > 0) {
      filtered = filtered.filter(p => p.rating >= ratingFilter);
    }

    // Sort
    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'price-low':
        filtered.sort((a, b) => a.hourlyRate - b.hourlyRate);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.hourlyRate - a.hourlyRate);
        break;
      case 'distance':
        filtered.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
        break;
      case 'response-time':
        filtered.sort((a, b) => a.averageResponseTime - b.averageResponseTime);
        break;
      case 'experience':
        filtered.sort((a, b) => b.experience - a.experience);
        break;
      default: // recommended
        filtered.sort((a, b) => {
          if (a.isRecommended && !b.isRecommended) return -1;
          if (!a.isRecommended && b.isRecommended) return 1;
          return b.rating - a.rating;
        });
    }

    setFilteredProviders(filtered);
  }, [matchedProviders, searchTerm, sortBy, filterBy, priceRange, ratingFilter]);

  const handleProviderAction = (provider: Provider, action: string) => {
    setSelectedProvider(provider);
    switch (action) {
      case 'book':
        onStartBooking?.(provider);
        break;
      case 'chat':
        onStartChat?.(provider);
        break;
      case 'call':
        window.open(`tel:${provider.phone}`);
        break;
    }
  };

  const StatCard = ({ title, value, icon: Icon, color = "text-blue-600" }: { title: any, value: any, icon: any, color?: string }) => (
    <Card className="text-center">
      <CardContent className="p-4">
        <Icon className={`h-8 w-8 mx-auto mb-2 ${color}`} />
        <h3 className="font-semibold text-lg">{value}</h3>
        <p className="text-sm text-muted-foreground">{title}</p>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" onClick={() => onNavigate('home')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <WayaWayaLogo size="sm" />
            <div>
              <h1 className="text-2xl font-bold">Finding Perfect Matches</h1>
              <p className="text-sm text-muted-foreground">Our AI is analyzing your request</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <StatCard title="Providers Found" value="0" icon={Users} color="text-blue-600" />
            <StatCard title="Average Rating" value="4.8" icon={Star} color="text-yellow-600" />
            <StatCard title="Response Time" value="5 mins" icon={Clock} color="text-green-600" />
          </div>

          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-6"></div>
              <h3 className="font-semibold text-xl mb-2">Searching for providers...</h3>
              <p className="text-muted-foreground mb-4">We're finding the best providers for your request</p>
              <div className="flex justify-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </CardContent>
          </Card>

          {serviceRequest && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Your Service Request
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p><strong>Service Type:</strong> {serviceRequest.serviceType}</p>
                    <p><strong>Urgency:</strong> 
                      <Badge variant={serviceRequest.urgency === 'urgent' ? 'destructive' : 'default'} className="ml-2">
                        {serviceRequest.urgency}
                      </Badge>
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p><strong>Description:</strong> {serviceRequest.description}</p>
                    <p><strong>Budget:</strong> R{serviceRequest.budget || 'Flexible'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => onNavigate('home')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <WayaWayaLogo size="sm" />
            <div>
              <h1 className="text-2xl font-bold">Available Providers</h1>
              <p className="text-sm text-muted-foreground">
                {filteredProviders.length} of {matchedProviders.length} providers match your criteria
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard title="Providers Found" value={filteredProviders.length} icon={Users} color="text-blue-600" />
          <StatCard title="Average Rating" value="4.8" icon={Star} color="text-yellow-600" />
          <StatCard title="Response Time" value="5 mins" icon={Clock} color="text-green-600" />
          <StatCard title="Verified" value={filteredProviders.filter(p => p.isVerified).length} icon={Shield} color="text-purple-600" />
        </div>

        {/* Filters */}
        {showFilters && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters & Sorting
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Search</label>
                  <Input
                    placeholder="Search providers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Sort by</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-lg">
                      <SelectItem value="recommended" className="text-gray-900 hover:bg-gray-100">Recommended</SelectItem>
                      <SelectItem value="rating" className="text-gray-900 hover:bg-gray-100">Highest Rating</SelectItem>
                      <SelectItem value="price-low" className="text-gray-900 hover:bg-gray-100">Lowest Price</SelectItem>
                      <SelectItem value="price-high" className="text-gray-900 hover:bg-gray-100">Highest Price</SelectItem>
                      <SelectItem value="distance" className="text-gray-900 hover:bg-gray-100">Nearest</SelectItem>
                      <SelectItem value="response-time" className="text-gray-900 hover:bg-gray-100">Fastest Response</SelectItem>
                      <SelectItem value="experience" className="text-gray-900 hover:bg-gray-100">Most Experienced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Filter by</label>
                  <Select value={filterBy} onValueChange={setFilterBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-lg">
                      <SelectItem value="all" className="text-gray-900 hover:bg-gray-100">All Providers</SelectItem>
                      <SelectItem value="available" className="text-gray-900 hover:bg-gray-100">Available Now</SelectItem>
                      <SelectItem value="verified" className="text-gray-900 hover:bg-gray-100">Verified Only</SelectItem>
                      <SelectItem value="premium" className="text-gray-900 hover:bg-gray-100">Premium Providers</SelectItem>
                      <SelectItem value="recommended" className="text-gray-900 hover:bg-gray-100">Recommended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Min Rating</label>
                  <Select value={ratingFilter.toString()} onValueChange={(value) => setRatingFilter(parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-lg">
                      <SelectItem value="0" className="text-gray-900 hover:bg-gray-100">Any Rating</SelectItem>
                      <SelectItem value="4" className="text-gray-900 hover:bg-gray-100">4+ Stars</SelectItem>
                      <SelectItem value="4.5" className="text-gray-900 hover:bg-gray-100">4.5+ Stars</SelectItem>
                      <SelectItem value="4.8" className="text-gray-900 hover:bg-gray-100">4.8+ Stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Providers List */}
        <Tabs defaultValue="list" className="space-y-4">
          <TabsList>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            {filteredProviders.map((provider) => (
              <Card key={provider.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg font-bold">
                        {provider.name.split(' ').map((n: string) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">{provider.name}</h3>
                            {provider.isVerified && (
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                            {provider.isPremium && (
                              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                <Award className="h-3 w-3 mr-1" />
                                Premium
                              </Badge>
                            )}
                            {provider.isRecommended && (
                              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                Recommended
                              </Badge>
                            )}
                          </div>
                          <p className="text-muted-foreground">{provider.service}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">{provider.currency}{provider.hourlyRate}</p>
                          <p className="text-sm text-muted-foreground">per hour</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{provider.rating}</span>
                          <span className="text-sm text-muted-foreground">({provider.reviews})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{provider.distance}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">~{provider.responseTime}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{provider.experience} years</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {provider.specialties.slice(0, 3).map((specialty, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleProviderAction(provider, 'call')}
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          Call
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleProviderAction(provider, 'chat')}
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Chat
                        </Button>
                        <Button 
                          size="sm"
                          className="flex-1"
                          onClick={() => handleProviderAction(provider, 'book')}
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          Book Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProviders.map((provider) => (
              <Card key={provider.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="text-center mb-4">
                    <Avatar className="h-16 w-16 mx-auto mb-3">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg font-bold">
                        {provider.name.split(' ').map((n: string) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold">{provider.name}</h3>
                    <p className="text-sm text-muted-foreground">{provider.service}</p>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{provider.rating}</span>
                      <span className="text-sm text-muted-foreground">({provider.reviews})</span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Rate:</span>
                      <span className="font-semibold">{provider.currency}{provider.hourlyRate}/hr</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Distance:</span>
                      <span>{provider.distance}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Response:</span>
                      <span>~{provider.responseTime}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex-1"
                      onClick={() => handleProviderAction(provider, 'chat')}
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Chat
                    </Button>
                    <Button 
                      size="sm"
                      className="flex-1"
                      onClick={() => handleProviderAction(provider, 'book')}
                    >
                      <Calendar className="h-4 w-4 mr-1" />
                      Book
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        {/* Help Section */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Info className="h-6 w-6 text-blue-600 mt-1" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">Need help choosing?</h4>
                <p className="text-blue-800 mb-3">
                  Our AI matching algorithm has selected these providers based on your location, budget, and requirements. 
                  Each provider has been verified and rated by previous customers.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Results
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Adjust Preferences
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}