import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Users, 
  UserPlus, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  X, 
  Edit3, 
  Trash2, 
  Eye, 
  Search,
  Filter,
  Download,
  Calendar,
  Star,
  MapPin,
  Phone,
  Mail,
  Settings,
  Shield,
  Ban,
  Unlock,
  Clock,
  CreditCard,
  FileText,
  Database,
  BarChart3,
  Activity,
  Zap,
  MessageCircle,
  Bell,
  RefreshCw
} from 'lucide-react';

// Safe number formatting function
const safeFormatNumber = (value: any, options: any = {}) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0';
  }
  
  try {
    return Number(value).toLocaleString('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2,
      ...options
    });
  } catch (error) {
    return `R${Number(value).toFixed(2)}`;
  }
};

// Safe date formatting function
const safeFormatDate = (date: any) => {
  if (!date) return 'N/A';
  
  try {
    const dateObject = typeof date === 'string' ? new Date(date) : date;
    return dateObject.toLocaleDateString('en-ZA');
  } catch (error) {
    return 'Invalid Date';
  }
};

// WAYA WAYA Logo Component
const WayaWayaLogo = ({ size = 'sm', showText = true }) => {
  const logoSizes: Record<string, string> = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizes: Record<string, string> = {
    xs: 'text-sm',
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl'
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`${logoSizes[size]} bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center`}>
        <span className={`text-white font-bold ${size === 'xs' ? 'text-xs' : size === 'sm' ? 'text-sm' : 'text-lg'}`}>W</span>
      </div>
      {showText && (
        <span className={`font-bold ${textSizes[size]} text-primary`}>WAYA WAYA!</span>
      )}
    </div>
  );
};

