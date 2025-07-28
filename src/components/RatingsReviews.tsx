import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Star, ThumbsUp, MessageCircle } from 'lucide-react';

interface RatingsReviewsProps {
  onNavigate: (view: string) => void;
}

export default function RatingsReviews({ onNavigate }: RatingsReviewsProps) {
  const [activeTab, setActiveTab] = useState('received');

  const mockReviews = [
    {
      id: 1,
      reviewer: 'Sarah Johnson',
      rating: 5,
      date: '2 days ago',
      service: 'Electrical Repair',
      comment: 'Ahmed was fantastic! Fixed my power outlet quickly and professionally. Highly recommended!',
      helpful: 12
    },
    {
      id: 2,
      reviewer: 'Mike Chen',
      rating: 4,
      date: '1 week ago',
      service: 'Light Installation',
      comment: 'Good work, arrived on time. Could have been a bit more communicative about the process.',
      helpful: 8
    },
    {
      id: 3,
      reviewer: 'Linda Williams',
      rating: 5,
      date: '2 weeks ago',
      service: 'Electrical Maintenance',
      comment: 'Professional and knowledgeable. Explained everything clearly and fixed the issue perfectly.',
      helpful: 15
    }
  ];

  const mockMyReviews = [
    {
      id: 1,
      provider: 'Maria Santos',
      rating: 5,
      date: '3 days ago',
      service: 'House Cleaning',
      comment: 'Maria did an excellent job cleaning my apartment. Very thorough and professional.',
      response: 'Thank you so much! It was a pleasure working with you.'
    },
    {
      id: 2,
      provider: 'James Wilson',
      rating: 4,
      date: '1 week ago',
      service: 'Plumbing',
      comment: 'Fixed the leak quickly, but took a bit longer than expected to arrive.',
      response: 'Thanks for the feedback! I apologize for the delay - there was unexpected traffic.'
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => onNavigate('home')}>
            ← Back
          </Button>
          <h1>Reviews & Ratings</h1>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6 text-center">
            <div className="text-4xl font-bold mb-2">4.8</div>
            <div className="flex justify-center mb-2">
              {renderStars(5)}
            </div>
            <p className="text-sm text-muted-foreground">Based on 89 reviews</p>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="received">Reviews I've Received</TabsTrigger>
            <TabsTrigger value="given">Reviews I've Given</TabsTrigger>
          </TabsList>

          <TabsContent value="received" className="space-y-4 mt-6">
            {mockReviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        {review.reviewer.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium">{review.reviewer}</h4>
                        <span className="text-xs text-muted-foreground">{review.date}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {renderStars(review.rating)}
                        </div>
                        <Badge variant="secondary" className="text-xs">{review.service}</Badge>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm mb-3">{review.comment}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <button className="flex items-center gap-1 hover:text-primary">
                      <ThumbsUp className="h-3 w-3" />
                      <span>Helpful ({review.helpful})</span>
                    </button>
                    <button className="flex items-center gap-1 hover:text-primary">
                      <MessageCircle className="h-3 w-3" />
                      <span>Reply</span>
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="given" className="space-y-4 mt-6">
            {mockMyReviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gradient-to-br from-green-500 to-blue-600 text-white">
                        {review.provider.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium">{review.provider}</h4>
                        <span className="text-xs text-muted-foreground">{review.date}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {renderStars(review.rating)}
                        </div>
                        <Badge variant="secondary" className="text-xs">{review.service}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm font-medium mb-1">Your Review:</p>
                      <p className="text-sm">{review.comment}</p>
                    </div>
                    {review.response && (
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-sm font-medium mb-1">Provider Response:</p>
                        <p className="text-sm">{review.response}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        <Card className="mt-6 bg-amber-50 border-amber-200">
          <CardContent className="p-4">
            <h4 className="font-medium mb-2">💡 Review Tips</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Be honest and specific about your experience</li>
              <li>• Mention both positives and areas for improvement</li>
              <li>• Help other users make informed decisions</li>
              <li>• Keep it professional and respectful</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}