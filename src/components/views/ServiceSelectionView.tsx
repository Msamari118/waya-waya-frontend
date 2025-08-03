import React, { useState } from 'react';
import { WayaWayaLogo } from '../shared/WayaWayaLogo';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import {
  Wrench, Zap, Sparkles, Car, Baby, Truck, MapPin, Star, Clock, Search,
  Home, Building, Car as CarIcon, Heart, Shield, Award
} from 'lucide-react';

interface ServiceSelectionViewProps {
  isConnected: boolean;
  authToken: string | null;
  setCurrentView: (view: string) => void;
}

const serviceCategories = [
  {
    id: 'plumbing',
    title: 'Plumber',
    icon: Wrench,
    description: 'Pipe repairs, installations, maintenance',
    color: 'from-blue-500 to-blue-600',
    popular: true
  },
  {
    id: 'electrical',
    title: 'Electrician',
    icon: Zap,
    description: 'Wiring, installations, repairs',
    color: 'from-yellow-500 to-orange-500',
    popular: true
  },
  {
    id: 'cleaning',
    title: 'Cleaning',
    icon: Sparkles,
    description: 'House cleaning, deep cleaning',
    color: 'from-green-500 to-emerald-600',
    popular: true
  },
  {
    id: 'mechanic',
    title: 'Mechanic',
    icon: Car,
    description: 'Car repairs, maintenance, diagnostics',
    color: 'from-gray-600 to-gray-700',
    popular: false
  },
  {
    id: 'babysitter',
    title: 'Babysitter',
    icon: Baby,
    description: 'Childcare, supervision, activities',
    color: 'from-pink-500 to-rose-500',
    popular: false
  },
  {
    id: 'delivery',
    title: 'Delivery',
    icon: Truck,
    description: 'Package delivery, errands',
    color: 'from-purple-500 to-violet-600',
    popular: false
  },
  {
    id: 'gardening',
    title: 'Gardening',
    icon: Heart,
    description: 'Lawn care, landscaping, maintenance',
    color: 'from-emerald-500 to-green-600',
    popular: false
  },
  {
    id: 'security',
    title: 'Security',
    icon: Shield,
    description: 'Security systems, monitoring',
    color: 'from-red-500 to-red-600',
    popular: false
  }
];

export const ServiceSelectionView: React.FC<ServiceSelectionViewProps> = ({
  isConnected,
  authToken,
  setCurrentView
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredServices = serviceCategories.filter(service =>
    service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleServiceSelect = (serviceId: string) => {
    setSelectedCategory(serviceId);
    setCurrentView('provider-list');
  };

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
            <div className="text-lg font-bold">What Service Do You Need?</div>
            <div className="text-sm opacity-80">Choose from our trusted providers</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-gradient-to-br from-slate-400 via-blue-500 to-slate-600 backdrop-blur-sm border-0 shadow-2xl rounded-2xl overflow-hidden">
          <div className="p-8">
            <div className="max-w-6xl mx-auto">
              
              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
                  <Input
                    placeholder="Search for services..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/60"
                  />
                </div>
              </div>

              {/* Popular Services */}
              {!searchTerm && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <Star className="h-6 w-6 text-yellow-400" />
                    Popular Services
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {serviceCategories.filter(s => s.popular).map((service) => (
                      <Button
                        key={service.id}
                        onClick={() => handleServiceSelect(service.id)}
                        className="h-20 flex-col bg-white/10 border border-white/20 hover:bg-white/20 text-white"
                      >
                        <service.icon className="h-6 w-6 mb-2" />
                        <span className="font-medium">{service.title}</span>
                        <span className="text-xs text-white/70">{service.description}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* All Services */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">
                  {searchTerm ? 'Search Results' : 'All Services'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredServices.map((service) => (
                    <Card
                      key={service.id}
                      className="bg-white/10 border border-white/20 hover:bg-white/20 cursor-pointer"
                      onClick={() => handleServiceSelect(service.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`p-2 rounded-lg bg-gradient-to-r ${service.color}`}>
                            <service.icon className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-white">{service.title}</h3>
                            {service.popular && (
                              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
                                Popular
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-white/80">{service.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {filteredServices.length === 0 && searchTerm && (
                  <div className="text-center py-8">
                    <Search className="h-12 w-12 text-white/40 mx-auto mb-4" />
                    <p className="text-white/60">No services found for "{searchTerm}"</p>
                    <Button
                      variant="outline"
                      onClick={() => setSearchTerm('')}
                      className="mt-4 bg-white/20 hover:bg-white/30 text-white border-white/30"
                    >
                      Clear Search
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 