const AdminInterface = ({ onNavigate, apiClient, authToken }: { onNavigate: any, apiClient: any, authToken: any }) => {
  const [currentTab, setCurrentTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProviders: 0,
    totalBookings: 0,
    totalRevenue: 0,
    activeUsers: 0,
    pendingProviders: 0,
    monthlyRevenue: 0,
    commissionCollected: 0
  });

  const [providers, setProviders] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Mock data for demonstration
  const mockProviders = [
    {
      id: 1,
      name: 'Ahmed Hassan',
      service: 'Electrician',
      email: 'ahmed@example.com',
      phone: '+27 82 123 4567',
      rating: 4.9,
      reviews: 127,
      joinDate: '2024-01-15',
      status: 'approved',
      earnings: 15420.50,
      commission: 771.03,
      trialDaysLeft: 0
    },
    {
      id: 2,
      name: 'Maria Santos',
      service: 'House Cleaning',
      email: 'maria@example.com',
      phone: '+27 83 456 7890',
      rating: 4.8,
      reviews: 89,
      joinDate: '2024-01-20',
      status: 'pending',
      earnings: 8950.25,
      commission: 447.51,
      trialDaysLeft: 5
    },
    {
      id: 3,
      name: 'James Wilson',
      service: 'Plumber',
      email: 'james@example.com',
      phone: '+27 84 789 0123',
      rating: 4.7,
      reviews: 156,
      joinDate: '2024-01-10',
      status: 'approved',
      earnings: 22350.75,
      commission: 1117.54,
      trialDaysLeft: 0
    }
  ];

  const mockClients = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+27 71 234 5678',
      joinDate: '2024-02-01',
      totalSpent: 2450.00,
      bookings: 12,
      status: 'active',
      lastActive: '2024-02-20'
    },
    {
      id: 2,
      name: 'Michael Brown',
      email: 'michael@example.com',
      phone: '+27 72 345 6789',
      joinDate: '2024-01-28',
      totalSpent: 1800.50,
      bookings: 8,
      status: 'blocked',
      lastActive: '2024-02-15',
      blockReason: 'Non-payment'
    }
  ];

  // Load admin stats
  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      setError('');
      
      try {
        if (apiClient && apiClient.admin && apiClient.admin.getStats) {
          const response = await apiClient.admin.getStats(authToken);
          if (response.ok) {
            const data = await response.json();
            setStats({
              totalUsers: data.totalUsers || 1247,
              totalProviders: data.totalProviders || 156,
              totalBookings: data.totalBookings || 892,
              totalRevenue: data.totalRevenue || 45670.25,
              activeUsers: data.activeUsers || 1189,
              pendingProviders: data.pendingProviders || 12,
              monthlyRevenue: data.monthlyRevenue || 12450.75,
              commissionCollected: data.commissionCollected || 2283.51
            });
          }
        } else {
          // Fallback to mock data
          setStats({
            totalUsers: 1247,
            totalProviders: 156,
            totalBookings: 892,
            totalRevenue: 45670.25,
            activeUsers: 1189,
            pendingProviders: 12,
            monthlyRevenue: 12450.75,
            commissionCollected: 2283.51
          });
        }
        
        setProviders(mockProviders);
        setClients(mockClients);
      } catch (err) {
        setError('Failed to load admin data');
        // Use mock data as fallback
        setStats({
          totalUsers: 1247,
          totalProviders: 156,
          totalBookings: 892,
          totalRevenue: 45670.25,
          activeUsers: 1189,
          pendingProviders: 12,
          monthlyRevenue: 12450.75,
          commissionCollected: 2283.51
        });
        setProviders(mockProviders);
        setClients(mockClients);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [apiClient, authToken]);

  const handleProviderAction = async (providerId: any, action: any) => {
    setActionLoading(true);
    try {
      if (apiClient && apiClient.admin) {
        if (action === 'approve' && apiClient.admin.approveProvider) {
          await apiClient.admin.approveProvider(providerId, authToken);
        } else if (action === 'reject' && apiClient.admin.rejectProvider) {
          await apiClient.admin.rejectProvider(providerId, authToken);
        }
      }
      
      // Update local state
      setProviders(prev => prev.map(provider => 
        provider.id === providerId 
          ? { ...provider, status: action === 'approve' ? 'approved' : 'rejected' }
          : provider
      ));
    } catch (err) {
      setError(`Failed to ${action} provider`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleClientBlock = async (clientId: any, reason: any) => {
    setActionLoading(true);
    try {
      if (apiClient && apiClient.admin && apiClient.admin.blockClient) {
        await apiClient.admin.blockClient(clientId, reason, authToken);
      }
      
      // Update local state
      setClients(prev => prev.map(client => 
        client.id === clientId 
          ? { ...client, status: 'blocked', blockReason: reason }
          : client
      ));
    } catch (err) {
      setError('Failed to block client');
    } finally {
      setActionLoading(false);
    }
  };

  const handleClientUnblock = async (clientId: any) => {
    setActionLoading(true);
    try {
      if (apiClient && apiClient.admin && apiClient.admin.unblockClient) {
        await apiClient.admin.unblockClient(clientId, authToken);
      }
      
      // Update local state
      setClients(prev => prev.map(client => 
        client.id === clientId 
          ? { ...client, status: 'active', blockReason: undefined }
          : client
      ));
    } catch (err) {
      setError('Failed to unblock client');
    } finally {
      setActionLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color = "text-blue-600", change }: { title: any, value: any, icon: any, color?: string, change?: any }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {typeof value === 'number' && title.toLowerCase().includes('revenue') ? 
            safeFormatNumber(value) : 
            (value || 0).toLocaleString()
          }
        </div>
        {change && (
          <p className="text-xs text-muted-foreground">
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  );

  const OverviewTab = () => (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          color="text-blue-600"
          change="+12% from last month"
        />
        <StatCard
          title="Active Providers"
          value={stats.totalProviders}
          icon={Shield}
          color="text-green-600"
          change="+5% from last month"
        />
        <StatCard
          title="Total Bookings"
          value={stats.totalBookings}
          icon={Calendar}
          color="text-purple-600"
          change="+18% from last month"
        />
        <StatCard
          title="Total Revenue"
          value={stats.totalRevenue}
          icon={DollarSign}
          color="text-orange-600"
          change="+23% from last month"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New provider registration</p>
                  <p className="text-xs text-muted-foreground">Maria Santos - House Cleaning</p>
                </div>
                <span className="text-xs text-muted-foreground">2 min ago</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Service completed</p>
                  <p className="text-xs text-muted-foreground">Electrical repair - R450.00</p>
                </div>
                <span className="text-xs text-muted-foreground">15 min ago</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Payment received</p>
                  <p className="text-xs text-muted-foreground">Commission: R22.50</p>
                </div>
                <span className="text-xs text-muted-foreground">1 hour ago</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">API Status</span>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Online
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Database</span>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Healthy
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Payment Gateway</span>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Connected
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">SMS Service</span>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                  Limited
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const ProvidersTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Provider Management</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Pending Approvals"
          value={providers.filter(p => p.status === 'pending').length}
          icon={Clock}
          color="text-yellow-600"
          change="+5 this week"
        />
        <StatCard
          title="Active Providers"
          value={providers.filter(p => p.status === 'approved').length}
          icon={CheckCircle}
          color="text-green-600"
          change="+12% from last month"
        />
        <StatCard
          title="Total Commissions"
          value={providers.reduce((sum, p) => sum + (p.commission || 0), 0)}
          icon={DollarSign}
          color="text-blue-600"
          change="+18% from last month"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Providers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {providers.map((provider) => (
              <div key={provider.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarFallback>
                      {provider.name.split(' ').map((n: any) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{provider.name}</p>
                    <p className="text-sm text-muted-foreground">{provider.service}</p>
                    <p className="text-xs text-muted-foreground">{provider.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {safeFormatNumber(provider.earnings)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Commission: {safeFormatNumber(provider.commission)}
                    </p>
                  </div>
                  <Badge variant={
                    provider.status === 'approved' ? 'default' :
                    provider.status === 'pending' ? 'secondary' : 'destructive'
                  }>
                    {provider.status}
                  </Badge>
                  {provider.status === 'pending' && (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleProviderAction(provider.id, 'approve')}
                        disabled={actionLoading}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleProviderAction(provider.id, 'reject')}
                        disabled={actionLoading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const ClientsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Client Management</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Active Clients"
          value={clients.filter(c => c.status === 'active').length}
          icon={Users}
          color="text-green-600"
          change="+8% from last month"
        />
        <StatCard
          title="Blocked Clients"
          value={clients.filter(c => c.status === 'blocked').length}
          icon={Ban}
          color="text-red-600"
          change="-2 this week"
        />
        <StatCard
          title="Total Spent"
          value={clients.reduce((sum, c) => sum + (c.totalSpent || 0), 0)}
          icon={DollarSign}
          color="text-blue-600"
          change="+15% from last month"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {clients.map((client) => (
              <div key={client.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarFallback>
                      {client.name.split(' ').map((n: any) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{client.name}</p>
                    <p className="text-sm text-muted-foreground">{client.email}</p>
                    <p className="text-xs text-muted-foreground">
                      Joined: {safeFormatDate(client.joinDate)}
                    </p>
                    {client.blockReason && (
                      <p className="text-xs text-red-600">Reason: {client.blockReason}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {safeFormatNumber(client.totalSpent)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {client.bookings} bookings
                    </p>
                  </div>
                  <Badge variant={client.status === 'active' ? 'default' : 'destructive'}>
                    {client.status}
                  </Badge>
                  {client.status === 'blocked' ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleClientUnblock(client.id)}
                      disabled={actionLoading}
                    >
                      <Unlock className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleClientBlock(client.id, 'Admin action')}
                      disabled={actionLoading}
                    >
                      <Ban className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto p-4">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => onNavigate('admin-overview')}>
              ← Back
            </Button>
            <WayaWayaLogo size="sm" />
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Manage users, providers, and platform operations
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 bg-red-50 border-red-200">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="providers">Providers</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <OverviewTab />
          </TabsContent>

          <TabsContent value="providers" className="mt-6">
            <ProvidersTab />
          </TabsContent>

          <TabsContent value="clients" className="mt-6">
            <ClientsTab />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Platform configuration settings would be here.
                  </p>
                  <Button variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminInterface;