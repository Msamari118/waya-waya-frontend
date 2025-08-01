import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import southAfricanPaymentService from '../utils/southAfricanPaymentService.js';

interface PaymentConfirmationProps {
  paymentData: {
    amount: number;
    paymentMethod: string;
    reference: string;
    status: 'pending' | 'completed' | 'failed';
  };
  onClose: () => void;
}

export const PaymentConfirmation: React.FC<PaymentConfirmationProps> = ({
  paymentData,
  onClose
}) => {
  const getStatusIcon = () => {
    switch (paymentData.status) {
      case 'completed':
        return <CheckCircle className="h-8 w-8 text-green-600" />;
      case 'pending':
        return <Clock className="h-8 w-8 text-yellow-600" />;
      case 'failed':
        return <AlertCircle className="h-8 w-8 text-red-600" />;
      default:
        return <Clock className="h-8 w-8 text-yellow-600" />;
    }
  };

  const getStatusMessage = () => {
    switch (paymentData.status) {
      case 'completed':
        return 'Payment completed successfully!';
      case 'pending':
        return 'Payment is being processed...';
      case 'failed':
        return 'Payment failed. Please try again.';
      default:
        return 'Payment is being processed...';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getStatusIcon()}
            Payment Confirmation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-lg font-semibold">{getStatusMessage()}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Reference: {paymentData.reference}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Amount:</span>
              <span className="font-semibold">
                {southAfricanPaymentService.formatAmount(paymentData.amount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Method:</span>
              <span className="font-semibold">{paymentData.paymentMethod}</span>
            </div>
          </div>

          <Button onClick={onClose} className="w-full">
            Close
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}; 