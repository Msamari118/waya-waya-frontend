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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => setCurrentView('client')}>
          ← Back
        </Button>
        <WayaWayaLogo size="sm" />
        <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 via-green-400 to-blue-400 bg-clip-text text-transparent">
          What Service Do You Need?
        </h1>
      </div>

      {/* Search Bar */}
      <Card className="bg-gradient-to-br from-black/80 via-gray-900/90 to-black/80 backdrop-blur-md border border-yellow-500/30 shadow-2xl">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search for services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-black/40 border-yellow-500/30 text-white placeholder:text-gray-400 focus:border-green-500 backdrop-blur-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* Popular Services */}
      {!searchTerm && (
        <Card className="bg-gradient-to-br from-black/80 via-gray-900/90 to-black/80 backdrop-blur-md border border-yellow-500/30 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-400" />
              Popular Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {serviceCategories.filter(s => s.popular).map((service) => (
                <Button
                  key={service.id}
                  onClick={() => handleServiceSelect(service.id)}
                  className="h-20 flex-col bg-gradient-to-r from-black/40 to-black/60 border border-yellow-500/30 hover:bg-yellow-500/20 backdrop-blur-sm text-white"
                >
                  <service.icon className="h-6 w-6 mb-2" />
                  <span className="font-medium">{service.title}</span>
                  <span className="text-xs text-gray-300">{service.description}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Services */}
      <Card className="bg-gradient-to-br from-black/80 via-gray-900/90 to-black/80 backdrop-blur-md border border-yellow-500/30 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white">
            {searchTerm ? 'Search Results' : 'All Services'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredServices.map((service) => (
              <Card
                key={service.id}
                className="bg-gradient-to-br from-black/40 to-black/60 border border-yellow-500/30 hover:border-green-500/50 transition-all duration-200 cursor-pointer backdrop-blur-sm"
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
                  <p className="text-sm text-gray-300">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredServices.length === 0 && searchTerm && (
            <div className="text-center py-8">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">No services found for "{searchTerm}"</p>
              <Button
                variant="outline"
                onClick={() => setSearchTerm('')}
                className="mt-4 border-yellow-500/30 text-gray-300 hover:bg-yellow-500/20"
              >
                Clear Search
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-br from-black/80 via-gray-900/90 to-black/80 backdrop-blur-md border border-yellow-500/30 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="border-yellow-500/30 bg-black/40 text-gray-200 hover:bg-yellow-500/20 backdrop-blur-sm"
              onClick={() => setCurrentView('client')}
            >
              <Home className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <Button
              variant="outline"
              className="border-yellow-500/30 bg-black/40 text-gray-200 hover:bg-yellow-500/20 backdrop-blur-sm"
              onClick={() => setCurrentView('service-request')}
            >
              <Award className="h-4 w-4 mr-2" />
              Custom Request
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 