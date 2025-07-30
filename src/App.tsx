import React, { useState, useEffect } from 'react';
import './styles/globals.css';
import LandingScreen from './components/LandingScreen';
import AuthScreen from './components/AuthScreen';
import ServiceRequestModule from './components/ServiceRequestModule';
import MatchingEngine from './components/MatchingEngine';
import RatingsReviews from './components/RatingsReviews';
// import AdminInterface from './components/AdminInterface';

// Import UI Components
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar';
import { Badge } from './components/ui/badge';
import { Alert, AlertDescription } from './components/ui/alert';
import { Tabs, TabsContent } from './components/ui/tabs';

// Import Lucide React Icons
import { 
  MessageCircle, Unlock, Lock, Send, Paperclip, X, BookOpen, 
  AlertTriangle, CreditCard, Receipt, Copy, DollarSign, FileText,
  Users, Ban, Calendar, Shield, TrendingUp, Wallet, AlertCircle,
  ArrowLeft, ArrowRight, Settings, LogOut, Bell, User, Menu,
  Search, Clock, MapPin, Phone, Star, Navigation, Briefcase,
  Plus, CheckCircle, Eye, Edit3, Zap, Image, Video, FileIcon,
  Download
} from 'lucide-react';

// Import types and constants
import {
  User,
  ServiceRequest,
  ChatMessage,
  Provider,
  CustomService,
  BookingDetails,
  BookingData,
  CustomServiceForm,
  WayaWayaLogoProps
} from './types';

import {
  INTERNATIONAL_COUNTRY_CODES,
  SERVICE_CATEGORIES,
  FEATURED_PROVIDERS,
  BLOCKED_CLIENTS,
  getApiBaseUrl,
  API_BASE_URL,
  validatePassword,
  checkAdminAccess,
  setAdminAccess
} from './utils/constants';

// Import API client
import apiClient from './types/apiClient';

// Import WayaWayaLogo component
import { WayaWayaLogo } from './components/common/WayaWayaLogo';

