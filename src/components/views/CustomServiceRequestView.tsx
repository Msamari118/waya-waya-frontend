import React, { useState } from 'react';
import { WayaWayaLogo } from '../shared/WayaWayaLogo';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import {
  ArrowLeft, Calendar, Clock, MapPin, DollarSign, FileText, 
  AlertCircle, CheckCircle, Star, Phone, MessageCircle
} from 'lucide-react';

interface CustomServiceRequestViewProps {
  isConnected: boolean;
  authToken: string | null;
  setCurrentView: (view: string) => void;
}

const urgencyOptions = [
  { value: 'emergency', label: 'Emergency (Same day)', icon: '🚨' },
  { value: 'urgent', label: 'Urgent (Next day)', icon: '⚡' },
  { value: 'normal', label: 'Normal (Within week)', icon: '📅' },
  { value: 'flexible', label: 'Flexible (No rush)', icon: '🌱' }
];

const budgetRanges = [
  { value: '0-500', label: 'Under R500' },
  { value: '500-1000', label: 'R500 - R1,000' },
  { value: '1000-2000', label: 'R1,000 - R2,000' },
  { value: '2000-5000', label: 'R2,000 - R5,000' },
  { value: '5000+', label: 'R5,000+' },
  { value: 'negotiable', label: 'Negotiable' }
];

export const CustomServiceRequestView: React.FC<CustomServiceRequestViewProps> = ({
  isConnected,
  authToken,
  setCurrentView
}) => {
  const [formData, setFormData] = useState({
    serviceTitle: '',
    serviceDescription: '',
    urgency: '',
    budget: '',
    preferredDate: '',
    preferredTime: '',
    location: '',
    contactPhone: '',
    additionalNotes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
    }, 2000);
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-md mx-auto p-4">
          <Card className="bg-white shadow-xl border-0">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Request Submitted!
                </h2>
                <p className="text-gray-600">
                  Your custom service request has been sent to our team. We'll match you with the best providers.
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">What happens next?</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• We'll review your request within 2 hours</li>
                    <li>• You'll receive provider matches via SMS</li>
                    <li>• Choose your preferred provider</li>
                    <li>• Schedule and pay securely</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                  onClick={() => setCurrentView('client')}
                >
                  Back to Dashboard
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-blue-200 text-blue-600 hover:bg-blue-50"
                  onClick={() => {
                    setSubmitSuccess(false);
                    setFormData({
                      serviceTitle: '',
                      serviceDescription: '',
                      urgency: '',
                      budget: '',
                      preferredDate: '',
                      preferredTime: '',
                      location: '',
                      contactPhone: '',
                      additionalNotes: ''
                    });
                  }}
                >
                  Submit Another Request
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md mx-auto p-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            onClick={() => setCurrentView('service-selection')}
            className="text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <WayaWayaLogo size="sm" />
          <h1 className="text-2xl font-bold text-gray-800">
            Custom Service Request
          </h1>
        </div>

        <Card className="bg-white shadow-xl border-0">
          <CardHeader>
            <CardTitle className="text-gray-800 flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Tell us about your service
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Service Title */}
              <div className="space-y-2">
                <Label htmlFor="serviceTitle" className="text-gray-700 font-medium">
                  Service Title *
                </Label>
                <Input
                  id="serviceTitle"
                  placeholder="e.g., Home renovation, Event planning, IT support"
                  value={formData.serviceTitle}
                  onChange={(e) => handleInputChange('serviceTitle', e.target.value)}
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Service Description */}
              <div className="space-y-2">
                <Label htmlFor="serviceDescription" className="text-gray-700 font-medium">
                  Detailed Description *
                </Label>
                <Textarea
                  id="serviceDescription"
                  placeholder="Describe exactly what you need, including any specific requirements, materials, or preferences..."
                  value={formData.serviceDescription}
                  onChange={(e) => handleInputChange('serviceDescription', e.target.value)}
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 min-h-[100px]"
                  required
                />
              </div>

              {/* Urgency */}
              <div className="space-y-2">
                <Label htmlFor="urgency" className="text-gray-700 font-medium">
                  How urgent is this? *
                </Label>
                <Select value={formData.urgency} onValueChange={(value) => handleInputChange('urgency', value)}>
                  <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Select urgency level" />
                  </SelectTrigger>
                  <SelectContent>
                    {urgencyOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <span className="flex items-center gap-2">
                          <span>{option.icon}</span>
                          <span>{option.label}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Budget */}
              <div className="space-y-2">
                <Label htmlFor="budget" className="text-gray-700 font-medium">
                  Budget Range
                </Label>
                <Select value={formData.budget} onValueChange={(value) => handleInputChange('budget', value)}>
                  <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Select budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    {budgetRanges.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Preferred Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="preferredDate" className="text-gray-700 font-medium">
                    Preferred Date
                  </Label>
                  <Input
                    id="preferredDate"
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) => handleInputChange('preferredDate', e.target.value)}
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preferredTime" className="text-gray-700 font-medium">
                    Preferred Time
                  </Label>
                  <Input
                    id="preferredTime"
                    type="time"
                    value={formData.preferredTime}
                    onChange={(e) => handleInputChange('preferredTime', e.target.value)}
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location" className="text-gray-700 font-medium">
                  Service Location *
                </Label>
                <Input
                  id="location"
                  placeholder="Enter your address or location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Contact Phone */}
              <div className="space-y-2">
                <Label htmlFor="contactPhone" className="text-gray-700 font-medium">
                  Contact Phone
                </Label>
                <Input
                  id="contactPhone"
                  placeholder="Your phone number for provider contact"
                  value={formData.contactPhone}
                  onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              {/* Additional Notes */}
              <div className="space-y-2">
                <Label htmlFor="additionalNotes" className="text-gray-700 font-medium">
                  Additional Notes
                </Label>
                <Textarea
                  id="additionalNotes"
                  placeholder="Any special requirements, preferences, or additional information..."
                  value={formData.additionalNotes}
                  onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              {/* Info Alert */}
              <Alert className="bg-blue-50 border-blue-200">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  We'll match you with verified providers who can handle your specific request. 
                  You'll receive quotes within 2-4 hours.
                </AlertDescription>
              </Alert>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Submitting...
                  </div>
                ) : (
                  'Submit Request'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 