import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Alert, AlertDescription } from '../ui/alert';
import { Users, Ban, AlertTriangle, FileText, Unlock, Send, Download, Search, Filter, CheckCircle, X } from 'lucide-react';
import { WayaWayaLogo } from '../shared/WayaWayaLogo';

interface ClientManagementProps {
  onNavigate: (view: string) => void;
}

export const ClientManagement: React.FC<ClientManagementProps> = ({ onNavigate }) => {
  const [clients, setClients] = useState([
    { 
      id: 1, 
      name: 'John Doe', 
      email: 'john@example.com', 
      reason: 'Non-payment of R450.00', 
      blockedDate: '2024-01-15', 
      amountDue: 450.00,
      status: 'blocked',
      phone: '+27 71 234 5678',
      joinDate: '2023-12-01',
      totalSpent: 1250.00,
      bookings: 8
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      email: 'jane@example.com', 
      reason: 'Multiple payment failures', 
      blockedDate: '2024-01-10', 
      amountDue: 320.00,
      status: 'blocked',
      phone: '+27 72 345 6789',
      joinDate: '2023-11-15',
      totalSpent: 875.50,
      bookings: 5
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike@example.com',
      reason: '',
      blockedDate: '',
      amountDue: 0,
      status: 'active',
      phone: '+27 73 456 7890',
      joinDate: '2024-01-01',
      totalSpent: 2100.00,
      bookings: 12
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      reason: '',
      blockedDate: '',
      amountDue: 0,
      status: 'active',
      phone: '+27 74 567 8901',
      joinDate: '2023-10-20',
      totalSpent: 3250.75,
      bookings: 18
    }
  ]);

  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [showReminderDialog, setShowReminderDialog] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [blockReason, setBlockReason] = useState('');
  const [reminderMessage, setReminderMessage] = useState('Dear client, this is a friendly reminder that your payment is overdue. Please settle your account to continue using our services.');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [processingAction, setProcessingAction] = useState(false);
  const [showSuccess, setShowSuccess] = useState('');

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeClients = clients.filter(c => c.status === 'active').length;
  const blockedClients = clients.filter(c => c.status === 'blocked').length;
  const totalDue = clients.filter(c => c.status === 'blocked').reduce((sum, c) => sum + c.amountDue, 0);

  const handleBlockClient = (client: any) => {
    setSelectedClient(client);
    setBlockReason('');
    setShowBlockDialog(true);
  };

  const confirmBlockClient = async () => {
    if (!blockReason.trim()) {
      alert('Please provide a reason for blocking this client');
      return;
    }

    setProcessingAction(true);
    
    // Simulate API call
    setTimeout(() => {
      setClients(prev => prev.map(client => 
        client.id === selectedClient?.id 
          ? { 
              ...client, 
              status: 'blocked', 
              reason: blockReason,
              blockedDate: new Date().toISOString().split('T')[0]
            }
          : client
      ));
      
      setProcessingAction(false);
      setShowBlockDialog(false);
      setShowSuccess(`Client ${selectedClient?.name} has been blocked successfully`);
      setTimeout(() => setShowSuccess(''), 3000);
    }, 1500);
  };

  const handleUnblockClient = async (client: any) => {
    setProcessingAction(true);
    
    // Simulate API call
    setTimeout(() => {
      setClients(prev => prev.map(c => 
        c.id === client.id 
          ? { ...c, status: 'active', reason: '', blockedDate: '', amountDue: 0 }
          : c
      ));
      
      setProcessingAction(false);
      setShowSuccess(`Client ${client.name} has been unblocked successfully`);
      setTimeout(() => setShowSuccess(''), 3000);
    }, 1500);
  };

  const handleSendReminders = () => {
    const overdueClients = clients.filter(c => c.status === 'blocked');
    if (overdueClients.length === 0) {
      alert('No clients with overdue payments found');
      return;
    }
    setShowReminderDialog(true);
  };

  const confirmSendReminders = async () => {
    setProcessingAction(true);
    
    // Simulate API call
    setTimeout(() => {
      const overdueClients = clients.filter(c => c.status === 'blocked');
      setProcessingAction(false);
      setShowReminderDialog(false);
      setShowSuccess(`Payment reminders sent to ${overdueClients.length} clients`);
      setTimeout(() => setShowSuccess(''), 3000);
    }, 2000);
  };

  const handleExportReport = () => {
    const reportData = clients.map(client => ({
      Name: client.name,
      Email: client.email,
      Status: client.status,
      'Total Spent': `R${client.totalSpent.toFixed(2)}`,
      'Amount Due': `R${client.amountDue.toFixed(2)}`,
      Bookings: client.bookings,
      'Join Date': client.joinDate,
      'Block Reason': client.reason || 'N/A'
    }));

    const csvContent = [
      Object.keys(reportData[0]).join(','),
      ...reportData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `client-report-${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    setShowSuccess('Client report exported successfully!');
    setTimeout(() => setShowSuccess(''), 3000);
  };

  const handleSendIndividualReminder = async (client: any) => {
    setProcessingAction(true);
    
    // Simulate API call
    setTimeout(() => {
      setProcessingAction(false);
      setShowSuccess(`Payment reminder sent to ${client.name}`);
      setTimeout(() => setShowSuccess(''), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => onNavigate('admin-overview')}>
          ← Back
        </Button>
        <WayaWayaLogo size="sm" />
        <h1>Client Management</h1>
      </div>

      {showSuccess && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            {showSuccess}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Active Clients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeClients}</div>
            <p className="text-sm text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ban className="h-5 w-5 text-red-600" />
              Blocked Clients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{blockedClients}</div>
            <p className="text-sm text-muted-foreground">Due to issues</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Total Amount Due
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R{totalDue.toFixed(2)}</div>
            <p className="text-sm text-muted-foreground">Outstanding payments</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search clients by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Client Blocking System</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 text-red-800">Automatic Blocking Rules</h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Payment overdue by 7 days: Warning sent</li>
                <li>• Payment overdue by 14 days: Account suspended</li>
                <li>• Payment overdue by 30 days: Account blocked</li>
                <li>• 3 failed payment attempts: Account review</li>
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                className="h-12"
                onClick={handleSendReminders}
                disabled={processingAction}
              >
                <Send className="h-4 w-4 mr-2" />
                {processingAction ? 'Sending...' : 'Send Payment Reminders'}
              </Button>
              <Button 
                variant="outline" 
                className="h-12"
                onClick={handleExportReport}
              >
                <Download className="h-4 w-4 mr-2" />
                Export Client Report
              </Button>
              <Button 
                variant="outline" 
                className="h-12"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }}
              >
                <X className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Clients ({filteredClients.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredClients.map((client) => (
              <div key={client.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{client.name}</p>
                      <p className="text-sm text-muted-foreground">{client.email}</p>
                      <p className="text-xs text-muted-foreground">{client.phone}</p>
                    </div>
                  </div>
                  <div className="mt-2 text-sm">
                    <div className="flex gap-4">
                      <span>Joined: {client.joinDate}</span>
                      <span>Total Spent: R{client.totalSpent.toFixed(2)}</span>
                      <span>Bookings: {client.bookings}</span>
                    </div>
                    {client.status === 'blocked' && (
                      <div className="mt-1">
                        <p className="text-red-600">Reason: {client.reason}</p>
                        <p className="text-muted-foreground">Blocked: {client.blockedDate}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <Badge variant={client.status === 'active' ? 'default' : 'destructive'}>
                      {client.status}
                    </Badge>
                    {client.amountDue > 0 && (
                      <p className="text-sm font-semibold text-red-600 mt-1">
                        Due: R{client.amountDue.toFixed(2)}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {client.status === 'blocked' ? (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleUnblockClient(client)}
                          disabled={processingAction}
                        >
                          <Unlock className="h-4 w-4 mr-1" />
                          Unblock
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleSendIndividualReminder(client)}
                          disabled={processingAction}
                        >
                          <Send className="h-4 w-4 mr-1" />
                          Remind
                        </Button>
                      </>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleBlockClient(client)}
                        disabled={processingAction}
                      >
                        <Ban className="h-4 w-4 mr-1" />
                        Block
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Block Client Dialog */}
      <Dialog open={showBlockDialog} onOpenChange={setShowBlockDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Block Client: {selectedClient?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Reason for blocking</label>
              <Textarea
                placeholder="Enter the reason for blocking this client..."
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                rows={3}
              />
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ This action will prevent the client from making new bookings until unblocked.
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={confirmBlockClient} 
                disabled={processingAction || !blockReason.trim()}
                className="flex-1"
                variant="destructive"
              >
                {processingAction ? 'Blocking...' : 'Block Client'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowBlockDialog(false)}
                disabled={processingAction}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Send Reminders Dialog */}
      <Dialog open={showReminderDialog} onOpenChange={setShowReminderDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Payment Reminders</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Sending reminders to {clients.filter(c => c.status === 'blocked').length} clients with overdue payments
              </p>
              <label className="block text-sm font-medium mb-1">Message</label>
              <Textarea
                value={reminderMessage}
                onChange={(e) => setReminderMessage(e.target.value)}
                rows={4}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={confirmSendReminders} 
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