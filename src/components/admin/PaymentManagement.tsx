import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { 
  TrendingUp, Wallet, AlertTriangle, CreditCard, Receipt, 
  Copy, DollarSign, FileText, ArrowLeft 
} from 'lucide-react';
import { WayaWayaLogo } from '../common/WayaWayaLogo';

interface PaymentManagementProps {
  onBack: () => void;
}

export const PaymentManagement: React.FC<PaymentManagementProps> = ({ onBack }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={onBack}>
          ← Back
        </Button>
        <WayaWayaLogo size="sm" />
        <h1>Payment Management</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R12,450.75</div>
            <p className="text-sm text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-blue-600" />
              Commission Due
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R465.50</div>
            <p className="text-sm text-muted-foreground">5% of earnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Overdue Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R770.00</div>
            <p className="text-sm text-muted-foreground">3 clients</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>EFT Payment Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">WAYA WAYA! Banking Details</h4>
            <div className="space-y-1 text-sm">
              <p><strong>Bank:</strong> Capitec Bank</p>
              <p><strong>Account Holder:</strong> Sandile Lunga</p>
              <p><strong>Account Number:</strong> 1178770999</p>
              <p><strong>Branch Code:</strong> 470010</p>
              <p><strong>Account Type:</strong> Savings</p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => navigator.clipboard.writeText('1178770999')}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Account Number
            </Button>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">Payment Processing</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                className="h-16 flex-col"
                onClick={() => alert('EFT Payment clicked!')}
              >
                <CreditCard className="h-6 w-6 mb-2" />
                EFT Payment
              </Button>
              <Button 
                variant="outline" 
                className="h-16 flex-col"
                onClick={() => alert('Manual Payment clicked!')}
              >
                <Receipt className="h-6 w-6 mb-2" />
                Manual Payment
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Commission Collection System</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 text-green-800">Monthly Commission Collection</h4>
              <p className="text-sm text-green-700 mb-3">
                WAYA WAYA! automatically collects 5% commission from provider earnings at the end of each month.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total Provider Earnings:</span>
                  <span className="font-semibold">R9,310.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Commission (5%):</span>
                  <span className="font-semibold">R465.50</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Next Collection:</span>
                  <span className="font-semibold">March 1, 2024</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                className="h-12"
                onClick={() => alert('Collect Commission clicked!')}
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Collect Commission Now
              </Button>
              <Button 
                variant="outline" 
                className="h-12"
                onClick={() => alert('Commission Report clicked!')}
              >
                <FileText className="h-4 w-4 mr-2" />
                Commission Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 