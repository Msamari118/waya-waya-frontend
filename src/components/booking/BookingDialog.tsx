import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Alert, AlertDescription } from '../ui/alert';
import { BookOpen, Send, AlertTriangle } from 'lucide-react';
import { Provider, BookingData } from '../../types';

interface BookingDialogProps {
  showBookingDialog: boolean;
  setShowBookingDialog: (show: boolean) => void;
  selectedProvider: Provider | null;
  bookingData: BookingData;
  bookingError: string;
  handleBookingChange: (field: string, value: string | number) => void;
  handleLocationChange: (field: string, value: string | number | null) => void;
  handleSubmitBooking: () => void;
}

export const BookingDialog: React.FC<BookingDialogProps> = ({
  showBookingDialog,
  setShowBookingDialog,
  selectedProvider,
  bookingData,
  bookingError,
  handleBookingChange,
  handleLocationChange,
  handleSubmitBooking
}) => {
  return (
    <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Book {selectedProvider?.name}
          </DialogTitle>
          <DialogDescription>
            {selectedProvider?.service} • R{selectedProvider?.hourlyRate}/hour
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Service Type</label>
            <Input
              value={bookingData.serviceType}
              onChange={(e) => handleBookingChange('serviceType', e.target.value)}
              placeholder="e.g., Plumbing, Electrical"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={bookingData.description}
              onChange={(e) => handleBookingChange('description', e.target.value)}
              placeholder="Describe your service need..."
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Preferred Time</label>
            <Input
              type="datetime-local"
              value={bookingData.preferredTime}
              onChange={(e) => handleBookingChange('preferredTime', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Location</label>
            <div className="space-y-2">
              <Input
                placeholder="Address"
                value={bookingData.location.address}
                onChange={(e) => handleLocationChange('address', e.target.value)}
              />
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Latitude"
                  value={bookingData.location.lat || ''}
                  onChange={(e) => handleLocationChange('lat', parseFloat(e.target.value) || null)}
                />
                <Input
                  type="number"
                  placeholder="Longitude"
                  value={bookingData.location.lng || ''}
                  onChange={(e) => handleLocationChange('lng', parseFloat(e.target.value) || null)}
                />
              </div>
            </div>
          </div>
          
          {bookingError && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{bookingError}</AlertDescription>
            </Alert>
          )}
          
          <div className="flex gap-2">
            <Button onClick={handleSubmitBooking} className="flex-1">
              <Send className="h-4 w-4 mr-2" />
              Submit Booking
            </Button>
            <Button variant="outline" onClick={() => setShowBookingDialog(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 