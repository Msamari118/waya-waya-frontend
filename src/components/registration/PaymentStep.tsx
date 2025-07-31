import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { X, Plus, CreditCard, Building2, Wallet } from 'lucide-react';

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
  const paymentMethods = [
    'Cash',
    'Bank Transfer',
    'Credit Card',
    'Debit Card',
    'Mobile Money',
    'PayPal',
    'Other'
  ];

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
          Set your rates and payment preferences.
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

      {/* Payment Methods */}
      <div className="space-y-2">
        <Label>Accepted Payment Methods</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {(formData.paymentMethods || []).map((method: string) => (
            <Badge key={method} variant="secondary" className="flex items-center gap-1">
              {method === 'Credit Card' || method === 'Debit Card' ? (
                <CreditCard className="h-3 w-3" />
              ) : method === 'Bank Transfer' ? (
            <Building2 className="h-3 w-3" />
              ) : (
                <Wallet className="h-3 w-3" />
              )}
              {method}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => removePaymentMethod(method)}
              />
            </Badge>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addPaymentMethod}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Payment Method
        </Button>
      </div>

      {/* Banking Information */}
      <div className="space-y-4">
        <Label>Banking Information</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Bank Name */}
          <div className="space-y-2">
            <Label htmlFor="bankName">Bank Name *</Label>
            <Input
              id="bankName"
              placeholder="Enter bank name"
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
              <SelectContent>
                <SelectItem value="savings">Savings Account</SelectItem>
                <SelectItem value="current">Current Account</SelectItem>
                <SelectItem value="business">Business Account</SelectItem>
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

      {/* Payment Terms */}
      <div className="space-y-2">
        <Label htmlFor="paymentTerms">Payment Terms</Label>
        <Textarea
          id="paymentTerms"
          placeholder="Describe your payment terms (e.g., 50% upfront, payment within 7 days, etc.)"
          value={formData.paymentTerms || ''}
          onChange={(e) => onFieldChange('paymentTerms', e.target.value)}
          rows={3}
        />
        <p className="text-xs text-muted-foreground">
          Optional: Specify your payment terms and conditions
        </p>
      </div>

      {/* Tax Information */}
      <div className="space-y-2">
        <Label>Tax Information</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="vatRegistered"
              checked={formData.vatRegistered || false}
              onChange={(e) => onFieldChange('vatRegistered', e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="vatRegistered" className="text-sm">
              I am VAT registered
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="taxCompliant"
              checked={formData.taxCompliant || false}
              onChange={(e) => onFieldChange('taxCompliant', e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="taxCompliant" className="text-sm">
              I am tax compliant and can provide tax invoices
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
}; 