// Import extracted components
import { ChatSystem } from './components/chat/ChatSystem';
import { BookingDialog } from './components/booking/BookingDialog';
import { PaymentManagement } from './components/admin/PaymentManagement';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('landing');
  const [userType, setUserType] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [serviceRequest, setServiceRequest] = useState<ServiceRequest | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminKey, setAdminKey] = useState('');

  // Chat system state
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatFilesAllowed, setChatFilesAllowed] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [currentChatProvider, setCurrentChatProvider] = useState<Provider | null>(null);
  const [providerChats, setProviderChats] = useState<Record<number, ChatMessage[]>>({});

  // Booking system state
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
    date: '',
    time: '',
    description: '',
    urgency: 'normal',
    location: '',
    estimatedHours: 1
  });

  // Original state for the main app
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [registrationStep, setRegistrationStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [customServices, setCustomServices] = useState<CustomService[]>([]);
  const [showCustomServiceForm, setShowCustomServiceForm] = useState(false);
  const [newCustomService, setNewCustomService] = useState<CustomServiceForm>({
    name: '',
    description: '',
    rate: '',
    category: 'other'
  });

  // Booking View State
  const [bookingData, setBookingData] = useState({
    serviceType: '',
    description: '',
    preferredTime: '',
    location: { lat: null, lng: null, address: '' }
  });
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [bookingError, setBookingError] = useState('');

  // Providers state and loading/error
  const [providers, setProviders] = useState<Provider[]>([]);
  const [providersLoading, setProvidersLoading] = useState<boolean>(true);
  const [providersError, setProvidersError] = useState<string>('');

  // Fetch providers from backend
  useEffect(() => {
    const fetchProviders = async () => {
      setProvidersLoading(true);
      setProvidersError('');
      try {
        const response = await apiClient.providers.getAll(authToken || '');
        if (response.ok) {
          const data = await response.json();
          setProviders(data.providers || []);
        } else {
          setProvidersError('Failed to load providers.');
        }
      } catch (error) {
        setProvidersError('Network error.');
      }
      setProvidersLoading(false);
    };
    fetchProviders();
  }, [authToken]);

  // Check for admin access on app load
  useEffect(() => {
    const checkAccess = async () => {
      const hasAdminAccess = await checkAdminAccess();
      if (hasAdminAccess === true && import.meta.env.DEV) {
        // Auto-enable admin in localhost development
        setIsAdminMode(true);
        setIsAuthenticated(true);
        setCurrentUser({ 
          id: 'admin_user', 
          email: 'admin@wayawaya.co.za', 
          userType: 'admin',
          role: 'admin',
          name: 'Admin User'
        });
        setUserType('admin');
        setCurrentView('admin-overview');
      } else {
        // Check for regular user authentication
        const storedToken = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('currentUser');
        
        if (storedToken && storedUser) {
          try {
            apiClient.auth.verifyToken(storedToken)
              .then(response => {
                if (response.ok) {
                  const user = JSON.parse(storedUser);
                  setAuthToken(storedToken);
                  setCurrentUser(user);
                  setUserType(user.userType);
                  setIsAuthenticated(true);
                  setCurrentView('home');
                } else {
                  handleLogout();
                }
              })
              .catch(error => {
                console.error('Token verification failed:', error);
                handleLogout();
              });
          } catch (error) {
            console.error('Error during token verification:', error);
            handleLogout();
          }
        }
      }
    };
    
    checkAccess();
  }, []);

  // Handle auth success from AuthScreen
  const handleAuthSuccess = (token: string, user: User) => {
    setAuthToken(token);
    setCurrentUser(user);
    setUserType(user.userType);
    setIsAuthenticated(true);
    setCurrentView('home');
    localStorage.setItem('authToken', token);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsAdminMode(false);
    setUserType(null);
    setAuthToken(null);
    setCurrentUser(null);
    setCurrentView('landing');
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('adminAccess');
    localStorage.removeItem('pendingRegistration');
  };

  // Handle admin login
  const handleAdminLogin = async () => {
    const isValid = await validatePassword(adminKey);
    
    if (isValid) {
      setIsAdminMode(true);
      setIsAuthenticated(true);
      setCurrentUser({ 
        id: 'admin_user', 
        email: 'admin@wayawaya.co.za', 
        userType: 'admin',
        role: 'admin',
        name: 'Admin User'
      });
      setUserType('admin');
      setCurrentView('admin-overview');
      setShowAdminLogin(false);
    } else {
// ...existing code...
// Removed stray/duplicate code block. ProviderTrialManagement and HomeView are defined below as valid components.
      time: '',
      description: '',
      urgency: 'normal',
      location: '',
      estimatedHours: 1
    });
  };

  const handleBookingSubmit = async () => {
    if (!bookingDetails.date || !bookingDetails.time || !bookingDetails.description) {
      alert('Please fill in all required fields');
      return;
    }

    if (!selectedProvider) {
      alert('No provider selected');
      return;
    }

    const bookingData = {
      providerId: selectedProvider.id,
      providerName: selectedProvider.name,
      service: selectedProvider.service,
      ...bookingDetails,
      totalEstimate: selectedProvider.hourlyRate * bookingDetails.estimatedHours,
      bookingDate: new Date().toISOString()
    };

    try {
      const response = await apiClient.providers.bookService(bookingData, authToken || '');
      if (response.ok) {
        const result = await response.json();
        alert(`Booking confirmed! Reference: ${result.bookingId}`);
        setShowBookingDialog(false);
        setSelectedProvider(null);
        
        // Optionally start a chat with the provider
        if (selectedProvider) {
          startProviderChat(selectedProvider);
        }
      } else {
        const error = await response.json();
        alert(`Booking failed: ${error.message}`);
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Network error. Please try again.');
    }
  };

  // Chat Functions
  const sendMessage = currentChatProvider ? sendProviderMessage : async () => {
    if (!newMessage.trim() && selectedFiles.length === 0) return;

    const message = {
      id: Date.now(),
      text: newMessage,
      files: selectedFiles,
      sender: currentUser?.name || 'Unknown',
      timestamp: new Date().toISOString(),
      type: 'user' as const
    };

    setChatMessages(prev => [...prev, message]);
    setNewMessage('');
    setSelectedFiles([]);

    try {
      await apiClient.chat.sendMessage(message, authToken || '');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setSelectedFiles(prev => [...prev, ...fileArray]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const toggleFileUploadPermission = () => {
    setChatFilesAllowed(!chatFilesAllowed);
  };

  // Chat System Component
  const ChatSystemComponent = () => (
    <ChatSystem
      showChat={showChat}
      setShowChat={setShowChat}
      chatMessages={chatMessages}
      setChatMessages={setChatMessages}
      newMessage={newMessage}
      setNewMessage={setNewMessage}
      selectedFiles={selectedFiles}
      setSelectedFiles={setSelectedFiles}
      chatFilesAllowed={chatFilesAllowed}
      currentChatProvider={currentChatProvider}
      setCurrentChatProvider={setCurrentChatProvider}
      providerChats={providerChats}
      setProviderChats={setProviderChats}
      currentUser={currentUser}
      isAdminMode={isAdminMode}
      toggleFileUploadPermission={toggleFileUploadPermission}
      sendMessage={sendMessage}
      handleFileSelect={handleFileSelect}
      removeFile={removeFile}
    />
  );

  // Booking Dialog Component
  const BookingDialogComponent = () => (
    <BookingDialog
      showBookingDialog={showBookingDialog}
      setShowBookingDialog={setShowBookingDialog}
      selectedProvider={selectedProvider}
      bookingData={bookingData}
      bookingError={bookingError}
      handleBookingChange={handleBookingChange}
      handleLocationChange={handleLocationChange}
      handleSubmitBooking={handleSubmitBooking}
    />
  );


  // Client Management Component
  const ClientManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => setCurrentView('admin-overview')}>
          ← Back
        </Button>
        <WayaWayaLogo size="sm" />
        <h1>Client Management</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Active Clients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-sm text-muted-foreground">+12% this month</p>
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
            <div className="text-2xl font-bold">{BLOCKED_CLIENTS.length}</div>
            <p className="text-sm text-muted-foreground">Due to non-payment</p>
          </CardContent>
        </Card>
      </div>

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

            <div className="space-y-3">
              <h4 className="font-semibold">Blocked Clients</h4>
              {BLOCKED_CLIENTS.map((client) => (
                <div key={client.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{client.name}</p>
                        <p className="text-sm text-muted-foreground">{client.email}</p>
                      </div>
                    </div>
                    <div className="mt-2 text-sm">
                      <p className="text-red-600">Reason: {client.reason}</p>
                      <p className="text-muted-foreground">Blocked: {client.blockedDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive">R{client.amountDue.toFixed(2)}</Badge>
                    <Button variant="outline" size="sm">
                      <Unlock className="h-4 w-4 mr-2" />
                      Unblock
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                className="h-12"
                onClick={() => alert('Send Payment Reminders clicked!')}
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Send Payment Reminders
              </Button>
              <Button 
                variant="outline" 
                className="h-12"
                onClick={() => alert('Export Client Report clicked!')}
              >
                <FileText className="h-4 w-4 mr-2" />
                Export Client Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Provider Trial Management Component

  // Enhanced Admin Overview Component
  const AdminOverview = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage the Waya Waya platform</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setCurrentView('home')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to App
          </Button>
          <Button onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">1,234</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Briefcase className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Providers</p>
                <p className="text-2xl font-bold">89</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">R45,678</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Issues</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setCurrentView('payment-management')}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CreditCard className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">Payment Management</h3>
                <p className="text-sm text-muted-foreground">Manage payments & transactions</p>
              </div>
              <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setCurrentView('client-management')}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Client Management</h3>
                <p className="text-sm text-muted-foreground">Manage clients & requests</p>
              </div>
              <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setCurrentView('provider-trial-management')}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Shield className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold">Provider Trials</h3>
                <p className="text-sm text-muted-foreground">Manage trial providers</p>
              </div>
              <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Admin Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">File Upload Permissions</h4>
              <p className="text-sm text-muted-foreground">Control file uploads in chat</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">{chatFilesAllowed ? 'Enabled' : 'Disabled'}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleFileUploadPermission}
                className="flex items-center gap-2"
              >
                {chatFilesAllowed ? <Eye className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                {chatFilesAllowed ? 'Disable' : 'Enable'}
              </Button>
            </div>
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Admin Access Control</h4>
              <p className="text-sm text-muted-foreground">Manage admin privileges</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">{isAdminMode ? 'Active' : 'Inactive'}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAdminAccess(!isAdminMode)}
                className="flex items-center gap-2"
              >
                <Edit3 className="h-4 w-4" />
                Toggle
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Enhanced HomeView with proper provider cards
  const HomeView = () => (
    <div className="space-y-6">
      {/* Admin Mode Indicator */}
      {isAdminMode && (
        <Alert className="bg-blue-50 border-blue-200">
          <Settings className="h-4 w-4" />
          <AlertDescription>
            <strong>Admin Mode:</strong> You're viewing the app with admin privileges.
            <Button variant="link" className="p-0 ml-2 h-auto" onClick={() => setCurrentView('admin-overview')}>
              Back to Admin Panel
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 text-white p-6 rounded-2xl overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <WayaWayaLogo size="md" showText={false} />
            <div>
              <h1 className="text-3xl font-bold">WAYA WAYA!</h1>
              <p className="text-lg opacity-90">Any service. Any time. Anywhere in South Africa.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4" />
            <span>24/7 Service Available</span>
            <Shield className="h-4 w-4" />
            <span>Verified Providers</span>
          </div>
        </div>
        <div className="absolute -top-4 -right-4 text-8xl opacity-10">🚀</div>
      </div>

      {/* Service Request Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Request a Service
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ServiceRequestModule
            onNavigate={handleNavigation}
            onRequestSubmit={handleServiceRequest}
          />
        </CardContent>
      </Card>

      {/* Available Providers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Available Providers
          </CardTitle>
        </CardHeader>
        <CardContent>
          {providersLoading ? (
            <div className="text-center py-8">Loading providers...</div>
          ) : providersError ? (
            <div className="text-center py-8 text-red-600">{providersError}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {providers.map((provider) => (
                <Card key={provider.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{provider.name.charAt(0)}</AvatarFallback>
                          {provider.image && <AvatarImage src={provider.image} alt={provider.name} />}
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{provider.name}</h3>
                          <p className="text-sm text-muted-foreground">{provider.service}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{provider.rating}</span>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{provider.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{provider.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>Response: {provider.responseTime}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span>{provider.currency} {provider.hourlyRate}/hour</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant={provider.available ? "default" : "secondary"}>
                        {provider.available ? "Available" : "Busy"}
                      </Badge>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startProviderChat(provider)}
                          className="flex items-center gap-1"
                        >
                          <MessageCircle className="h-4 w-4" />
                          Chat
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => startBooking(provider)}
                          className="flex items-center gap-1"
                        >
                          <Navigation className="h-4 w-4" />
                          Book
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4" onClick={() => setCurrentView('provider-registration')}>
          <Briefcase className="h-6 w-6" />
          <span className="text-sm">Become a Provider</span>
        </Button>
        <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4" onClick={() => setCurrentView('payment-management')}>
          <CreditCard className="h-6 w-6" />
          <span className="text-sm">Payment History</span>
        </Button>
        <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4" onClick={() => setCurrentView('client-management')}>
          <Users className="h-6 w-6" />
          <span className="text-sm">My Requests</span>
        </Button>
        <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4" onClick={() => setCurrentView('provider-dashboard')}>
          <Settings className="h-6 w-6" />
          <span className="text-sm">Dashboard</span>
        </Button>
      </div>
    </div>
  );

// ...existing code...
  };
// ...existing code...

  // Provider Trial Management Component
  const ProviderTrialManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => setCurrentView('admin-overview')}>
          ← Back
        </Button>
        <WayaWayaLogo size="sm" />
        <h1>Provider Trials</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Trials</CardTitle>
        </CardHeader>
        <CardContent>
          {providersLoading ? (
            <div className="text-center py-4">Loading providers...</div>
          ) : providersError ? (
            <div className="text-center py-4 text-red-600">{providersError}</div>
          ) : (
            providers.filter(p => p.trialDaysLeft !== undefined).map((provider) => (
              <div key={provider.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{provider.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{provider.name}</p>
                    <p className="text-sm text-muted-foreground">{provider.service}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className={`text-sm font-medium ${provider.trialDaysLeft > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {provider.trialDaysLeft > 0 ? `${provider.trialDaysLeft} days left` : 'Trial expired'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Commission due: R{provider.commissionDue ? provider.commissionDue.toFixed(2) : '0.00'}
                    </div>
                  </div>
                  <Badge variant={provider.trialDaysLeft > 0 ? 'default' : 'destructive'}>
                    {provider.trialDaysLeft > 0 ? 'Active' : 'Expired'}
                  </Badge>
                </div>
              </div>
            ))
          )}
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
            <h4 className="font-semibold">Payment Options</h4>
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
                onClick={() => alert('Manual Payment clicked')}
              >
                <Receipt className="h-6 w-6 mb-2" />
                Manual Payment
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Add this component inside your App component, before the return statement
  const DevelopmentStatus = () => {
    if (!import.meta.env.DEV) return null;
    
    return (
      <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-800 px-3 py-1 rounded text-xs">
        🚀 Dev Mode • API: {API_BASE_URL}
      </div>
    );
  };

  // Add missing function definitions
  const handleBookingChange = (field: string, value: string | number) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  };

  const handleLocationChange = (field: string, value: string | number | null) => {
    setBookingData(prev => ({
      ...prev,
      location: { ...prev.location, [field]: value }
    }));
  };

  const handleSubmitBooking = async () => {
    setBookingError('');
    if (!bookingData.serviceType || !bookingData.description) {
      setBookingError('Please fill in service type and description.');
      return;
    }
    
    try {
      const response = await apiClient.requests.submit(bookingData, authToken || '');
      const data = await response.json();
      
      if (response.ok) {
        alert(data.message || "Your service request has been submitted!");
        setCurrentView('home');
        setBookingData({
          serviceType: selectedService || '',
          description: '',
          preferredTime: '',
          location: { lat: null, lng: null, address: '' }
        });
        setUseCurrentLocation(false);
      } else {
        setBookingError(data.error || "Failed to submit request. Please try again.");
      }
    } catch (error) {
      console.error("Network error during booking submission:", error);
      setBookingError("Network error. Please check your connection and try again.");
    }
  };

  const addCustomService = () => {
    if (newCustomService.name && newCustomService.rate) {
      const service: CustomService = {
        id: Date.now(),
        ...newCustomService
      };
      setCustomServices([...customServices, service]);
      setNewCustomService({
        name: '',
        description: '',
        rate: '',
        category: 'other'
      });
      setShowCustomServiceForm(false);
    }
  };

  const removeCustomService = (id: number) => {
    setCustomServices(customServices.filter(service => service.id !== id));
  };

  const togglePredefinedService = (serviceName: string) => {
    setSelectedServices(prev =>
      prev.includes(serviceName)
        ? prev.filter(s => s !== serviceName)
        : [...prev, serviceName]
    );
  };

  const setAdminAccess = (access: boolean) => {
    // This function is used in the admin interface
    console.log('Admin access set to:', access);
  };

  return (
    <div className="min-h-screen bg-background">
      <DevelopmentStatus />
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b px-4 py-3">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <WayaWayaLogo size="sm" />
          <div className="flex items-center gap-2">
            {isAdminMode && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentView('admin-overview')}
              >
                <Settings className="h-4 w-4" />
              </Button>
            )}
            <Button variant="ghost" size="sm">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm">
              <User className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto p-4 pb-20">
        <Tabs value={currentView} onValueChange={setCurrentView}>
          <TabsContent value="home">
            <HomeView />
          </TabsContent>
          <TabsContent value="registration">
            <ProviderRegistration />
          </TabsContent>
          <TabsContent value="provider">
            <ProviderDashboard />
          </TabsContent>
          <TabsContent value="payment-management">
            <PaymentManagement onBack={() => setCurrentView('admin-overview')} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="max-w-md mx-auto flex">
          <Button
            variant={currentView === 'home' ? 'default' : 'ghost'}
            className="flex-1 h-16 rounded-none"
            onClick={() => setCurrentView('home')}
          >
            <div className="text-center">
              <Search className="h-5 w-5 mx-auto mb-1" />
              <span className="text-xs">Home</span>
            </div>
          </Button>
          <Button
            variant={currentView === 'service-request' ? 'default' : 'ghost'}
            className="flex-1 h-16 rounded-none"
            onClick={() => setCurrentView('service-request')}
          >
            <div className="text-center">
              <Clock className="h-5 w-5 mx-auto mb-1" />
              <span className="text-xs">Request</span>
            </div>
          </Button>
          <Button
            variant={currentView === 'provider' ? 'default' : 'ghost'}
            className="flex-1 h-16 rounded-none"
            onClick={() => setCurrentView('provider')}
          >
            <div className="text-center">
              <Shield className="h-5 w-5 mx-auto mb-1" />
              <span className="text-xs">Provider</span>
            </div>
          </Button>
          <Button
            variant="ghost"
            className="flex-1 h-16 rounded-none"
            onClick={() => setCurrentView('ratings-reviews')}
          >
            <div className="text-center">
              <Star className="h-5 w-5 mx-auto mb-1" />
              <span className="text-xs">Reviews</span>
            </div>
          </Button>
        </div>
      </nav>

      {/* Chat and Booking Systems */}
      <ChatSystemComponent />
      <BookingDialogComponent />
    </div>
  );
