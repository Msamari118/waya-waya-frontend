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
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => setCurrentView('service-selection')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <WayaWayaLogo size="sm" />
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 via-green-400 to-blue-400 bg-clip-text text-transparent">
            Available Providers
          </h1>
          <p className="text-gray-300 text-sm">
            {filteredProviders.length} providers found for {selectedService}
          </p>
        </div>
      </div>

      <Card className="bg-gradient-to-br from-black/80 via-gray-900/90 to-black/80 backdrop-blur-md border border-yellow-500/30 shadow-2xl">
        <CardContent className="p-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search providers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-black/40 border-yellow-500/30 text-white placeholder:text-gray-400 focus:border-green-500 backdrop-blur-sm"
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredProviders.map((provider) => (
          <Card
            key={provider.id}
            className="bg-gradient-to-br from-black/40 to-black-60 border border-yellow-500/30 hover:border-green-500/50 transition-all duration-200 cursor-pointer backdrop-blur-sm"
            onClick={() => handleProviderSelect(provider)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-r from-yellow-400 to-green-400 flex items-center justify-center">
                    <Wrench className="h-8 w-8 text-white" />
                  </div>
                  {provider.verified && (
                    <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                      <CheckCircle className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium text-white">{provider.name}</h3>
                    {provider.available ? (
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                        Available
                      </Badge>
                    ) : (
                      <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">
                        Busy
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-300 mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span>{provider.rating}</span>
                      <span className="text-gray-400">({provider.reviews})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{provider.distance}km away</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{provider.responseTime}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-300 mb-3">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      <span>R{provider.hourlyRate}/hr</span>
                    </div>
                    <span>• {provider.experience}</span>
                    <span>• {provider.location}</span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-yellow-400 via-green-400 to-blue-400 hover:from-yellow-500 hover:via-green-500 hover:to-blue-500 text-white"
                    >
                      View Profile
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-yellow-500/30 bg-black/40 text-gray-200 hover:bg-yellow-500/20 backdrop-blur-sm"
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}; 