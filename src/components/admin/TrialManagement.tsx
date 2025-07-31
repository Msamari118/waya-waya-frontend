import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Alert, AlertDescription } from '../ui/alert';
import { Calendar, Clock, CheckCircle, CreditCard, Receipt, Download, Mail, Bell, AlertTriangle, DollarSign, FileText, Settings, User } from 'lucide-react';
import { WayaWayaLogo } from '../shared/WayaWayaLogo';

interface TrialManagementProps {
  onNavigate: (view: string) => void;
}

export const TrialManagement: React.FC<TrialManagementProps> = ({ onNavigate }) => {
  const [providers, setProviders] = useState([
    {
      id: 1,
      name: 'Ahmed Hassan',
      service: 'Electrician',
      email: 'ahmed@example.com',
      phone: '+27 82 123 4567',
      trialDaysLeft: 3,
      commissionDue: 145.50,
      earnings: 2910.00,
      joinDate: '2024-01-15',
      status: 'trial',
      applicationFeePaid: true,
      trialStartDate: '2024-01-15'
    },
    {
      id: 2,
      name: 'Maria Santos',
      service: 'House Cleaning',
      email: 'maria@example.com',
      phone: '+27 83 456 7890',
      trialDaysLeft: 0,
      commissionDue: 89.25,
      earnings: 1785.00,
      joinDate: '2024-01-08',
      status: 'trial_expired',
      applicationFeePaid: true,
      trialStartDate: '2024-01-08'
    },
    {
      id: 3,
      name: 'James Wilson',
      service: 'Plumber',
      email: 'james@example.com',
      phone: '+27 84 789 0123',
      trialDaysLeft: 7,
      commissionDue: 230.75,
      earnings: 4615.00,
      joinDate: '2024-01-22',
      status: 'trial',
      applicationFeePaid: false,
      trialStartDate: '2024-01-22'
    }
  ]);

  const [showFeeDialog, setShowFeeDialog] = useState(false);
  const [showExtendDialog, setShowExtendDialog] = useState(false);
  const [showReminderDialog, setShowReminderDialog] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [processingAction, setProcessingAction] = useState(false);
  const [showSuccess, setShowSuccess] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('150');
  const [extensionDays, setExtensionDays] = useState('7');

  const activeTrials = providers.filter(p => p.status === 'trial').length;
  const expiredTrials = providers.filter(p => p.status === 'trial_expired').length;
  const totalCommissionDue = providers.reduce((sum, p) => sum + p.commissionDue, 0);
  const unpaidFees = providers.filter(p => !p.applicationFeePaid).length;

  const handleProcessFee = async () => {
    if (!selectedProvider || !paymentAmount) {
      alert('Please select a provider and enter payment amount');
      return;
    }

    setProcessingAction(true);
    
    // Simulate API call
    setTimeout(() => {
      setProviders(prev => prev.map(provider => 
        provider.id === selectedProvider.id 
          ? { ...provider, applicationFeePaid: true }
          : provider
      ));
      
      setProcessingAction(false);
      setShowFeeDialog(false);
      setShowSuccess(`Application fee of R${paymentAmount} processed for ${selectedProvider.name}`);
      setTimeout(() => setShowSuccess(''), 3000);
    }, 2000);
  };

  const handleExtendTrial = async () => {
    if (!selectedProvider || !extensionDays) {
      alert('Please select a provider and enter extension days');
      return;
    }

    setProcessingAction(true);
    
    // Simulate API call
    setTimeout(() => {
      setProviders(prev => prev.map(provider => 
        provider.id === selectedProvider.id 
          ? { 
              ...provider, 
              trialDaysLeft: provider.trialDaysLeft + parseInt(extensionDays),
              status: 'trial'
            }
          : provider
      ));
      
      setProcessingAction(false);
      setShowExtendDialog(false);
      setShowSuccess(`Trial extended by ${extensionDays} days for ${selectedProvider.name}`);
      setTimeout(() => setShowSuccess(''), 3000);
    }, 1500);
  };

  const handleSendTrialReminder = async (provider: any) => {
    setProcessingAction(true);
    
    // Simulate API call
    setTimeout(() => {
      setProcessingAction(false);
      setShowSuccess(`Trial reminder sent to ${provider.name}`);
      setTimeout(() => setShowSuccess(''), 3000);
    }, 1000);
  };

  const handleSendBulkReminders = async () => {
    const expiring = providers.filter(p => p.trialDaysLeft <= 3 && p.trialDaysLeft > 0);
    const expired = providers.filter(p => p.status === 'trial_expired');
    
    setProcessingAction(true);
    
    // Simulate API call
    setTimeout(() => {
      setProcessingAction(false);
      setShowReminderDialog(false);
      setShowSuccess(`Reminders sent to ${expiring.length + expired.length} providers`);
      setTimeout(() => setShowSuccess(''), 3000);
    }, 2000);
  };

  const handleConvertToFull = async (provider: any) => {
    setProcessingAction(true);
    
    // Simulate API call
    setTimeout(() => {
      setProviders(prev => prev.map(p => 
        p.id === provider.id 
          ? { ...p, status: 'active', trialDaysLeft: 0 }
          : p
      ));
      
      setProcessingAction(false);
      setShowSuccess(`${provider.name} converted to full membership`);
      setTimeout(() => setShowSuccess(''), 3000);
    }, 1500);
  };

  const handleDeactivateProvider = async (provider: any) => {
    if (!confirm(`Are you sure you want to deactivate ${provider.name}?`)) {
      return;
    }

    setProcessingAction(true);
    
    // Simulate API call
    setTimeout(() => {
      setProviders(prev => prev.map(p => 
        p.id === provider.id 
          ? { ...p, status: 'deactivated' }
          : p
      ));
      
      setProcessingAction(false);
      setShowSuccess(`${provider.name} has been deactivated`);
      setTimeout(() => setShowSuccess(''), 3000);
    }, 1500);
  };

  const handleExportReport = () => {
    const reportData = providers.map(provider => ({
      Name: provider.name,
      Service: provider.service,
      Email: provider.email,
      'Trial Days Left': provider.trialDaysLeft,
      'Commission Due': `R${provider.commissionDue.toFixed(2)}`,
      'Total Earnings': `R${provider.earnings.toFixed(2)}`,
      'Join Date': provider.joinDate,
      Status: provider.status,
      'Application Fee Paid': provider.applicationFeePaid ? 'Yes' : 'No'
    }));

    const csvContent = [
      Object.keys(reportData[0]).join(','),
      ...reportData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trial-management-report-${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    setShowSuccess('Trial management report exported successfully!');
    setTimeout(() => setShowSuccess(''), 3000);
  };

  const openFeeDialog = (provider: any) => {
    setSelectedProvider(provider);
    setPaymentAmount(provider.phone.startsWith('+27') ? '150' : '300');
    setShowFeeDialog(true);
  };

  const openExtendDialog = (provider: any) => {
    setSelectedProvider(provider);
    setExtensionDays('7');
    setShowExtendDialog(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => onNavigate('admin-overview')}>
          ← Back
        </Button>
        <WayaWayaLogo size="sm" />
        <h1>Provider Trial Management</h1>
      </div>

      {showSuccess && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            {showSuccess}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-600" />
              Active Trials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeTrials}</div>
            <p className="text-sm text-muted-foreground">Currently in trial</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Expired Trials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expiredTrials}</div>
            <p className="text-sm text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              Commission Due
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R{totalCommissionDue.toFixed(2)}</div>
            <p className="text-sm text-muted-foreground">From trials</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-orange-600" />
              Unpaid Fees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unpaidFees}</div>
            <p className="text-sm text-muted-foreground">Application fees</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-green-600" />
            7-Day Free Trial Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-green-50 p-4 rounded-lg mb-4">
            <h4 className="font-semibold mb-2 text-green-800">Trial Benefits</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Full access to all platform features</li>
              <li>• Unlimited service requests</li>
              <li>• No commission fees during trial</li>
              <li>• Priority customer support</li>
              <li>• Cancel anytime without charge</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Button 
              className="h-12"
              onClick={() => setShowReminderDialog(true)}
              disabled={processingAction}
            >
              <Bell className="h-4 w-4 mr-2" />
              Send Bulk Reminders
            </Button>
            <Button 
              variant="outline" 
              className="h-12"
              onClick={handleExportReport}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button 
              variant="outline" 
              className="h-12"
              onClick={() => alert('Trial settings configuration will open here')}
            >
              <Settings className="h-4 w-4 mr-2" />
              Trial Settings
            </Button>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">Provider Trials ({providers.length})</h4>
            {providers.map((provider) => (
              <div key={provider.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>{provider.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{provider.name}</p>
                    <p className="text-sm text-muted-foreground">{provider.service}</p>
                    <p className="text-xs text-muted-foreground">{provider.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className={`text-sm font-medium ${
                      provider.status === 'trial_expired' ? 'text-red-600' :
                      provider.trialDaysLeft <= 3 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {provider.status === 'trial_expired' ? 'Trial expired' : 
                       provider.trialDaysLeft === 0 ? 'Expires today' :
                       `${provider.trialDaysLeft} days left`}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Commission: R{provider.commissionDue.toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Earnings: R{provider.earnings.toFixed(2)}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Badge variant={
                      provider.status === 'trial' ? 'default' :
                      provider.status === 'trial_expired' ? 'destructive' : 'secondary'
                    }>
                      {provider.status === 'trial' ? 'Active Trial' :
                       provider.status === 'trial_expired' ? 'Expired' : provider.status}
                    </Badge>
                    {!provider.applicationFeePaid && (
                      <Badge variant="outline" className="text-orange-600">
                        Fee Unpaid
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {provider.status === 'trial_expired' ? (
                      <>
                        <Button 
                          size="sm"
                          onClick={() => handleConvertToFull(provider)}
                          disabled={processingAction}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Convert
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openExtendDialog(provider)}
                          disabled={processingAction}
                        >
                          <Clock className="h-4 w-4 mr-1" />
                          Extend
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleSendTrialReminder(provider)}
                          disabled={processingAction}
                        >
                          <Mail className="h-4 w-4 mr-1" />
                          Remind
                        </Button>
                        {!provider.applicationFeePaid && (
                          <Button 
                            size="sm"
                            onClick={() => openFeeDialog(provider)}
                            disabled={processingAction}
                          >
                            <CreditCard className="h-4 w-4 mr-1" />
                            Process Fee
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Application Fee Structure</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 text-blue-800">South African Providers</h4>
              <div className="text-2xl font-bold text-blue-600">R150.00</div>
              <p className="text-sm text-blue-700">One-time application fee</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 text-gray-800">International Providers</h4>
              <div className="text-2xl font-bold text-gray-600">R300.00</div>
              <p className="text-sm text-gray-700">One-time application fee</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <h4 className="font-semibold">Quick Actions</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                className="h-16 flex-col"
                onClick={() => {
                  const unpaid = providers.filter(p => !p.applicationFeePaid);
                  if (unpaid.length > 0) {
                    openFeeDialog(unpaid[0]);
                  } else {
                    alert('All providers have paid their application fees');
                  }
                }}
              >
                <CreditCard className="h-6 w-6 mb-2" />
                Process Application Fee
              </Button>
              <Button 
                variant="outline" 
                className="h-16 flex-col"
                onClick={() => alert('Manual payment processing form will open here')}
              >
                <Receipt className="h-6 w-6 mb-2" />
                Manual Payment Entry
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Application Fee Dialog */}
      <Dialog open={showFeeDialog} onOpenChange={setShowFeeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Process Application Fee: {selectedProvider?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Payment Amount (ZAR)</label>
              <Input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {selectedProvider?.phone.startsWith('+27') ? 'South African rate: R150' : 'International rate: R300'}
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                Processing application fee for {selectedProvider?.service} provider
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleProcessFee} 
                disabled={processingAction}
                className="flex-1"
              >
                {processingAction ? 'Processing...' : 'Process Fee'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowFeeDialog(false)}
                disabled={processingAction}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Extend Trial Dialog */}
      <Dialog open={showExtendDialog} onOpenChange={setShowExtendDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Extend Trial: {selectedProvider?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Extension Days</label>
              <Input
                type="number"
                value={extensionDays}
                onChange={(e) => setExtensionDays(e.target.value)}
                min="1"
                max="30"
              />
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <p className="text-sm text-yellow-800">
                Current trial days left: {selectedProvider?.trialDaysLeft}
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleExtendTrial} 
                disabled={processingAction}
                className="flex-1"
              >
                {processingAction ? 'Extending...' : 'Extend Trial'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowExtendDialog(false)}
                disabled={processingAction}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Reminder Dialog */}
      <Dialog open={showReminderDialog} onOpenChange={setShowReminderDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Bulk Trial Reminders</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm">Reminders will be sent to:</p>
              <ul className="text-sm text-muted-foreground">
                <li>• {providers.filter(p => p.trialDaysLeft <= 3 && p.trialDaysLeft > 0).length} providers with trials expiring soon</li>
                <li>• {providers.filter(p => p.status === 'trial_expired').length} providers with expired trials</li>
              </ul>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleSendBulkReminders} 
                disabled={processingAction}
                className="flex-1"
              >
                {processingAction ? 'Sending...' : 'Send Reminders'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowReminderDialog(false)}
                disabled={processingAction}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};