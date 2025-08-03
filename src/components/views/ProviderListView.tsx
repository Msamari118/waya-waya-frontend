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
              className="text-white hover:bg-white/20 rounded-xl p-3 transition-all duration-300"
            >
              ← Back
            </Button>
            <WayaWayaLogo size="sm" />
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-gradient-to-br from-black/80 via-gray-900/90 to-black/80 backdrop-blur-md border border-yellow-500/30 shadow-2xl rounded-2xl overflow-hidden">
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
                    className="pl-10 bg-black/40 border-yellow-500/30 text-white placeholder:text-white/60 focus:border-green-500"
                  />
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48 bg-black/40 border-yellow-500/30 text-white">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="distance">Distance</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="response">Response Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Providers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProviders.map((provider) => (
                  <Card key={provider.id} className="bg-gradient-to-br from-black/40 to-black-60 border border-yellow-500/30 hover:border-green-500/50 transition-all duration-200 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="bg-yellow-500/20 p-2 rounded-lg">
                            {provider.service === 'plumbing' && <Wrench className="h-4 w-4 text-yellow-400" />}
                            {provider.service === 'electrical' && <Zap className="h-4 w-4 text-yellow-400" />}
                            {provider.service === 'cleaning' && <Sparkles className="h-4 w-4 text-yellow-400" />}
                            {provider.service === 'mechanic' && <Car className="h-4 w-4 text-yellow-400" />}
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
                          className="flex-1 bg-gradient-to-r from-yellow-400 via-green-400 to-blue-400 hover:from-yellow-500 hover:via-green-500 hover:to-blue-500 text-white border-0"
                          onClick={() => handleProviderSelect(provider)}
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Contact
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="bg-black/40 border-yellow-500/30 text-white hover:bg-yellow-500/20"
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