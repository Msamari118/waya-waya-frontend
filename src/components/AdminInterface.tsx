// src/components/AdminInterface.tsx
import React, { useState, useEffect } from 'react';
import { WayaWayaLogo } from './shared/WayaWayaLogo'; // Assuming this component exists
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { RefreshCw, Bell, Users, UserCheck, CreditCard, Settings, DollarSign, Calendar, AlertTriangle, Loader2, Clock, Briefcase, Percent } from 'lucide-react';
import { Skeleton } from './ui/skeleton'; // Assuming a skeleton loader component exists

// --- Type Definitions (Ideally defined centrally) ---
interface ApiClient {
  admin: {
    getStats?: (token: string) => Promise<any>;
    getUsers?: (token: string, type: 'client' | 'provider', page: number, limit: number) => Promise<any>;
    getPayments?: (token: string, page: number, limit: number) => Promise<any>;
    getTrials?: (token: string, page: number, limit: number) => Promise<any>;
    // Add other admin API methods as needed
  };
  // ... other API sections
}

interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  userType: 'client' | 'provider';
  createdAt: string;
  // Add other relevant user fields
}

interface Payment {
  id: string;
  userId: string;
  userName: string; // Or fetch separately
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed';
  processedAt: string;
  transactionType: string; // e.g., 'commission_earned', 'registration_fee'
  // Add other relevant payment fields
}

interface Trial {
  userId: string;
  userName: string; // Or fetch separately
  providerId?: string; // If linked to a provider profile
  trialStartsAt: string;
  trialEndsAt: string;
  status: 'active' | 'expired' | 'converted';
  daysRemaining?: number;
  // Add other relevant trial fields
}

interface AdminStats {
  totalUsers: number;
  totalProviders: number;
  totalBookings: number;
  totalRevenue: number;
  activeUsers: number;
  pendingProviders: number;
  monthlyRevenue: number;
  commissionCollected: number;
  // Add other stats as returned by your backend
}

// --- Component Props ---
interface AdminInterfaceProps {
  onNavigate: (view: string) => void;
  apiClient: ApiClient; // Strongly typed API client
  authToken: string | null; // Auth token for API requests
}

