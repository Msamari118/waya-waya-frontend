import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { X, Plus, CreditCard, Building2, Wallet } from 'lucide-react';
import southAfricanPaymentService, { PaymentMethod } from '../../utils/southAfricanPaymentService.js';

interface PaymentStepProps {
  formData: any;
  errors: any;
  onFieldChange: (field: string, value: any) => void;
  onError: (field: string, error: string) => void;
}

export const PaymentStep: React.FC<PaymentStepProps> = ({
  formData,
  errors,
  onFieldChange,
  onError
}) => {
  const paymentMethods: PaymentMethod[] = southAfricanPaymentService.getSupportedPaymentMethods();

  const addPaymentMethod = () => {
    const newMethod = prompt('Enter payment method:');
    if (newMethod && newMethod.trim()) {
      const currentMethods = formData.paymentMethods || [];
      if (!currentMethods.includes(newMethod.trim())) {
        onFieldChange('paymentMethods', [...currentMethods, newMethod.trim()]);
      }
    }
  };

  const removePaymentMethod = (methodToRemove: string) => {
    const currentMethods = formData.paymentMethods || [];
    onFieldChange('paymentMethods', currentMethods.filter((method: string) => method !== methodToRemove));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Payment & Pricing</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Set your rates and payment preferences for South African clients.
        </p>
      </div>

      {/* Hourly Rate */}
      <div className="space-y-2">
        <Label htmlFor="hourlyRate">Hourly Rate (ZAR) *</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            R
          </span>
          <Input
            id="hourlyRate"
            type="number"
            min="50"
            max="2000"
            step="10"
            placeholder="Enter your hourly rate"
            value={formData.hourlyRate || ''}
            onChange={(e) => onFieldChange('hourlyRate', e.target.value)}
            className="pl-8"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Recommended range: R100 - R500 per hour
        </p>
        {errors.hourlyRate && (
          <p className="text-sm text-red-500">{errors.hourlyRate}</p>
        )}
      </div>

      {/* Pricing Options */}
      <div className="space-y-4">
        <Label>Pricing Options</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Fixed Price Jobs */}
          <div className="space-y-2">
            <Label htmlFor="fixedPriceJobs">Fixed Price Jobs</Label>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="fixedPriceJobs"
                checked={formData.fixedPriceJobs || false}
                onChange={(e) => onFieldChange('fixedPriceJobs', e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="fixedPriceJobs" className="text-sm">
                I offer fixed-price quotes for certain jobs
              </Label>
            </div>
          </div>

          {/* Emergency Rates */}
          <div className="space-y-2">
            <Label htmlFor="emergencyRates">Emergency Rates</Label>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="emergencyRates"
                checked={formData.emergencyRates || false}
                onChange={(e) => onFieldChange('emergencyRates', e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="emergencyRates" className="text-sm">
                I charge extra for emergency/after-hours work
              </Label>
            </div>
          </div>
        </div>

        {/* Emergency Rate Amount */}
        {formData.emergencyRates && (
          <div className="space-y-2">
            <Label htmlFor="emergencyRateAmount">Emergency Rate (ZAR/hour)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                R
              </span>
              <Input
                id="emergencyRateAmount"
                type="number"
                min="100"
                max="3000"
                step="10"
                placeholder="Enter emergency rate"
                value={formData.emergencyRateAmount || ''}
                onChange={(e) => onFieldChange('emergencyRateAmount', e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        )}
      </div>

      {/* South African Payment Methods */}
      <div className="space-y-4">
        <Label>Accepted Payment Methods</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paymentMethods.map((method: PaymentMethod) => (
            <div key={method.id} className="flex items-center space-x-3 p-3 border rounded-lg">
              <span className="text-2xl">{method.icon}</span>
              <div className="flex-1">
                <p className="font-medium">{method.name}</p>
                <p className="text-sm text-muted-foreground">{method.description}</p>
                <p className="text-xs text-muted-foreground">Processing: {method.processingTime}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Banking Information */}
      <div className="space-y-4">
        <Label>Banking Information (Required for EFT Payments)</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Bank Name */}
          <div className="space-y-2">
            <Label htmlFor="bankName">Bank Name *</Label>
            <Input
              id="bankName"
              placeholder="e.g., Standard Bank, FNB, ABSA"
              value={formData.bankName || ''}
              onChange={(e) => onFieldChange('bankName', e.target.value)}
            />
            {errors.bankName && (
              <p className="text-sm text-red-500">{errors.bankName}</p>
            )}
          </div>

          {/* Account Type */}
          <div className="space-y-2">
            <Label htmlFor="accountType">Account Type *</Label>
            <Select
              value={formData.accountType || ''}
              onValueChange={(value) => onFieldChange('accountType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select account type" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-lg">
                <SelectItem value="savings" className="text-gray-900 hover:bg-gray-100">Savings Account</SelectItem>
                <SelectItem value="current" className="text-gray-900 hover:bg-gray-100">Current Account</SelectItem>
                <SelectItem value="business" className="text-gray-900 hover:bg-gray-100">Business Account</SelectItem>
              </SelectContent>
            </Select>
            {errors.accountType && (
              <p className="text-sm text-red-500">{errors.accountType}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Account Number */}
          <div className="space-y-2">
            <Label htmlFor="accountNumber">Account Number *</Label>
            <Input
              id="accountNumber"
              placeholder="Enter account number"
              value={formData.accountNumber || ''}
              onChange={(e) => onFieldChange('accountNumber', e.target.value)}
            />
            {errors.accountNumber && (
              <p className="text-sm text-red-500">{errors.accountNumber}</p>
            )}
          </div>

          {/* Branch Code */}
          <div className="space-y-2">
            <Label htmlFor="branchCode">Branch Code *</Label>
            <Input
              id="branchCode"
              placeholder="Enter branch code"
              value={formData.branchCode || ''}
              onChange={(e) => onFieldChange('branchCode', e.target.value)}
            />
            {errors.branchCode && (
              <p className="text-sm text-red-500">{errors.branchCode}</p>
            )}
          </div>
        </div>

        {/* Account Holder Name */}
        <div className="space-y-2">
          <Label htmlFor="accountHolderName">Account Holder Name *</Label>
          <Input
            id="accountHolderName"
            placeholder="Enter account holder name"
            value={formData.accountHolderName || ''}
            onChange={(e) => onFieldChange('accountHolderName', e.target.value)}
          />
          {errors.accountHolderName && (
            <p className="text-sm text-red-500">{errors.accountHolderName}</p>
          )}
        </div>
      </div>

      {/* Additional Payment Information */}
      <div className="space-y-4">
        <Label>Additional Payment Information</Label>
        
        {/* Minimum Charge */}
        <div className="space-y-2">
          <Label htmlFor="minimumCharge">Minimum Charge (ZAR)</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              R
            </span>
            <Input
              id="minimumCharge"
              type="number"
              min="0"
              max="1000"
              step="10"
              placeholder="Enter minimum charge"
              value={formData.minimumCharge || ''}
              onChange={(e) => onFieldChange('minimumCharge', e.target.value)}
              className="pl-8"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Minimum amount for any service call
          </p>
        </div>

        {/* Callout Fee */}
        <div className="space-y-2">
          <Label htmlFor="calloutFee">Callout Fee (ZAR)</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              R
            </span>
            <Input
              id="calloutFee"
              type="number"
              min="0"
              max="500"
              step="10"
              placeholder="Enter callout fee"
              value={formData.calloutFee || ''}
              onChange={(e) => onFieldChange('calloutFee', e.target.value)}
              className="pl-8"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Fee for traveling to client location
          </p>
        </div>
      </div>
    </div>
  );
}; 