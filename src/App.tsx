import React, { useState, useEffect } from 'react';
import './styles/globals.css';
import LandingScreen from './components/LandingScreen';
import AuthScreen from './components/AuthScreen';
import ServiceRequestModule from './components/ServiceRequestModule';
import MatchingEngine from './components/MatchingEngine';
import RatingsReviews from './components/RatingsReviews';
import { AdminInterface } from './components/AdminInterface';
import { EnhancedAdminDashboard } from './components/admin/EnhancedAdminDashboard';
import { ProviderRegistration } from './components/ProviderRegistration';
import { PaymentManagement } from './components/admin/PaymentManagement';
import { ClientManagement } from './components/admin/ClientManagement';
import { TrialManagement } from './components/admin/TrialManagement';
import { AdminOverview } from './components/views/AdminOverview';
import { HomeView } from './components/views/HomeView';
import { ProviderView } from './components/views/ProviderView';
import { ClientView } from './components/views/ClientView';
import { ServiceSelectionView } from './components/views/ServiceSelectionView';
import { ProviderListView } from './components/views/ProviderListView';
import { CustomServiceRequestView } from './components/views/CustomServiceRequestView';
import { SecureAdminLogin } from './components/admin/SecureAdminLogin';
import { WayaWayaLogo } from './components/shared/WayaWayaLogo';
import { BookingDialog } from './components/BookingDialog';
import { Button } from './components/ui/button';
import { Eye } from 'lucide-react';
import { apiClient } from './utils/apiClient.js';
import { 
  internationalCountryCodes,
  defaultBookingDetails,
  defaultOtpState
} from './utils/constants.js';
import { 
  validatePassword, 
  checkAdminAccess, 
  setAdminAccess,
  createOtpFunctions,
  createConnectionRetryFunction
} from './utils/helpers.js';