// --- Main Component ---
export const AdminInterface: React.FC<AdminInterfaceProps> = ({ onNavigate, apiClient, authToken }) => {
  const [currentTab, setCurrentTab] = useState('overview');
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({
    overview: false,
    users: false,
    providers: false,
    payments: false,
    trials: false,
  });
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [providers, setProviders] = useState<User[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [trials, setTrials] = useState<Trial[]>([]);

  // --- Data Fetching Hooks ---
  const fetchStats = async () => {
    if (!authToken || !apiClient.admin.getStats) return;
    setLoading(prev => ({ ...prev, overview: true }));
    setError(null);
    try {
      console.log("Fetching admin stats...");
      const response = await apiClient.admin.getStats(authToken);
      if (response.ok) {
        const data: AdminStats = await response.json();
        console.log("Stats fetched:", data);
        setStats(data);
      } else {
        console.error("Failed to fetch stats:", response.status);
        setError(`Failed to load statistics: ${response.statusText || 'Unknown error'}`);
      }
    } catch (err) {
      console.error("Network error fetching stats:", err);
      setError('Network error occurred while fetching statistics.');
    } finally {
      setLoading(prev => ({ ...prev, overview: false }));
    }
  };

  const fetchUsers = async (type: 'client' | 'provider') => {
    if (!authToken || !apiClient.admin.getUsers) return;
    setLoading(prev => ({ ...prev, [type + 's']: true }));
    setError(null);
    try {
      console.log(`Fetching ${type}s...`);
      const response = await apiClient.admin.getUsers(authToken, type, 1, 10);
      if (response.ok) {
        const data = await response.json();
        const users = data.users || [];
        if (type === 'client') {
          setUsers(users);
        } else {
          setProviders(users);
        }
        console.log(`${type}s fetched:`, users);
      } else {
        console.error(`Failed to fetch ${type}s:`, response.status);
        setError(`Failed to load ${type}s: ${response.statusText || 'Unknown error'}`);
      }
    } catch (err) {
      console.error(`Network error fetching ${type}s:`, err);
      setError(`Network error occurred while fetching ${type}s.`);
    } finally {
      setLoading(prev => ({ ...prev, [type + 's']: false }));
    }
  };

  const fetchPayments = async () => {
    if (!authToken || !apiClient.admin.getPayments) return;
    setLoading(prev => ({ ...prev, payments: true }));
    setError(null);
    try {
      console.log("Fetching payments...");
      const response = await apiClient.admin.getPayments(authToken, 1, 10);
      if (response.ok) {
        const data = await response.json();
        const payments = data.payments || [];
        setPayments(payments);
        console.log("Payments fetched:", payments);
      } else {
        console.error("Failed to fetch payments:", response.status);
        setError(`Failed to load payments: ${response.statusText || 'Unknown error'}`);
      }
    } catch (err) {
      console.error("Network error fetching payments:", err);
      setError('Network error occurred while fetching payments.');
    } finally {
      setLoading(prev => ({ ...prev, payments: false }));
    }
  };

  const fetchTrials = async () => {
    if (!authToken || !apiClient.admin.getTrials) return;
    setLoading(prev => ({ ...prev, trials: true }));
    setError(null);
    try {
      console.log("Fetching trials...");
      const response = await apiClient.admin.getTrials(authToken, 1, 10);
      if (response.ok) {
        const data = await response.json();
        const trials = data.trials || [];
        setTrials(trials);
        console.log("Trials fetched:", trials);
      } else {
        console.error("Failed to fetch trials:", response.status);
        setError(`Failed to load trials: ${response.statusText || 'Unknown error'}`);
      }
    } catch (err) {
      console.error("Network error fetching trials:", err);
      setError('Network error occurred while fetching trials.');
    } finally {
      setLoading(prev => ({ ...prev, trials: false }));
    }
  };

  // --- Effects for Initial Data Load ---
  useEffect(() => {
    fetchStats();
    // Initial load for the first tab content if needed
    // fetchUsers('client'); // Or based on default tab
  }, [authToken]); // Re-fetch if authToken changes (unlikely)

  // --- Handlers ---
  const handleRefresh = () => {
    // Determine which data to refresh based on current tab
    switch (currentTab) {
      case 'overview':
        fetchStats();
        break;
      case 'users':
        fetchUsers('client');
        break;
      case 'providers':
        fetchUsers('provider');
        break;
      case 'payments':
        fetchPayments();
        break;
      case 'trials':
        fetchTrials();
        break;
      default:
        console.warn(`Refresh not implemented for tab: ${currentTab}`);
    }
  };

  // --- Render Helpers ---
  const renderStatCard = (title: string, value: number | string, icon: React.ReactNode, isLoading?: boolean) => (
    <Card className="bg-gradient-to-br from-black/40 to-black-60 border border-yellow-500/30 backdrop-blur-sm shadow-2xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-white">{title}</CardTitle>
        <div className="text-yellow-400">{icon}</div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-6 w-3/4 bg-gray-700" />
        ) : (
          <div className="text-2xl font-bold text-white">
            {typeof value === 'number' ? (value % 1 !== 0 ? `R${value.toFixed(2)}` : value) : value}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderDataTable = (title: string, data: any[], columns: { key: string; label: string; render?: (item: any) => React.ReactNode }[], isLoading: boolean) => (
    <Card className="bg-gradient-to-br from-black/40 to-black-60 border border-yellow-500/30 backdrop-blur-sm shadow-2xl">
      <CardHeader>
        <CardTitle className="text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full bg-gray-700" />
            <Skeleton className="h-4 w-5/6 bg-gray-700" />
            <Skeleton className="h-4 w-4/5 bg-gray-700" />
          </div>
        ) : data.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-yellow-500/30">
                  {columns.map(col => (
                    <th key={col.key} className="pb-2 font-semibold text-white">
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index} className="border-b border-yellow-500/20 hover:bg-yellow-500/10 transition-all duration-200">
                    {columns.map(col => (
                      <td key={col.key} className="py-2 text-gray-200">
                        {col.render ? col.render(item) : item[col.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-300 text-center py-4">No data available.</p>
        )}
      </CardContent>
    </Card>
  );

  // --- Main Render ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 via-yellow-500 to-red-600">
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => onNavigate('home')} className="text-white hover:bg-yellow-500/20 transition-all duration-200">
              ← Back to App
            </Button>
            <WayaWayaLogo size="sm" />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 via-green-400 to-blue-400 bg-clip-text text-transparent">Admin Dashboard</h1>
              <p className="text-sm text-gray-300">Manage users, providers, and platform operations</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading.overview || loading.users || loading.providers || loading.payments || loading.trials} className="text-white border-yellow-500/30 hover:bg-yellow-500/20">
              {loading.overview || loading.users || loading.providers || loading.payments || loading.trials ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh
            </Button>
            <Button variant="outline" size="sm" className="text-white border-yellow-500/30 hover:bg-yellow-500/20">
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Global Error Alert */}
        {error && (
          <Alert className="mb-6 bg-red-950/40 border-red-500/30 text-red-200">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-red-200">{error}</AlertDescription>
          </Alert>
        )}

        {/* Main Content - Tabs */}
        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid w-full grid-cols-5 lg:grid-cols-6 mb-6 bg-black/40 backdrop-blur-sm border border-yellow-500/30">
            <TabsTrigger value="overview" className="flex items-center justify-center text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:via-green-400 data-[state=active]:to-blue-400 data-[state=active]:text-white hover:bg-yellow-500/20 transition-all duration-200">
              <Settings className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center justify-center text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:via-green-400 data-[state=active]:to-blue-400 data-[state=active]:text-white hover:bg-yellow-500/20 transition-all duration-200">
              <Users className="h-4 w-4 mr-2" />
              Clients
            </TabsTrigger>
            <TabsTrigger value="providers" className="flex items-center justify-center text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:via-green-400 data-[state=active]:to-blue-400 data-[state=active]:text-white hover:bg-yellow-500/20 transition-all duration-200">
              <UserCheck className="h-4 w-4 mr-2" />
              Providers
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center justify-center text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:via-green-400 data-[state=active]:to-blue-400 data-[state=active]:text-white hover:bg-yellow-500/20 transition-all duration-200">
              <CreditCard className="h-4 w-4 mr-2" />
              Payments
            </TabsTrigger>
            <TabsTrigger value="trials" className="flex items-center justify-center text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:via-green-400 data-[state=active]:to-blue-400 data-[state=active]:text-white hover:bg-yellow-500/20 transition-all duration-200">
              <Calendar className="h-4 w-4 mr-2" />
              Trials
            </TabsTrigger>
            {/* <TabsTrigger value="settings" className="flex items-center justify-center">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger> */}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {renderStatCard(
                "Total Users",
                stats?.totalUsers ?? 0,
                <Users className="h-4 w-4 text-muted-foreground" />,
                loading.overview
              )}
              {renderStatCard(
                "Total Providers",
                stats?.totalProviders ?? 0,
                <UserCheck className="h-4 w-4 text-muted-foreground" />,
                loading.overview
              )}
              {renderStatCard(
                "Active Users",
                stats?.activeUsers ?? 0,
                <Bell className="h-4 w-4 text-muted-foreground" />,
                loading.overview
              )}
              {renderStatCard(
                "Pending Providers",
                stats?.pendingProviders ?? 0,
                <Clock className="h-4 w-4 text-muted-foreground" />,
                loading.overview
              )}
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {renderStatCard(
                "Total Bookings",
                stats?.totalBookings ?? 0,
                <Briefcase className="h-4 w-4 text-muted-foreground" />, // Assuming Briefcase icon is imported
                loading.overview
              )}
              {renderStatCard(
                "Total Revenue",
                stats?.totalRevenue ?? 0,
                <DollarSign className="h-4 w-4 text-muted-foreground" />,
                loading.overview
              )}
              {renderStatCard(
                "Monthly Revenue",
                stats?.monthlyRevenue ?? 0,
                <CreditCard className="h-4 w-4 text-muted-foreground" />,
                loading.overview
              )}
              {renderStatCard(
                "Commission Collected",
                stats?.commissionCollected ?? 0,
                <Percent className="h-4 w-4 text-muted-foreground" />, // Assuming Percent icon is imported or use DollarSign
                loading.overview
              )}
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            {renderDataTable(
              "Registered Clients",
              users,
              [
                { key: 'fullName', label: 'Name' },
                { key: 'email', label: 'Email' },
                { key: 'phone', label: 'Phone' },
                {
                  key: 'createdAt',
                  label: 'Joined',
                  render: (item) => new Date(item.createdAt).toLocaleDateString(),
                },
              ],
              loading.users
            )}
          </TabsContent>

          {/* Providers Tab */}
          <TabsContent value="providers" className="space-y-6">
            {renderDataTable(
              "Registered Providers",
              providers, // Using mock users for now, replace with actual providers data
              [
                { key: 'fullName', label: 'Name' },
                { key: 'email', label: 'Email' },
                { key: 'phone', label: 'Phone' },
                {
                  key: 'createdAt',
                  label: 'Joined',
                  render: (item) => new Date(item.createdAt).toLocaleDateString(),
                },
                // Add status column if applicable (active, pending verification, etc.)
              ],
              loading.providers
            )}
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            {renderDataTable(
              "Recent Payments & Commissions",
              payments,
              [
                { key: 'userName', label: 'User' },
                {
                  key: 'transactionType',
                  label: 'Type',
                  render: (item) => (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.transactionType === 'commission_earned' ? 'bg-green-100 text-green-800' :
                      item.transactionType === 'registration_fee' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {item.transactionType === 'commission_earned' ? 'Commission' : 'Reg. Fee'}
                    </span>
                  ),
                },
                {
                  key: 'amount',
                  label: 'Amount',
                  render: (item) => `R${item.amount.toFixed(2)}`,
                },
                {
                  key: 'status',
                  label: 'Status',
                  render: (item) => (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === 'completed' ? 'bg-green-100 text-green-800' :
                      item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  ),
                },
                {
                  key: 'processedAt',
                  label: 'Date',
                  render: (item) => new Date(item.processedAt).toLocaleDateString(),
                },
              ],
              loading.payments
            )}
          </TabsContent>

          {/* Trials Tab */}
          <TabsContent value="trials" className="space-y-6">
            {renderDataTable(
              "Active & Recent Trials",
              trials,
              [
                { key: 'userName', label: 'Provider' },
                { key: 'providerId', label: 'Provider ID' },
                {
                  key: 'trialStartsAt',
                  label: 'Start Date',
                  render: (item) => new Date(item.trialStartsAt).toLocaleDateString(),
                },
                {
                  key: 'trialEndsAt',
                  label: 'End Date',
                  render: (item) => new Date(item.trialEndsAt).toLocaleDateString(),
                },
                {
                  key: 'status',
                  label: 'Status',
                  render: (item) => {
                    let statusClass = '';
                    let statusText = '';
                    if (item.status === 'active') {
                      statusClass = 'bg-green-100 text-green-800';
                      statusText = item.daysRemaining !== undefined ? `Active (${item.daysRemaining} days left)` : 'Active';
                    } else if (item.status === 'expired') {
                      statusClass = 'bg-red-100 text-red-800';
                      statusText = 'Expired';
                    } else { // converted
                      statusClass = 'bg-blue-100 text-blue-800';
                      statusText = 'Converted';
                    }
                    return (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}>
                        {statusText}
                      </span>
                    );
                  },
                },
              ],
              loading.trials
            )}
          </TabsContent>

          {/* Settings Tab (Placeholder) */}
          {/* <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Platform Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Configuration settings for the platform would be managed here.</p>
                <Button variant="outline" className="mt-4">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent> */}
        </Tabs>
      </div>
    </div>
  );
};

// Export the component
// export default AdminInterface; // If using default export in App.tsx