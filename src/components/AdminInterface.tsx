import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { Users, UserCheck, AlertTriangle, TrendingUp, Star, Clock, CheckCircle, AlertCircle } from 'lucide-react';

// WAYA WAYA Logo Component
const WayaWayaLogo = ({ size = 'sm', showText = true }) => {
  const logoSizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizes = {
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

interface AdminInterfaceProps {
  onNavigate: (view: string) => void;
  apiClient: any;
  authToken: string;
}

export default function AdminInterface({ onNavigate, apiClient, authToken }: AdminInterfaceProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Admin data states
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeProviders: 0,
    pendingApplications: 0,
    totalJobs: 0,
    avgRating: 0,
    monthlyRevenue: 0
  });
  
  const [pendingProviders, setPendingProviders] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);

  // Load admin data
  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [statsResponse, providersResponse] = await Promise.all([
        apiClient.admin.getStats(authToken),
        apiClient.admin.getPendingProviders(authToken)
      ]);

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      if (providersResponse.ok) {
        const providersData = await providersResponse.json();
        setPendingProviders(providersData);
      }
    } catch (err) {
      setError('Failed to load admin data');
      console.error('Admin data loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProviderAction = async (providerId: number, action: string) => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      let response;
      if (action === 'approve') {
        response = await apiClient.admin.approveProvider(providerId, authToken);
      } else if (action === 'reject') {
        response = await apiClient.admin.rejectProvider(providerId, authToken);
      }
      
      if (response && response.ok) {
        setSuccess(`Provider ${action}d successfully`);
        // Refresh pending providers list
        await loadAdminData();
      } else {
        const data = await response.json();
        setError(data.error || `Failed to ${action} provider`);
      }
    } catch (err) {
      setError(`Network error during ${action} action`);
      console.error(`Provider ${action} error:`, err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => onNavigate('home')}>
            ← Back
          </Button>
          <WayaWayaLogo size="sm" />
          <div>
            <h1>Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">WAYA WAYA! Platform Management</p>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="mb-6">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="providers">Providers</TabsTrigger>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6 mt-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium">Total Users</span>
                  </div>
                  <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
                  <p className="text-xs text-green-600">+12% this month</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <UserCheck className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium">Active Providers</span>
                  </div>
                  <div className="text-2xl font-bold">{stats.activeProviders.toLocaleString()}</div>
                  <p className="text-xs text-green-600">+8% this month</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    <span className="text-sm font-medium">Pending Apps</span>
                  </div>
                  <div className="text-2xl font-bold">{stats.pendingApplications}</div>
                  <p className="text-xs text-orange-600">Needs review</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                    <span className="text-sm font-medium">Total Jobs</span>
                  </div>
                  <div className="text-2xl font-bold">{stats.totalJobs.toLocaleString()}</div>
                  <p className="text-xs text-green-600">+23% this month</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-5 w-5 text-yellow-600" />
                    <span className="text-sm font-medium">Avg Rating</span>
                  </div>
                  <div className="text-2xl font-bold">{stats.avgRating}</div>
                  <p className="text-xs text-green-600">+0.1 this month</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium">Revenue</span>
                  </div>
                  <div className="text-2xl font-bold">R{stats.monthlyRevenue.toLocaleString()}</div>
                  <p className="text-xs text-green-600">+15% this month</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Jobs</CardTitle>
              </CardHeader>
              <CardContent>
                {recentJobs.length > 0 ? (
                  <div className="space-y-3">
                    {recentJobs.map((job) => (
                      <div key={job.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{job.service} - R{job.amount}</p>
                          <p className="text-sm text-muted-foreground">
                            {job.client} → {job.provider}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant={job.status === 'completed' ? 'default' : 'secondary'}>
                            {job.status}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">{job.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No recent jobs to display</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="providers" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending Provider Applications</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {pendingProviders.length} applications awaiting review
                </p>
              </CardHeader>
              <CardContent>
                {pendingProviders.length > 0 ? (
                  <div className="space-y-4">
                    {pendingProviders.map((provider) => (
                      <div key={provider.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium">{provider.name}</h4>
                            <p className="text-sm text-muted-foreground">{provider.service || provider.services?.join(', ')}</p>
                            <p className="text-xs text-muted-foreground">Email: {provider.email}</p>
                            <p className="text-xs text-muted-foreground">Phone: {provider.phone}</p>
                          </div>
                          <Badge variant="outline">{provider.status || 'pending-review'}</Badge>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-muted-foreground">
                            <p>Applied: {provider.appliedDate || new Date(provider.createdAt).toLocaleDateString()}</p>
                            <p>Documents: {provider.documentsCount || 0}/5</p>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleProviderAction(provider.id, 'review')}
                              disabled={loading}
                            >
                              Review
                            </Button>
                            <Button 
                              size="sm" 
                              variant="default"
                              onClick={() => handleProviderAction(provider.id, 'approve')}
                              disabled={loading}
                            >
                              {loading ? 'Processing...' : 'Approve'}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleProviderAction(provider.id, 'reject')}
                              disabled={loading}
                            >
                              {loading ? 'Processing...' : 'Reject'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <UserCheck className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No pending applications</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Provider Search & Filter */}
            <Card>
              <CardHeader>
                <CardTitle>All Providers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-4">
                  <Input placeholder="Search providers..." className="flex-1" />
                  <Select>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Services</SelectItem>
                      <SelectItem value="plumbing">Plumbing</SelectItem>
                      <SelectItem value="electrical">Electrical</SelectItem>
                      <SelectItem value="cleaning">Cleaning</SelectItem>
                      <SelectItem value="beauty">Beauty</SelectItem>
                      <SelectItem value="transport">Transport</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                      <SelectItem value="tutoring">Tutoring</SelectItem>
                      <SelectItem value="garden">Garden</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Advanced provider management interface</p>
                  <p className="text-xs">Search, filter, and manage all registered providers</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jobs" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Job Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Job monitoring and management interface</p>
                  <p className="text-xs">Track active jobs, disputes, and completion rates</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Analytics & Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Star className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Detailed analytics and reporting interface</p>
                  <p className="text-xs">Revenue reports, user analytics, and platform insights</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* WAYA WAYA Branding Footer */}
        <div className="mt-8 pt-6 border-t text-center">
          <WayaWayaLogo size="sm" />
          <p className="text-xs text-muted-foreground mt-2">
            Admin Dashboard - Manage the platform with confidence
          </p>
        </div>
      </div>
    </div>
  );
}