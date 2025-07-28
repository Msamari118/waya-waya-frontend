import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Clock, MapPin, Zap, Plus, X } from 'lucide-react';

interface ServiceRequestModuleProps {
  onNavigate: (view: string) => void;
  onRequestSubmit: (request: any) => void;
}

export default function ServiceRequestModule({ onNavigate, onRequestSubmit }: ServiceRequestModuleProps) {
  const [requestData, setRequestData] = useState({
    serviceType: '',
    description: '',
    urgency: 'normal',
    location: '',
    budget: ''
  });
  const [showCustomService, setShowCustomService] = useState(false);
  const [customServiceName, setCustomServiceName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRequestSubmit({
      ...requestData,
      id: Date.now(),
      timestamp: new Date().toISOString()
    });
    onNavigate('matching');
  };

  const handleInputChange = (field: string, value: string) => {
    setRequestData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddCustomService = () => {
    if (customServiceName.trim()) {
      setRequestData(prev => ({ ...prev, serviceType: customServiceName }));
      setShowCustomService(false);
      setCustomServiceName('');
    }
  };

  const handleCancelCustomService = () => {
    setShowCustomService(false);
    setCustomServiceName('');
    setRequestData(prev => ({ ...prev, serviceType: '' }));
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => onNavigate('home')}>
            ← Back
          </Button>
          <h1>Request Service</h1>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-red-500" />
              <CardTitle>Service Request</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-2">Service Type</label>
                {!showCustomService ? (
                  <div className="space-y-3">
                    <Select value={requestData.serviceType} onValueChange={(value) => handleInputChange('serviceType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select service type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="plumbing">Plumbing</SelectItem>
                        <SelectItem value="electrical">Electrical</SelectItem>
                        <SelectItem value="cleaning">Cleaning</SelectItem>
                        <SelectItem value="beauty">Beauty & Personal Care</SelectItem>
                        <SelectItem value="transport">Transport & Delivery</SelectItem>
                        <SelectItem value="security">Security Services</SelectItem>
                        <SelectItem value="tutoring">Tutoring & Education</SelectItem>
                        <SelectItem value="garden">Gardening & Landscaping</SelectItem>
                        <SelectItem value="handyman">General Handyman</SelectItem>
                        <SelectItem value="appliance">Appliance Repair</SelectItem>
                        <SelectItem value="catering">Catering & Events</SelectItem>
                        <SelectItem value="fitness">Fitness & Personal Training</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    {/* Add Custom Service Button */}
                    <div className="text-center">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowCustomService(true)}
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Don't see your service? Add custom service
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="p-4 border-2 border-blue-200 rounded-lg bg-blue-50">
                      <h4 className="font-medium mb-2">Add Your Custom Service</h4>
                      <Input
                        placeholder="e.g., Pet grooming, Car detailing, Personal chef, etc."
                        value={customServiceName}
                        onChange={(e) => setCustomServiceName(e.target.value)}
                        className="mb-3"
                      />
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          onClick={handleAddCustomService}
                          disabled={!customServiceName.trim()}
                        >
                          Add Service
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleCancelCustomService}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Show selected custom service */}
                {requestData.serviceType && !['plumbing', 'electrical', 'cleaning', 'beauty', 'transport', 'security', 'tutoring', 'garden', 'handyman', 'appliance', 'catering', 'fitness'].includes(requestData.serviceType) && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-green-800">Custom Service Added:</p>
                        <p className="text-green-700">{requestData.serviceType}</p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setRequestData(prev => ({ ...prev, serviceType: '' }));
                          setShowCustomService(true);
                        }}
                        className="text-green-600 hover:text-green-800"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block mb-2">Description</label>
                <Textarea
                  placeholder="Describe what you need help with..."
                  value={requestData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="resize-none h-24"
                  required
                />
              </div>

              <div>
                <label className="block mb-2">Urgency</label>
                <Select value={requestData.urgency} onValueChange={(value) => handleInputChange('urgency', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="emergency">
                      <div className="flex items-center gap-2">
                        <Badge variant="destructive">Emergency</Badge>
                        <span>ASAP</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="urgent">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-orange-500">Urgent</Badge>
                        <span>Within 2 hours</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="normal">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">Normal</Badge>
                        <span>Today</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="flexible">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Flexible</Badge>
                        <span>This week</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block mb-2">Location</label>
                <Input
                  placeholder="Enter your address"
                  value={requestData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block mb-2">Budget (Optional)</label>
                <Input
                  placeholder="e.g. R500"
                  value={requestData.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full" disabled={!requestData.serviceType}>
                Find Available Providers
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-blue-800">Quick Response</span>
          </div>
          <p className="text-sm text-blue-700">
            Most requests get responses within 5-10 minutes. Emergency requests are prioritized.
          </p>
        </div>

        <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
          <h4 className="font-medium mb-2 text-amber-800">💡 Can't find your service?</h4>
          <p className="text-sm text-amber-700">
            No worries! Use the "Add custom service" button to specify exactly what you need. 
            Our providers offer a wide range of services beyond the popular categories.
          </p>
        </div>
      </div>
    </div>
  );
}