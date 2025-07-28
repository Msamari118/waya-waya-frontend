import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface LandingScreenProps {
  onNavigate: (view: string) => void;
}

export default function LandingScreen({ onNavigate }: LandingScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-bold text-2xl">W</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">WAYA WAYA!</h1>
          <p className="text-muted-foreground mb-8">Any service. Any time. Anywhere in South Africa.</p>
          
          <div className="space-y-4">
            <Button 
              className="w-full" 
              size="lg"
              onClick={() => onNavigate('login')}
            >
              Sign In
            </Button>
            <Button 
              variant="outline" 
              className="w-full" 
              size="lg"
              onClick={() => onNavigate('signup')}
            >
              Get Started
            </Button>
          </div>
          
          <div className="mt-8 pt-6 border-t">
            <p className="text-sm text-muted-foreground mb-4">Join as:</p>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onNavigate('signup-client')}
              >
                I need services
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onNavigate('signup-provider')}
              >
                I provide services
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}