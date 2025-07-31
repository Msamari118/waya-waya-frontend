import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Alert, AlertDescription } from '../ui/alert';
import { TrendingUp, Wallet, AlertTriangle, DollarSign, CreditCard, Receipt, Copy, FileText, CheckCircle, Download, Send, Calculator } from 'lucide-react';
import { WayaWayaLogo } from '../shared/WayaWayaLogo';

interface PaymentManagementProps {
  onNavigate: (view: string) => void;
}

export const PaymentManagement: React.FC<PaymentManagementProps> = ({ onNavigate }) => {
  const [showEFTDialog, setShowEFTDialog] = useState(false);
  const [showInvoiceDialog, setShowInvoiceDialog] = useState(false);
  const [showCommissionDialog, setShowCommissionDialog] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentReference, setPaymentReference] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const mockProviders = [
    { id: 'provider-1', name: 'Ahmed Hassan', commissionDue: 145.50 },
    { id: 'provider-2', name: 'Maria Santos', commissionDue: 89.25 },
    { id: 'provider-3', name: 'James Wilson', commissionDue: 230.75 }
  ];

  const handleEFTPayment = async () => {
    if (!paymentAmount || !paymentReference) {
      alert('Please fill in all required fields');
      return;
    }

    setProcessingPayment(true);
    
    // Simulate API call
    setTimeout(() => {
      setProcessingPayment(false);
      setShowSuccess(true);
      setShowEFTDialog(false);
      setPaymentAmount('');
      setPaymentReference('');
      
      setTimeout(() => setShowSuccess(false), 3000);
    }, 2000);
  };

  const handleGenerateInvoice = () => {
    // Generate invoice logic
    const invoiceData = {
      invoiceNumber: `INV-${Date.now()}`,
      date: new Date().toLocaleDateString(),
      amount: paymentAmount || '150.00',
      description: 'WAYA WAYA Provider Application Fee'
    };
    
    alert(`Invoice Generated!\nInvoice #: ${invoiceData.invoiceNumber}\nAmount: R${invoiceData.amount}`);
    setShowInvoiceDialog(false);
  };

  const handleCollectCommission = async (providerId?: string) => {
    const provider = providerId ? mockProviders.find(p => p.id === providerId) : null;
    const amount = provider ? provider.commissionDue : 465.50;
    
    setProcessingPayment(true);
    
    // Simulate API call
    setTimeout(() => {
      setProcessingPayment(false);
      alert(`Commission collected successfully!\nAmount: R${amount.toFixed(2)}\nProvider: ${provider?.name || 'All Providers'}`);
      setShowCommissionDialog(false);
      setSelectedProvider('');
    }, 2000);
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert(`${label} copied to clipboard!`);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert(`${label} copied to clipboard!`);
    }
  };

  const handleExportReport = () => {
    const reportData = {
      totalRevenue: 'R12,450.75',
      commissionDue: 'R465.50',
      overduePayments: 'R770.00',
      generatedDate: new Date().toLocaleString()
    };
    
    const csvContent = `Payment Report Generated: ${reportData.generatedDate}\n\nTotal Revenue,${reportData.totalRevenue}\nCommission Due,${reportData.commissionDue}\nOverdue Payments,${reportData.overduePayments}`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payment-report-${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    alert('Payment report exported successfully!');
  };

  const handleSendReminder = () => {
    alert('Payment reminders sent to 3 clients with overdue payments!\n\n• John Doe - R450.00\n• Jane Smith - R320.00\n• Mike Johnson - R150.00');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => onNavigate('admin-overview')}>
          ← Back
        </Button>
        <WayaWayaLogo size="sm" />
        <h1>Payment Management</h1>
      </div>

      {showSuccess && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Payment processed successfully!
          </AlertDescription>
        </Alert>
      )}

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
              <p><strong>Account Number:</strong> 1234567890</p>
              <p><strong>Branch Code:</strong> 470010</p>
              <p><strong>Account Type:</strong> Savings</p>
            </div>
            <div className="flex gap-2 mt-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => copyToClipboard('1234567890', 'Account Number')}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Account Number
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => copyToClipboard('470010', 'Branch Code')}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Branch Code
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">Payment Processing</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                className="h-16 flex-col"
                onClick={() => setShowEFTDialog(true)}
                disabled={processingPayment}
              >
                <CreditCard className="h-6 w-6 mb-2" />
                Process EFT Payment
              </Button>
              <Button 
                variant="outline" 
                className="h-16 flex-col"
                onClick={() => setShowInvoiceDialog(true)}
              >
                <Receipt className="h-6 w-6 mb-2" />
                Generate Invoice
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                className="h-12"
                onClick={() => handleCollectCommission()}
                disabled={processingPayment}
              >
                <DollarSign className="h-4 w-4 mr-2" />
                {processingPayment ? 'Processing...' : 'Collect All Commissions'}
              </Button>
              <Button 
                variant="outline" 
                className="h-12"
                onClick={() => setShowCommissionDialog(true)}
              >
                <Calculator className="h-4 w-4 mr-2" />
                Individual Collection
              </Button>
              <Button 
                variant="outline" 
                className="h-12"
                onClick={handleExportReport}
              >
                <FileText className="h-4 w-4 mr-2" />
                Commission Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Management Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              className="h-12"
              onClick={handleSendReminder}
            >
              <Send className="h-4 w-4 mr-2" />
              Send Payment Reminders
            </Button>
            <Button 
              variant="outline" 
              className="h-12"
              onClick={handleExportReport}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Payment Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* EFT Payment Dialog */}
      <Dialog open={showEFTDialog} onOpenChange={setShowEFTDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Process EFT Payment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Payment Amount (ZAR)</label>
              <Input
                type="number"
                placeholder="150.00"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Payment Reference</label>
              <Input
                placeholder="Provider Application Fee - Ahmed Hassan"
                value={paymentReference}
                onChange={(e) => setPaymentReference(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleEFTPayment} 
                disabled={processingPayment}
                className="flex-1"
              >
                {processingPayment ? 'Processing...' : 'Process Payment'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowEFTDialog(false)}
                disabled={processingPayment}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Invoice Dialog */}
      <Dialog open={showInvoiceDialog} onOpenChange={setShowInvoiceDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Invoice</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Invoice Amount (ZAR)</label>
              <Input
                type="number"
                placeholder="150.00"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Input
                placeholder="Provider Application Fee"
                defaultValue="WAYA WAYA Provider Application Fee"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleGenerateInvoice} className="flex-1">
                <Receipt className="h-4 w-4 mr-2" />
                Generate Invoice
              </Button>
              <Button variant="outline" onClick={() => setShowInvoiceDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Commission Collection Dialog */}
      <Dialog open={showCommissionDialog} onOpenChange={setShowCommissionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Individual Commission Collection</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Select Provider</label>
              <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a provider" />
                </SelectTrigger>
                <SelectContent>
                  {mockProviders.map((provider) => (
                    <SelectItem key={provider.id} value={provider.id}>
                      {provider.name} - R{provider.commissionDue.toFixed(2)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedProvider && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm">
                  Commission to collect: <strong>R{mockProviders.find(p => p.id === selectedProvider)?.commissionDue.toFixed(2)}</strong>
                </p>
              </div>
            )}
            <div className="flex gap-2">
              <Button 
                onClick={() => handleCollectCommission(selectedProvider)} 
                disabled={!selectedProvider || processingPayment}
                className="flex-1"
              >
                {processingPayment ? 'Processing...' : 'Collect Commission'}
              </Button>
              <Button variant="outline" onClick={() => setShowCommissionDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};