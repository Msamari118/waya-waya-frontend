// src/components/admin/EnhancedAdminDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  Users, 
  UserCheck, 
  CreditCard, 
  MessageSquare, 
  TrendingUp, 
  Activity,
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Eye,
  Settings,
  BarChart3,
  PieChart,
  Calendar,
  Star,
  Briefcase
} from 'lucide-react';
import { WayaWayaLogo } from '../shared/WayaWayaLogo';

interface AdminStats {
  totalUsers: number;
  totalClients: number;
  totalProviders: number;
  activeBookings: number;
  completedBookings: number;
  totalRevenue: number;
  pendingPayments: number;
  activeChatSessions: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
  recentActivity: ActivityItem[];
}

interface ActivityItem {
  id: string;
  type: 'booking' | 'payment' | 'registration' | 'chat' | 'review';
  description: string;
  timestamp: string;
  status: 'success' | 'pending' | 'failed';
  userId?: string;
  userName?: string;
}

interface ClientOverview {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  joinDate: string;
  totalBookings: number;
  totalSpent: number;
  status: 'active' | 'inactive' | 'blocked';
  lastActivity: string;
  favoriteServices: string[];
}

interface ProviderOverview {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  services: string[];
  rating: number;
  totalEarnings: number;
  completedJobs: number;
  status: 'active' | 'pending' | 'suspended';
  joinDate: string;
  lastActivity: string;
  verificationStatus: 'verified' | 'pending' | 'rejected';
}

interface ChatSession {
  id: string;
  clientName: string;
  providerName: string;
  lastMessage: string;
  timestamp: string;
  status: 'active' | 'resolved' | 'escalated';
  messageCount: number;
}

interface EnhancedAdminDashboardProps {
  authToken: string;
  onLogout: () => void;
}

