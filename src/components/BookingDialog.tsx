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
    <DialogContent className="sm:max-w-md bg-gradient-to-br from-gray-900 to-black border border-yellow-500/30 shadow-2xl">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-white">
          <BookOpen className="h-5 w-5 text-yellow-400" />
          Book {selectedProvider?.name}
        </DialogTitle>
        <DialogDescription className="text-white/80">
          {selectedProvider?.service} • R{selectedProvider?.hourlyRate}/hour
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-white">Date</label>
            <Input
              type="date"
              value={bookingDetails.date}
              onChange={(e) => setBookingDetails((prev: any) => ({ ...prev, date: e.target.value }))}
              min={new Date().toISOString().split('T')[0]}
              className="bg-gray-800 border-yellow-500/30 text-white placeholder:text-gray-400 focus:border-yellow-400 focus:ring-yellow-400/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-white">Time</label>
            <Input
              type="time"
              value={bookingDetails.time}
              onChange={(e) => setBookingDetails((prev: any) => ({ ...prev, time: e.target.value }))}
              className="bg-gray-800 border-yellow-500/30 text-white placeholder:text-gray-400 focus:border-yellow-400 focus:ring-yellow-400/20"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1 text-white">Service Description</label>
          <Textarea
            placeholder="Describe what you need done..."
            value={bookingDetails.description}
            onChange={(e) => setBookingDetails((prev: any) => ({ ...prev, description: e.target.value }))}
            rows={3}
            className="bg-gray-800 border-yellow-500/30 text-white placeholder:text-gray-400 focus:border-yellow-400 focus:ring-yellow-400/20"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1 text-white">Location</label>
          <Input
            placeholder="Enter your address"
            value={bookingDetails.location}
            onChange={(e) => setBookingDetails((prev: any) => ({ ...prev, location: e.target.value }))}
            className="bg-gray-800 border-yellow-500/30 text-white placeholder:text-gray-400 focus:border-yellow-400 focus:ring-yellow-400/20"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-white">Urgency</label>
            <Select value={bookingDetails.urgency} onValueChange={(value) => setBookingDetails((prev: any) => ({ ...prev, urgency: value }))}>
              <SelectTrigger className="bg-gray-800 border-yellow-500/30 text-white focus:border-yellow-400 focus:ring-yellow-400/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-yellow-500/30">
                <SelectItem value="low" className="text-white hover:bg-gray-700">Low Priority</SelectItem>
                <SelectItem value="normal" className="text-white hover:bg-gray-700">Normal</SelectItem>
                <SelectItem value="high" className="text-white hover:bg-gray-700">High Priority</SelectItem>
                <SelectItem value="urgent" className="text-white hover:bg-gray-700">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-white">Estimated Hours</label>
            <Select value={bookingDetails.estimatedHours.toString()} onValueChange={(value) => setBookingDetails((prev: any) => ({ ...prev, estimatedHours: parseInt(value) }))}>
              <SelectTrigger className="bg-gray-800 border-yellow-500/30 text-white focus:border-yellow-400 focus:ring-yellow-400/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-yellow-500/30">
                <SelectItem value="1" className="text-white hover:bg-gray-700">1 hour</SelectItem>
                <SelectItem value="2" className="text-white hover:bg-gray-700">2 hours</SelectItem>
                <SelectItem value="3" className="text-white hover:bg-gray-700">3 hours</SelectItem>
                <SelectItem value="4" className="text-white hover:bg-gray-700">4 hours</SelectItem>
                <SelectItem value="8" className="text-white hover:bg-gray-700">Full day (8 hours)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-500/20 to-green-500/20 p-4 rounded-lg border border-yellow-500/30">
          <div className="flex justify-between items-center">
            <span className="font-medium text-white">Estimated Total:</span>
            <span className="text-lg font-bold text-yellow-400">
              R{(selectedProvider?.hourlyRate || 0) * bookingDetails.estimatedHours}
            </span>
          </div>
          <p className="text-sm text-white/70 mt-1">
            Final amount may vary based on actual work completed
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={handleBookingSubmit} 
            className="flex-1 bg-gradient-to-r from-yellow-500 to-green-500 hover:from-yellow-400 hover:to-green-400 text-white border-0 shadow-lg"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Confirm Booking
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowBookingDialog(false)}
            className="border-yellow-500/30 text-white hover:bg-yellow-500/10 hover:border-yellow-400"
          >
            Cancel
          </Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);