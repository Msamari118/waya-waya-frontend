import React from 'react';
import { BookOpen, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';

interface BookingDialogProps {
  showBookingDialog: boolean;
  setShowBookingDialog: (show: boolean) => void;
  selectedProvider: any;
  bookingDetails: any;
  setBookingDetails: (details: any) => void;
  handleBookingSubmit: () => void;
  isConnected: boolean;
}

export const BookingDialog: React.FC<BookingDialogProps> = ({
  showBookingDialog,
  setShowBookingDialog,
  selectedProvider,
  bookingDetails,
  setBookingDetails,
  handleBookingSubmit,
  isConnected
}) => (
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
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <Input
              type="date"
              value={bookingDetails.date}
              onChange={(e) => setBookingDetails((prev: any) => ({ ...prev, date: e.target.value }))}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Time</label>
            <Input
              type="time"
              value={bookingDetails.time}
              onChange={(e) => setBookingDetails((prev: any) => ({ ...prev, time: e.target.value }))}
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Service Description</label>
          <Textarea
            placeholder="Describe what you need done..."
            value={bookingDetails.description}
            onChange={(e) => setBookingDetails((prev: any) => ({ ...prev, description: e.target.value }))}
            rows={3}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <Input
            placeholder="Enter your address"
            value={bookingDetails.location}
            onChange={(e) => setBookingDetails((prev: any) => ({ ...prev, location: e.target.value }))}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Urgency</label>
            <Select value={bookingDetails.urgency} onValueChange={(value) => setBookingDetails((prev: any) => ({ ...prev, urgency: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low Priority</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Estimated Hours</label>
            <Select value={bookingDetails.estimatedHours.toString()} onValueChange={(value) => setBookingDetails((prev: any) => ({ ...prev, estimatedHours: parseInt(value) }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 hour</SelectItem>
                <SelectItem value="2">2 hours</SelectItem>
                <SelectItem value="3">3 hours</SelectItem>
                <SelectItem value="4">4 hours</SelectItem>
                <SelectItem value="8">Full day (8 hours)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="bg-muted p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-medium">Estimated Total:</span>
            <span className="text-lg font-bold">
              R{(selectedProvider?.hourlyRate || 0) * bookingDetails.estimatedHours}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Final amount may vary based on actual work completed
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={handleBookingSubmit} className="flex-1">
            <CheckCircle className="h-4 w-4 mr-2" />
            Confirm Booking
          </Button>
          <Button variant="outline" onClick={() => setShowBookingDialog(false)}>
            Cancel
          </Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);