export const EnhancedAdminDashboard: React.FC<EnhancedAdminDashboardProps> = ({
  authToken,
  onLogout
}) => {
  // State management
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [clients, setClients] = useState<ClientOverview[]>([]);
  const [providers, setProviders] = useState<ProviderOverview[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState({
    stats: true,
    clients: false,
    providers: false,
    chats: false
  });
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);

  // Fetch admin statistics
  const fetchStats = async () => {
    try {
      setLoading(prev => ({ ...prev, stats: true }));
      const response = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        throw new Error('Failed to fetch admin statistics');
      }
    } catch (err) {
      setError('Failed to load admin statistics');
      console.error('Admin stats error:', err);
    } finally {
      setLoading(prev => ({ ...prev, stats: false }));
    }
  };

  // Fetch client overview data
  const fetchClients = async () => {
    try {
      setLoading(prev => ({ ...prev, clients: true }));
      const response = await fetch('/api/admin/clients/overview', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setClients(data.clients || []);
      } else {
        throw new Error('Failed to fetch client data');
      }
    } catch (err) {
      setError('Failed to load client data');
      console.error('Client fetch error:', err);
    } finally {
      setLoading(prev => ({ ...prev, clients: false }));
    }
  };

  // Fetch provider overview data
  const fetchProviders = async () => {
    try {
      setLoading(prev => ({ ...prev, providers: true }));
      const response = await fetch('/api/admin/providers/overview', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setProviders(data.providers || []);
      } else {
        throw new Error('Failed to fetch provider data');
      }
    } catch (err) {
      setError('Failed to load provider data');
      console.error('Provider fetch error:', err);
    } finally {
      setLoading(prev => ({ ...prev, providers: false }));
    }
  };

  // Fetch chat sessions
  const fetchChatSessions = async () => {
    try {
      setLoading(prev => ({ ...prev, chats: true }));
      const response = await fetch('/api/admin/chat/sessions', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setChatSessions(data.sessions || []);
      } else {
        throw new Error('Failed to fetch chat sessions');
      }
    } catch (err) {
      setError('Failed to load chat sessions');
      console.error('Chat sessions error:', err);
    } finally {
      setLoading(prev => ({ ...prev, chats: false }));
    }
  };

  // Refresh all data
  const handleRefreshAll = async () => {
    setRefreshing(true);
    setError(null);
    
    await Promise.all([
      fetchStats(),
      activeTab === 'clients' && fetchClients(),
      activeTab === 'providers' && fetchProviders(),
      activeTab === 'chats' && fetchChatSessions()
    ].filter(Boolean));
    
    setRefreshing(false);
  };

  // Load initial data
  useEffect(() => {
    fetchStats();
  }, [authToken]);

  // Load tab-specific data
  useEffect(() => {
    switch (activeTab) {
      case 'clients':
        if (clients.length === 0) fetchClients();
        break;
      case 'providers':
        if (providers.length === 0) fetchProviders();
        break;
      case 'chats':
        if (chatSessions.length === 0) fetchChatSessions();
        break;
    }
  }, [activeTab]);

  // Get status color for badges
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'verified':
      case 'healthy':
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
      case 'suspended':
      case 'blocked':
      case 'rejected':
      case 'critical':
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
      case 'active':
      case 'verified':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
      case 'warning':
        return <Clock className="w-4 h-4" />;
      case 'failed':
      case 'critical':
      case 'blocked':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <WayaWayaLogo className="h-8 w-auto" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">System oversight and management</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshAll}
                disabled={refreshing}
                className="flex items-center space-x-2"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                className="flex items-center space-x-2"
              >
                <Settings className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Tab Navigation */}
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="clients" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Clients</span>
            </TabsTrigger>
            <TabsTrigger value="providers" className="flex items-center space-x-2">
              <Briefcase className="w-4 h-4" />
              <span>Providers</span>
            </TabsTrigger>
            <TabsTrigger value="chats" className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>Chat Monitor</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {loading.stats ? '...' : stats?.totalUsers || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {stats?.totalClients || 0} clients, {stats?.totalProviders || 0} providers
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {loading.stats ? '...' : stats?.activeBookings || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {stats?.completedBookings || 0} completed this month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${loading.stats ? '...' : (stats?.totalRevenue || 0).toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    ${stats?.pendingPayments || 0} pending
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">System Health</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(stats?.systemHealth || 'healthy')}>
                      {getStatusIcon(stats?.systemHealth || 'healthy')}
                      <span className="ml-1 capitalize">{stats?.systemHealth || 'Healthy'}</span>
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats?.activeChatSessions || 0} active chats
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading.stats ? (
                    <div className="space-y-2">
                      {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="flex items-center space-x-3 animate-pulse">
                          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                          <div className="flex-1 space-y-1">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : stats?.recentActivity?.length > 0 ? (
                    stats.recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                        <div className={`p-2 rounded-full ${getStatusColor(activity.status)}`}>
                          {getStatusIcon(activity.status)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.description}
                          </p>
                          <p className="text-xs text-gray-500">
                            {activity.userName && `${activity.userName} • `}
                            {new Date(activity.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <Badge className={getStatusColor(activity.status)}>
                          {activity.status}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No recent activity</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Clients Tab */}
          <TabsContent value="clients" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Client Overview</h2>
                <p className="text-sm text-gray-500">Monitor client activities, bookings, and engagement</p>
              </div>
              <Button
                onClick={fetchClients}
                disabled={loading.clients}
                className="flex items-center space-x-2"
              >
                <RefreshCw className={`w-4 h-4 ${loading.clients ? 'animate-spin' : ''}`} />
                <span>Refresh Clients</span>
              </Button>
            </div>

            {/* Client Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {clients.filter(c => c.status === 'active').length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {clients.filter(c => c.status === 'blocked').length} blocked clients
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {clients.reduce((sum, c) => sum + c.totalBookings, 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Across all clients
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${clients.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Client revenue generated
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Client List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Client Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading.clients ? (
                    <div className="space-y-4">
                      {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg animate-pulse">
                          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </div>
                          <div className="w-20 h-6 bg-gray-200 rounded"></div>
                        </div>
                      ))}
                    </div>
                  ) : clients.length > 0 ? (
                    clients.map((client) => (
                      <div key={client.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{client.fullName}</h3>
                            <p className="text-sm text-gray-500">{client.email}</p>
                            <p className="text-xs text-gray-400">
                              Joined {new Date(client.joinDate).toLocaleDateString()} • 
                              {client.totalBookings} bookings • 
                              ${client.totalSpent.toLocaleString()} spent
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Badge className={getStatusColor(client.status)}>
                            {getStatusIcon(client.status)}
                            <span className="ml-1 capitalize">{client.status}</span>
                          </Badge>
                          
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <MessageSquare className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No clients found</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Providers Tab */}
          <TabsContent value="providers" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Provider Overview</h2>
                <p className="text-sm text-gray-500">Monitor service provider performance, earnings, and status</p>
              </div>
              <Button
                onClick={fetchProviders}
                disabled={loading.providers}
                className="flex items-center space-x-2"
              >
                <RefreshCw className={`w-4 h-4 ${loading.providers ? 'animate-spin' : ''}`} />
                <span>Refresh Providers</span>
              </Button>
            </div>

            {/* Provider Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Providers</CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {providers.filter(p => p.status === 'active').length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {providers.filter(p => p.status === 'pending').length} pending approval
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${providers.reduce((sum, p) => sum + p.totalEarnings, 0).toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Provider earnings
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed Jobs</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {providers.reduce((sum, p) => sum + p.completedJobs, 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Total jobs completed
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {providers.length > 0 
                      ? (providers.reduce((sum, p) => sum + p.rating, 0) / providers.length).toFixed(1)
                      : '0.0'
                    }
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Provider rating average
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Provider List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Briefcase className="w-5 h-5" />
                  <span>Provider Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading.providers ? (
                    <div className="space-y-4">
                      {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg animate-pulse">
                          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </div>
                          <div className="w-20 h-6 bg-gray-200 rounded"></div>
                        </div>
                      ))}
                    </div>
                  ) : providers.length > 0 ? (
                    providers.map((provider) => (
                      <div key={provider.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <Briefcase className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{provider.fullName}</h3>
                            <p className="text-sm text-gray-500">{provider.email}</p>
                            <p className="text-xs text-gray-400">
                              {provider.services.join(', ')} • 
                              ⭐ {provider.rating.toFixed(1)} • 
                              {provider.completedJobs} jobs • 
                              ${provider.totalEarnings.toLocaleString()} earned
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Badge className={getStatusColor(provider.verificationStatus)}>
                            {getStatusIcon(provider.verificationStatus)}
                            <span className="ml-1 capitalize">{provider.verificationStatus}</span>
                          </Badge>
                          
                          <Badge className={getStatusColor(provider.status)}>
                            {getStatusIcon(provider.status)}
                            <span className="ml-1 capitalize">{provider.status}</span>
                          </Badge>
                          
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <MessageSquare className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No providers found</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Chat Monitor Tab */}
          <TabsContent value="chats" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Chat Monitor</h2>
                <p className="text-sm text-gray-500">Real-time chat oversight and support management</p>
              </div>
              <Button
                onClick={fetchChatSessions}
                disabled={loading.chats}
                className="flex items-center space-x-2"
              >
                <RefreshCw className={`w-4 h-4 ${loading.chats ? 'animate-spin' : ''}`} />
                <span>Refresh Chats</span>
              </Button>
            </div>

            {/* Chat Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {chatSessions.filter(s => s.status === 'active').length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Currently active chats
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Escalated</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {chatSessions.filter(s => s.status === 'escalated').length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Requiring admin attention
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {chatSessions.reduce((sum, s) => sum + s.messageCount, 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Messages exchanged today
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Chat Sessions List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5" />
                  <span>Active Chat Sessions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading.chats ? (
                    <div className="space-y-4">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg animate-pulse">
                          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                          </div>
                          <div className="w-16 h-6 bg-gray-200 rounded"></div>
                        </div>
                      ))}
                    </div>
                  ) : chatSessions.length > 0 ? (
                    chatSessions.map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <MessageSquare className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {session.clientName} ↔ {session.providerName}
                            </h3>
                            <p className="text-sm text-gray-500 truncate max-w-md">
                              {session.lastMessage}
                            </p>
                            <p className="text-xs text-gray-400">
                              {session.messageCount} messages • 
                              {new Date(session.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Badge className={getStatusColor(session.status)}>
                            {getStatusIcon(session.status)}
                            <span className="ml-1 capitalize">{session.status}</span>
                          </Badge>
                          
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            {session.status === 'escalated' && (
                              <Button variant="default" size="sm">
                                <AlertTriangle className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No active chat sessions</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
