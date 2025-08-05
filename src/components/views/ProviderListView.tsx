import React, { useState, useEffect } from 'react';
import { WayaWayaLogo } from '../shared/WayaWayaLogo';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import {
  MapPin, Star, Clock, DollarSign, Filter, Search, ArrowLeft, MessageCircle,
  CheckCircle, XCircle, Wrench, Zap, Sparkles, Car, Baby, Truck, Heart, Shield
} from 'lucide-react';

interface ProviderListViewProps {
  isConnected: boolean;
  authToken: string | null;
  setCurrentView: (view: string) => void;
  selectedService?: string;
}

const mockProviders = [
  {
    id: '1',
    name: 'John\'s Plumbing',
    service: 'plumbing',
    rating: 4.8,
    reviews: 127,
    hourlyRate: 250,
    distance: 2.3,
    available: true,
    verified: true,
    experience: '5+ years',
    specialties: ['Pipe repairs', 'Installations', 'Emergency calls'],
    location: 'Sandton, Johannesburg',
    responseTime: '15 min'
  },
  {
    id: '2',
    name: 'Spark Electric',
    service: 'electrical',
    rating: 4.9,
    reviews: 89,
    hourlyRate: 300,
    distance: 1.8,
    available: true,
    verified: true,
    experience: '8+ years',
    specialties: ['Wiring', 'Installations', 'Safety inspections'],
    location: 'Rosebank, Johannesburg',
    responseTime: '20 min'
  }
];

export const ProviderListView: React.FC<ProviderListViewProps> = ({
  isConnected,
  authToken,
  setCurrentView,
  selectedService = 'plumbing'
}) => {
  const [providers, setProviders] = useState(mockProviders);
  const [filteredProviders, setFilteredProviders] = useState(mockProviders);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rating');

  useEffect(() => {
    const serviceProviders = mockProviders.filter(p => p.service === selectedService);
    setProviders(serviceProviders);
    setFilteredProviders(serviceProviders);
  }, [selectedService]);

  useEffect(() => {
    let filtered = providers;
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    filtered.sort((a, b) => b.rating - a.rating);
    setFilteredProviders(filtered);
  }, [providers, searchTerm, sortBy]);

  const handleProviderSelect = (provider: any) => {
    setCurrentView('provider-detail');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 via-yellow-500 to-red-600">
      {/* Header */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => setCurrentView('service-selection')}
              className="text-white hover:bg-white/20 rounded-xl p-3"
            >
              ← Back
            </Button>
            <WayaWayaLogo size="sm" />
          </div>
          <div className="text-right text-white">
            <div className="text-lg font-bold">Available Providers</div>
            <div className="text-sm opacity-80">{filteredProviders.length} providers found for {selectedService}</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-gradient-to-br from-slate-400 via-blue-500 to-slate-600 backdrop-blur-sm border-0 shadow-2xl rounded-2xl overflow-hidden">
          <div className="p-8">
            <div className="max-w-6xl mx-auto">
              
              {/* Search and Filter */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
                  <Input
                    placeholder="Search providers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/60"
                  />
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48 bg-white/20 border-white/30 text-white">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-lg">
                    <SelectItem value="rating" className="text-gray-900 hover:bg-gray-100">Rating</SelectItem>
                    <SelectItem value="distance" className="text-gray-900 hover:bg-gray-100">Distance</SelectItem>
                    <SelectItem value="price" className="text-gray-900 hover:bg-gray-100">Price</SelectItem>
                    <SelectItem value="response" className="text-gray-900 hover:bg-gray-100">Response Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Providers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProviders.map((provider) => (
                  <Card key={provider.id} className="bg-white/10 border border-white/20 hover:bg-white/20">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="bg-white/20 p-2 rounded-lg">
                            {provider.service === 'plumbing' && <Wrench className="h-4 w-4 text-white" />}
                            {provider.service === 'electrical' && <Zap className="h-4 w-4 text-white" />}
                            {provider.service === 'cleaning' && <Sparkles className="h-4 w-4 text-white" />}
                            {provider.service === 'mechanic' && <Car className="h-4 w-4 text-white" />}
                          </div>
                          <div>
                            <h3 className="text-white font-semibold text-lg">{provider.name}</h3>
                            <p className="text-white/80 text-sm capitalize">{provider.service}</p>
                            <div className="flex items-center mt-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="text-white/80 text-sm ml-1">{provider.rating}</span>
                              <span className="text-white/60 text-xs ml-2">({provider.reviews} reviews)</span>
                            </div>
                          </div>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${provider.available ? 'bg-green-400' : 'bg-gray-400'}`} />
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
                        <div className="flex items-center text-white/80 text-sm">
                          <Clock className="h-4 w-4 mr-2" />
                          {provider.responseTime} response
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
                          onClick={() => handleProviderSelect(provider)}
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Contact
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 