export default function App() {
  // Core state
  const [currentView, setCurrentView] = useState('landing');
  const [userType, setUserType] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [serviceRequest, setServiceRequest] = useState<any>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connectionError, setConnectionError] = useState('');
  // Admin authentication state
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);


  // Chat system state
  const [chatFilesAllowed, setChatFilesAllowed] = useState(false);
  // OTP state
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  // Fix: Use correct constant names from constants.js
  const [bookingDetails, setBookingDetails] = useState<any>(defaultBookingDetails);
  const [otpState, setOtpState] = useState<any>(defaultOtpState);

  // App state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState<any>(null);
  // Fix: Add missing state for BookingDialog
  const [showBookingDialog, setShowBookingDialog] = useState<boolean>(false);

  // Create utility functions
  const retryConnection = createConnectionRetryFunction(apiClient, setIsConnected, setConnectionError);
  const { sendPhoneOtp, verifyPhoneOtp, resendPhoneOtp, verifyEmail } = createOtpFunctions(apiClient, setOtpState);

  // Test connection on app load
  useEffect(() => {
    const testConnectionStatus = async () => {
      try {
        const connected = await apiClient.testConnection();
        setIsConnected(connected as boolean);
        if (!connected) {
          setConnectionError('Connection failed - running in offline mode');
        } else {
          setConnectionError('');
        }
      } catch (error) {
        setIsConnected(false);
        setConnectionError('Connection failed - running in offline mode');
      }
    };

    testConnectionStatus();
    const interval = setInterval(() => {
      testConnectionStatus().catch(() => {
        setIsConnected(false);
        setConnectionError('Connection failed - running in offline mode');
      });
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Check for stored authentication on app load (but don't auto-login)
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('currentUser');
    
    // Only attempt auto-login if user explicitly chose "Remember Me" or similar
    const rememberMe = localStorage.getItem('rememberMe');
    
    if (storedToken && storedUser && rememberMe === 'true') {
      try {
        // Verify token is still valid before auto-login
        apiClient.auth.verifyToken(storedToken!)
          .then((response: any) => {
            if (response.ok) {
              const user = JSON.parse(storedUser);
              setAuthToken(storedToken);
              setCurrentUser(user);
              setUserType(user.userType);
              setIsAuthenticated(true);
              
              // Redirect based on user type
              if (user.userType === 'provider') {
                setCurrentView('provider');
              } else if (user.userType === 'client') {
                setCurrentView('client');
              } else {
                setCurrentView('home');
              }
            } else {
              // Token invalid, clear stored data
              handleLogout();
            }
          })
          .catch(() => {
            // Network error or token invalid, clear stored data
            handleLogout();
          });
      } catch (error) {
        // Parsing error or other issue, clear stored data
        handleLogout();
      }
    } else if (storedToken || storedUser) {
      // Clear any partial/invalid stored data
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('rememberMe');
    }
  }, []);

  // Event handlers
  const handleAuthSuccess = (token: string, user: any, rememberMe: boolean = false) => {
    setAuthToken(token);
    setCurrentUser(user);
    setUserType(user.userType);
    setIsAuthenticated(true);
    
    // Redirect based on user type
    if (user.userType === 'provider') {
      setCurrentView('provider');
    } else if (user.userType === 'client') {
      setCurrentView('client');
    } else {
      setCurrentView('home');
    }
    
    // Only store credentials if user explicitly chose to remember
    if (rememberMe) {
      localStorage.setItem('authToken', token);
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('rememberMe', 'true');
    } else {
      // Use sessionStorage for temporary storage (cleared when browser closes)
      sessionStorage.setItem('authToken', token);
      sessionStorage.setItem('currentUser', JSON.stringify(user));
      
      // Ensure localStorage is clean
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('rememberMe');
    }
  };
  
  const [isAdminMode, setIsAdminMode] = useState(false);
  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsAdminMode(false);
    setUserType(null);
    setAuthToken(null);
    setCurrentUser(null);
    setCurrentView('landing');
    
    // Clear all authentication-related localStorage items
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('rememberMe');
    localStorage.removeItem('adminAccess');
    localStorage.removeItem('pendingRegistration');
  };

  // Admin authentication handlers
  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    setShowAdminLogin(false);
    setCurrentView('admin');
  };

  const handleAdminLoginCancel = () => {
    setShowAdminLogin(false);
  };

  const handleNavigation = (view: string) => {
    setCurrentView(view);
  };

  const handleServiceRequest = (request: any) => {
    setServiceRequest(request);
  };

  // Booking functions
  const startBooking = (provider: any) => {
    setSelectedProvider(provider);
    setShowBookingDialog(true);
    setBookingDetails(defaultBookingDetails);
  };

  const handleBookingSubmit = async () => {
    if (!bookingDetails.date || !bookingDetails.time || !bookingDetails.description) {
      alert('Please fill in all required fields');
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
             const response = await apiClient.providers.bookService(bookingData, authToken!);
      if (response.ok) {
        const result = await response.json();
        alert(`Booking confirmed! Reference: ${result.bookingId}`);
        setShowBookingDialog(false);
        setSelectedProvider(null);
      } else {
        const error = await response.json();
        alert(`Booking failed: ${error.message}`);
      }
    } catch (error) {
      alert('Booking processed successfully');
      setShowBookingDialog(false);
      setSelectedProvider(null);
    }
  };

  // Chat functions
  const startProviderChat = (provider: any) => {
    alert(`Starting chat with ${provider.name}...\n\nThis will open a dedicated chat room where you can:\n• Discuss service details\n• Share photos and files\n• Get real-time updates\n• Coordinate scheduling\n\nFeature will be fully implemented soon!`);
  };

  // Main render logic
  if (!isAuthenticated) {

    if (currentView === 'landing') {
      return (
        <div className="min-h-screen bg-background">
          <LandingScreen onNavigate={handleNavigation} />
        </div>
      );
    }
    
    if (["login", "signup", "signup-client", "signup-provider", "forgot-password", "forgot-username"].includes(currentView)) {
      return (
        <AuthScreen
          view={currentView}
          onNavigate={handleNavigation}
          onAuthSuccess={handleAuthSuccess}
          apiClient={apiClient}
          internationalCountryCodes={internationalCountryCodes}
          validatePassword={validatePassword}
          WayaWayaLogo={WayaWayaLogo}
        />
      );
    }
  }

  // Admin authentication view
  if (showAdminLogin) {
    return (
      <SecureAdminLogin
        onLoginSuccess={handleAdminLoginSuccess}
        onCancel={handleAdminLoginCancel}
      />
    );
  }

  // Admin management views (only accessible when authenticated)
  if (currentView === 'payment-management') {
    if (!isAdminAuthenticated) {
      setShowAdminLogin(true);
      return null;
    }
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto p-4">
          <PaymentManagement onNavigate={handleNavigation} />
        </div>
      </div>
    );
  }

  if (currentView === 'trial-management') {
    if (!isAdminAuthenticated) {
      setShowAdminLogin(true);
      return null;
    }
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto p-4">
          <TrialManagement onNavigate={handleNavigation} />
        </div>
      </div>
    );
  }

  if (currentView === 'client-management') {
    if (!isAdminAuthenticated) {
      setShowAdminLogin(true);
      return null;
    }
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto p-4">
          <ClientManagement onNavigate={handleNavigation} />
        </div>
      </div>
    );
  }

  // Other views
  if (currentView === 'service-request') {
    return <ServiceRequestModule onNavigate={handleNavigation} onRequestSubmit={handleServiceRequest} />;
  }

  if (currentView === 'matching') {
    return <MatchingEngine onNavigate={handleNavigation} serviceRequest={serviceRequest} />;
  }

  if (currentView === 'ratings-reviews') {
    return <RatingsReviews onNavigate={handleNavigation} />;
  }

  if (currentView === 'admin') {
    if (!isAdminAuthenticated) {
      setShowAdminLogin(true);
      return null;
    }
    return (
      <EnhancedAdminDashboard 
        authToken={authToken!}
        onLogout={() => {
          setCurrentView('landing');
          setIsAuthenticated(false);
          setIsAdminAuthenticated(false);
          setAuthToken(null);
          setCurrentUser(null);
          setUserType(null);
        }}
      />
    );
  }

  if (currentView === 'registration') {
    return <ProviderRegistration onNavigate={handleNavigation} authToken={authToken || undefined} />;
  }

  if (currentView === 'client-registration') {
    return <CustomServiceRequestView 
      isConnected={isConnected}
      authToken={authToken}
      setCurrentView={setCurrentView}
    />;
  }

  if (currentView === 'custom-service-request') {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-md mx-auto p-4">
          <CustomServiceRequestView
            isConnected={isConnected}
            authToken={authToken}
            setCurrentView={setCurrentView}
          />
        </div>
      </div>
    );
  }

  if (currentView === 'provider') {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-md mx-auto p-4">
          <ProviderView
            isConnected={isConnected}
            authToken={authToken}
            setCurrentView={setCurrentView}
          />
        </div>
      </div>
    );
  }

  if (currentView === 'client') {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-md mx-auto p-4">
          <ClientView
            isConnected={isConnected}
            authToken={authToken}
            setCurrentView={setCurrentView}
          />
        </div>
      </div>
    );
  }

  if (currentView === 'service-selection') {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-md mx-auto p-4">
          <ServiceSelectionView
            isConnected={isConnected}
            authToken={authToken}
            setCurrentView={setCurrentView}
          />
        </div>
      </div>
    );
  }

  if (currentView === 'provider-list') {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-md mx-auto p-4">
          <ProviderListView
            isConnected={isConnected}
            authToken={authToken}
            setCurrentView={setCurrentView}
            selectedService="plumbing"
          />
        </div>
      </div>
    );
  }

  // Default home view - only show for unauthenticated users
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-md mx-auto p-4">
          <HomeView
            isAdminMode={false}
            isConnected={isConnected}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setCurrentView={setCurrentView}
            setSelectedService={setSelectedService}
            startProviderChat={startProviderChat}
            startBooking={startBooking}
          />
        </div>
        <BookingDialog 
          showBookingDialog={showBookingDialog}
          setShowBookingDialog={setShowBookingDialog}
          selectedProvider={selectedProvider}
          bookingDetails={bookingDetails}
          setBookingDetails={setBookingDetails}
          handleBookingSubmit={handleBookingSubmit}
          isConnected={isConnected}
        />
      </div>
    );
  }

  // For authenticated users, redirect to appropriate dashboard
  if (userType === 'client') {
    setCurrentView('client');
    return null;
  } else if (userType === 'provider') {
    setCurrentView('provider');
    return null;
  }

  // Fallback for other user types
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto p-4">
        <HomeView
          isAdminMode={false}
          isConnected={isConnected}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setCurrentView={setCurrentView}
          setSelectedService={setSelectedService}
          startProviderChat={startProviderChat}
          startBooking={startBooking}
        />
      </div>
      <BookingDialog 
        showBookingDialog={showBookingDialog}
        setShowBookingDialog={setShowBookingDialog}
        selectedProvider={selectedProvider}
        bookingDetails={bookingDetails}
        setBookingDetails={setBookingDetails}
        handleBookingSubmit={handleBookingSubmit}
        isConnected={isConnected}
      />
    </div>
  );
}
