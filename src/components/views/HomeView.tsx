import React from 'react';
import { WayaWayaLogo } from '../shared/WayaWayaLogo';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  Search, MapPin, Star, Clock, Zap, Settings, Server, MessageCircle, BookOpen
} from 'lucide-react';
import { serviceCategories, featuredProviders } from '../../utils/constants.js';

interface HomeViewProps {
  isAdminMode: boolean;
  isConnected: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  setCurrentView: (view: string) => void;
  setSelectedService: (service: string) => void;
  startProviderChat: (provider: any) => void;
  startBooking: (provider: any) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  isAdminMode,
  isConnected,
  searchTerm,
  setSearchTerm,
  setCurrentView,
  setSelectedService,
  startProviderChat,
  startBooking
}) => (
  <div className="space-y-6">
    {/* Admin access removed for security - only accessible via backend authentication */}

          {!isConnected && (
      <Alert className="bg-blue-50 border-blue-200">
        <Server className="h-4 w-4" />
        <AlertDescription className="text-blue-800">
          
        </AlertDescription>
      </Alert>
    )}

    <div className="relative bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 text-white p-6 rounded-2xl overflow-hidden">
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <WayaWayaLogo size="md" showText={false} />
          <div>
            <h1 className="text-3xl font-bold">WAYA WAYA!</h1>
            <p className="text-lg opacity-90">Any service. Any time. Anywhere in South Africa.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4" />
          <span>24/7 Available</span>
        </div>
      </div>
      <div className="absolute top-4 right-4 text-6xl opacity-20">🇿🇦</div>
    </div>

    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
      <Input
        placeholder="What service do you need?"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10 h-12 text-base"
      />
    </div>

    <Button
      className="w-full h-14 bg-red-600 hover:bg-red-700 text-white rounded-xl"
      onClick={() => setCurrentView('service-request')}
    >
      <Zap className="mr-2 h-5 w-5" />
      EMERGENCY SERVICE
    </Button>

    <div>
      <h2 className="mb-4">Service Categories</h2>
      <div className="grid grid-cols-2 gap-3">
        {serviceCategories.map((category: any, index: any) => (
          <Card
            key={index}
            className="cursor-pointer hover:shadow-md transition-shadow border-0 bg-gradient-to-br from-gray-50 to-gray-100"
            onClick={() => {
              setSelectedService(category.name);
              setCurrentView('service-request');
            }}
          >
            <CardContent className="p-4 text-center">
              <div className={`w-12 h-12 ${category.color} rounded-full flex items-center justify-center mx-auto mb-2 text-white text-xl`}>
                {category.icon}
              </div>
              <p className="font-medium">{category.name}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>

    <div>
      <h2 className="mb-4">Available Near You</h2>
      <div className="space-y-3">
        {featuredProviders.map((provider: any) => (
          <Card key={provider.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        {provider.name.split(' ').map((n: any) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{provider.name}</h3>
                      <p className="text-sm text-muted-foreground">{provider.service}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm ml-1">{provider.rating}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">({provider.reviews})</span>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3 mr-1" />
                          {provider.distance}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={provider.available ? "default" : "secondary"} className="mb-2">
                      {provider.available ? "Available" : "Busy"}
                    </Badge>
                    <p className="text-sm font-semibold">R{provider.hourlyRate}/hr</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startProviderChat(provider)}
                    className="flex-1"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Chat
                  </Button>
                  <Button
                    onClick={() => startBooking(provider)}
                    size="sm"
                    className="flex-1"
                    disabled={!provider.available}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Book Now
                  </Button>
                </div>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Response time: {provider.responseTime}</span>
                  <span>Distance: {provider.distance}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </div>
);