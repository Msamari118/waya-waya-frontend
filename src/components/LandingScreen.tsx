import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface LandingScreenProps {
  onNavigate: (view: string) => void;
}

export default function LandingScreen({ onNavigate }: LandingScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm border-2 border-black/10 shadow-2xl">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-white font-bold text-2xl">W</span>
          </div>
          <h1 className="text-3xl font-bold mb-2 text-gray-900">WAYA WAYA!</h1>
          <p className="text-gray-600 mb-8">Any service. Any time. Anywhere in South Africa.</p>
          
          <div className="space-y-4">
            <Button 
              className="w-full bg-gray-900 hover:bg-gray-800 text-white" 
              size="lg"
              onClick={() => onNavigate('login')}
            >
              Sign In
            </Button>
            <Button 
              variant="outline" 
              className="w-full border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white" 
              size="lg"
              onClick={() => onNavigate('signup')}
            >
              Get Started
            </Button>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-300">
            <p className="text-sm text-gray-500 mb-4">Join as:</p>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-gray-900 hover:bg-orange-50"
                onClick={() => onNavigate('signup-client')}
              >
                I need services
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-gray-900 hover:bg-orange-50"
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