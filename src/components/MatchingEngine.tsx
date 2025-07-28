import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Star, MapPin, Clock, Phone, MessageCircle } from 'lucide-react';

interface MatchingEngineProps {
  onNavigate: (view: string) => void;
  serviceRequest: any;
  onStartBooking?: (provider: any) => void;
  onStartChat?: (provider: any) => void;
}

export default function MatchingEngine({ onNavigate, serviceRequest, onStartBooking, onStartChat }: MatchingEngineProps) {
  const [matchedProviders, setMatchedProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  const mockProviders = [
    {
      id: 1,
      name: 'Ahmed Hassan',
      service: 'Electrician',
      rating: 4.9,
      reviews: 127,
      distance: '2.3 km',
      available: true,
      hourlyRate: 250,
      currency: 'R',
      responseTime: '5 mins',
      image: null
    },
    {
      id: 2,
      name: 'Maria Santos',
      service: 'House Cleaning',
      rating: 4.8,
      reviews: 89,
      distance: '1.8 km',
      available: true,
      hourlyRate: 180,
      currency: 'R',
      responseTime: '3 mins',
      image: null
    },
    {
      id: 3,
      name: 'James Wilson',
      service: 'Plumber',
      rating: 4.7,
      reviews: 156,
      distance: '3.1 km',
      available: true,
      hourlyRate: 300,
      currency: 'R',
      responseTime: '8 mins',
      image: null
    },
  ];

  useEffect(() => {
    // Simulate matching process
    const timer = setTimeout(() => {
      setMatchedProviders(mockProviders);
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" onClick={() => onNavigate('home')}>
              ← Back
            </Button>
            <h1>Finding Providers</h1>
          </div>

          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <h3 className="font-semibold mb-2">Searching for providers...</h3>
              <p className="text-sm text-muted-foreground">We're finding the best providers for your request</p>
            </CardContent>
          </Card>

          {serviceRequest && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Your Request</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>Service:</strong> {serviceRequest.serviceType}</p>
                  <p><strong>Description:</strong> {serviceRequest.description}</p>
                  <p><strong>Urgency:</strong> <Badge>{serviceRequest.urgency}</Badge></p>
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
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => onNavigate('home')}>
            ← Back
          </Button>
          <div>
            <h1>Available Providers</h1>
            <p className="text-sm text-muted-foreground">{matchedProviders.length} providers found</p>
          </div>
        </div>

        <div className="space-y-4">
          {matchedProviders.map((provider) => (
            <Card key={provider.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start gap-3 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {provider.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold">{provider.name}</h3>
                    <p className="text-sm text-muted-foreground">{provider.service}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm ml-1">{provider.rating}</span>
                        <span className="text-sm text-muted-foreground ml-1">({provider.reviews})</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3 mr-1" />
                        {provider.distance}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="default" className="mb-2">Available</Badge>
                    <p className="text-sm font-semibold">{provider.currency}{provider.hourlyRate}/hr</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>Responds in ~{provider.responseTime}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => onStartChat?.(provider)}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Chat
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={() => onStartBooking?.(provider)}
                  >
                    Book Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h4 className="font-medium mb-2">Need help choosing?</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Our matching algorithm has selected these providers based on your location, budget, and requirements.
            </p>
            <Button variant="outline" size="sm">
              View All Providers
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}