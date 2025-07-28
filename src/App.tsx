import React, { useState, useEffect } from 'react';
import './styles/globals.css';
import LandingScreen from './components/LandingScreen';
import AuthScreen from './components/AuthScreen';
//import apiClient, { parseApiResponse, testBackendConnection } from './types/api';
import ServiceRequestModule from './components/ServiceRequestModule';
import MatchingEngine from './components/MatchingEngine';
import RatingsReviews from './components/RatingsReviews';
import AdminInterface from './components/AdminInterface';
import { Search, MapPin, Star, Clock, Shield, Zap, Phone, Menu, User, Bell, Upload, CheckCircle, Plus, Briefcase, X, Edit3, MessageCircle, Navigation, CreditCard, Copy, Settings, Eye, Database, FileText, DollarSign, AlertTriangle, Ban, Lock, Unlock, Calendar, TrendingUp, Users, Receipt, Wallet, Send, Paperclip, Image, Video, FileIcon, Download, BookOpen, ArrowRight } from 'lucide-react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Checkbox } from './components/ui/checkbox';
import { Textarea } from './components/ui/textarea';
import { Progress } from './components/ui/progress';
import { Alert, AlertDescription } from './components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './components/ui/dialog';
import { Separator } from './components/ui/separator';
import { checkEnvironmentAccess, checkAdminPassword } from './utils/adminAccess';

// --- DEVELOPMENT/TESTING API CLIENT (localhost:5000) ---
const getApiBaseUrl = () => {
  if (import.meta.env.DEV) {
    return 'http://localhost:5000/api';
  }
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
};

const API_BASE_URL = getApiBaseUrl();

const apiClient = {
  auth: {
    login: async (credentials) => {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      return response;
    },

    sendPhoneOtp: async (userData) => {
      const response = await fetch(`${API_BASE_URL}/auth/send-phone-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      return response;
    },

    verifyPhoneOtp: async (data) => {
      const response = await fetch(`${API_BASE_URL}/auth/verify-phone-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return response;
    },

    resendPhoneOtp: async (data) => {
      const response = await fetch(`${API_BASE_URL}/auth/resend-phone-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return response;
    },

    verifyEmail: async (data) => {
      const response = await fetch(`${API_BASE_URL}/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return response;
    },

    resendEmailVerification: async (data) => {
      const response = await fetch(`${API_BASE_URL}/auth/resend-email-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return response;
    },

    forgotPassword: async (data) => {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return response;
    },

    forgotUsername: async (data) => {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-username`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return response;
    },

    resetPassword: async (data) => {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return response;
    },

    verifyToken: async (token) => {
      const response = await fetch(`${API_BASE_URL}/auth/verify-token`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response;
    },

    signup: async (userData) => {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      return response;
    }
  },

  requests: {
    submit: async (requestData, token) => {
      const response = await fetch(`${API_BASE_URL}/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });
      return response;
    },

    getMatches: async (requestId, token) => {
      const response = await fetch(`${API_BASE_URL}/requests/${requestId}/matches`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response;
    }
  },

  providers: {
    register: async (registrationData, token) => {
      const response = await fetch(`${API_BASE_URL}/providers/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(registrationData),
      });
      return response;
    },

    getProfile: async (token) => {
      const response = await fetch(`${API_BASE_URL}/providers/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response;
    },

    updateAvailability: async (availability, token) => {
      const response = await fetch(`${API_BASE_URL}/providers/availability`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ available: availability }),
      });
      return response;
    },

    processPayment: async (paymentData, token) => {
      const response = await fetch(`${API_BASE_URL}/providers/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(paymentData),
      });
      return response;
    },

    bookService: async (bookingData, token) => {
      const response = await fetch(`${API_BASE_URL}/providers/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });
      return response;
    }
  },

  payments: {
    processEFT: async (paymentData, token) => {
      const response = await fetch(`${API_BASE_URL}/payments/eft`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(paymentData),
      });
      return response;
    },

    getCommissions: async (token) => {
      const response = await fetch(`${API_BASE_URL}/payments/commissions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response;
    },

    collectCommission: async (providerId, token) => {
      const response = await fetch(`${API_BASE_URL}/payments/collect-commission`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ providerId }),
      });
      return response;
    }
  },

  chat: {
    sendMessage: async (messageData, token) => {
      const response = await fetch(`${API_BASE_URL}/chat/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(messageData),
      });
      return response;
    },

    uploadFile: async (fileData, token) => {
      const response = await fetch(`${API_BASE_URL}/chat/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: fileData,
      });
      return response;
    },

    authorizeFileUpload: async (chatId, token) => {
      const response = await fetch(`${API_BASE_URL}/chat/authorize-upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ chatId }),
      });
      return response;
    },

    getProviderMessages: async (providerId, token) => {
      const response = await fetch(`${API_BASE_URL}/chat/provider/${providerId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response;
    }
  },

  admin: {
    getStats: async (token) => {
      const response = await fetch(`${API_BASE_URL}/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response;
    },

    getPendingProviders: async (token) => {
      const response = await fetch(`${API_BASE_URL}/admin/providers/pending`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response;
    },

    approveProvider: async (providerId, token) => {
      const response = await fetch(`${API_BASE_URL}/admin/providers/${providerId}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response;
    },

    rejectProvider: async (providerId, token) => {
      const response = await fetch(`${API_BASE_URL}/admin/providers/${providerId}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response;
    },

    blockClient: async (clientId, reason, token) => {
      const response = await fetch(`${API_BASE_URL}/admin/clients/${clientId}/block`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ reason }),
      });
      return response;
    },

    unblockClient: async (clientId, token) => {
      const response = await fetch(`${API_BASE_URL}/admin/clients/${clientId}/unblock`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response;
    }
  }
};

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

// International Country Codes with guaranteed unique IDs
const internationalCountryCodes = [
  { id: 'cc-za', code: '+27', country: 'South Africa', flag: '🇿🇦' },
  { id: 'cc-us', code: '+1', country: 'United States', flag: '🇺🇸' },
  { id: 'cc-ca', code: '+1', country: 'Canada', flag: '🇨🇦' },
  { id: 'cc-gb', code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
  { id: 'cc-de', code: '+49', country: 'Germany', flag: '🇩🇪' },
  { id: 'cc-fr', code: '+33', country: 'France', flag: '🇫🇷' },
  { id: 'cc-es', code: '+34', country: 'Spain', flag: '🇪🇸' },
  { id: 'cc-it', code: '+39', country: 'Italy', flag: '🇮🇹' },
  { id: 'cc-au', code: '+61', country: 'Australia', flag: '🇦🇺' },
  { id: 'cc-in', code: '+91', country: 'India', flag: '🇮🇳' },
  { id: 'cc-cn', code: '+86', country: 'China', flag: '🇨🇳' },
  { id: 'cc-jp', code: '+81', country: 'Japan', flag: '🇯🇵' },
  { id: 'cc-br', code: '+55', country: 'Brazil', flag: '🇧🇷' },
  { id: 'cc-mx', code: '+52', country: 'Mexico', flag: '🇲🇽' },
  { id: 'cc-ar', code: '+54', country: 'Argentina', flag: '🇦🇷' },
  { id: 'cc-ru', code: '+7', country: 'Russia', flag: '🇷🇺' },
  { id: 'cc-kr', code: '+82', country: 'South Korea', flag: '🇰🇷' },
  { id: 'cc-sg', code: '+65', country: 'Singapore', flag: '🇸🇬' },
  { id: 'cc-ae', code: '+971', country: 'United Arab Emirates', flag: '🇦🇪' },
  { id: 'cc-ng', code: '+234', country: 'Nigeria', flag: '🇳🇬' },
  { id: 'cc-ke', code: '+254', country: 'Kenya', flag: '🇰🇪' },
  { id: 'cc-gh', code: '+233', country: 'Ghana', flag: '🇬🇭' },
  { id: 'cc-eg', code: '+20', country: 'Egypt', flag: '🇪🇬' },
  { id: 'cc-ma', code: '+212', country: 'Morocco', flag: '🇲🇦' },
  { id: 'cc-th', code: '+66', country: 'Thailand', flag: '🇹🇭' },
  { id: 'cc-ph', code: '+63', country: 'Philippines', flag: '🇵🇭' },
  { id: 'cc-id', code: '+62', country: 'Indonesia', flag: '🇮🇩' },
  { id: 'cc-my', code: '+60', country: 'Malaysia', flag: '🇲🇾' },
  { id: 'cc-vn', code: '+84', country: 'Vietnam', flag: '🇻🇳' },
  { id: 'cc-pk', code: '+92', country: 'Pakistan', flag: '🇵🇰' }
];

// Password validation function
const validatePassword = (password) => {
  const minLength = password.length >= 8;
  const hasDigit = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  return {
    isValid: minLength && hasDigit && hasSpecialChar,
    minLength,
    hasDigit,
    hasSpecialChar
  };
};

// Mock data for services and providers
const serviceCategories = [
  { name: 'Plumbing', icon: '🔧', color: 'bg-blue-500' },
  { name: 'Electrical', icon: '⚡', color: 'bg-yellow-500' },
  { name: 'Cleaning', icon: '🧽', color: 'bg-green-500' },
  { name: 'Beauty', icon: '💄', color: 'bg-pink-500' },
  { name: 'Transport', icon: '🚗', color: 'bg-purple-500' },
  { name: 'Security', icon: '🛡️', color: 'bg-red-500' },
  { name: 'Tutoring', icon: '📚', color: 'bg-indigo-500' },
  { name: 'Garden', icon: '🌱', color: 'bg-emerald-500' },
];

const featuredProviders = [
  {
    id: 1,
    name: 'Ahmed Hassan',
    service: 'Electrician',
    rating: 4.9,
    reviews: 127,
    distance: '2.3 km',
    available: true,
    hourlyRate: 250,
    currency: 'R',
    image: null,
    trialDaysLeft: 3,
    commissionDue: 145.50,
    phone: '+27 82 123 4567',
    responseTime: '~15 min'
  },
  {
    id: 2,
    name: 'Maria Santos',
    service: 'House Cleaning',
    rating: 4.8,
    reviews: 89,
    distance: '1.8 km',
    available: true,
    hourlyRate: 180,
    currency: 'R',
    image: null,
    trialDaysLeft: 0,
    commissionDue: 89.25,
    phone: '+27 83 456 7890',
    responseTime: '~5 min'
  },
  {
    id: 3,
    name: 'James Wilson',
    service: 'Plumber',
    rating: 4.7,
    reviews: 156,
    distance: '3.1 km',
    available: false,
    hourlyRate: 300,
    currency: 'R',
    image: null,
    trialDaysLeft: 7,
    commissionDue: 230.75,
    phone: '+27 84 789 0123',
    responseTime: '~30 min'
  },
];

// Mock blocked clients data
const blockedClients = [
  { id: 1, name: 'John Doe', email: 'john@example.com', reason: 'Non-payment of R450.00', blockedDate: '2024-01-15', amountDue: 450.00 },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', reason: 'Multiple payment failures', blockedDate: '2024-01-10', amountDue: 320.00 },
];

// --- ADMIN ACCESS FUNCTIONS ---
const checkAdminAccess = () => {
  return checkEnvironmentAccess();
};

const setAdminAccess = (access) => {
  localStorage.setItem('adminAccess', access.toString());
};

export default function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [userType, setUserType] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [serviceRequest, setServiceRequest] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminKey, setAdminKey] = useState('');

  // Chat system state
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatFilesAllowed, setChatFilesAllowed] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [currentChatProvider, setCurrentChatProvider] = useState(null);
  const [providerChats, setProviderChats] = useState({});

  // Booking system state
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({
    date: '',
    time: '',
    description: '',
    urgency: 'normal',
    location: '',
    estimatedHours: 1
  });

  // Original state for the main app
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [registrationStep, setRegistrationStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState([]);
  const [customServices, setCustomServices] = useState([]);
  const [showCustomServiceForm, setShowCustomServiceForm] = useState(false);
  const [newCustomService, setNewCustomService] = useState({
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

  // Check for admin access on app load
  useEffect(() => {
    const hasAdminAccess = checkEnvironmentAccess();
    if (hasAdminAccess && import.meta.env.DEV) {
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
  }, []);

  // Handle auth success from AuthScreen
  const handleAuthSuccess = (token, user) => {
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
    const isValid = await checkAdminPassword(adminKey);
    
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
      alert('Invalid admin password');
    }
  };

  const handleNavigation = (view) => {
    setCurrentView(view);
  };

  const handleServiceRequest = (request) => {
    setServiceRequest(request);
  };

  // Provider Chat Functions
  const startProviderChat = async (provider) => {
    setCurrentChatProvider(provider);
    setShowChat(true);
    
    // Load existing messages for this provider
    if (!providerChats[provider.id]) {
      try {
        const response = await apiClient.chat.getProviderMessages(provider.id, authToken);
        if (response.ok) {
          const messages = await response.json();
          setProviderChats(prev => ({
            ...prev,
            [provider.id]: messages
          }));
        }
      } catch (error) {
        console.error('Failed to load provider messages:', error);
      }
    }
    
    // Set current chat messages
    setChatMessages(providerChats[provider.id] || []);
  };

  const sendProviderMessage = async () => {
    if (!newMessage.trim() && selectedFiles.length === 0) return;
    if (!currentChatProvider) return;

    const message = {
      id: Date.now(),
      text: newMessage,
      files: selectedFiles,
      sender: currentUser.name,
      timestamp: new Date().toISOString(),
      type: 'user',
      providerId: currentChatProvider.id
    };

    // Update local state
    const updatedMessages = [...chatMessages, message];
    setChatMessages(updatedMessages);
    setProviderChats(prev => ({
      ...prev,
      [currentChatProvider.id]: updatedMessages
    }));

    setNewMessage('');
    setSelectedFiles([]);

    try {
      await apiClient.chat.sendMessage({
        ...message,
        providerId: currentChatProvider.id
      }, authToken);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  // Booking Functions
  const startBooking = (provider) => {
    setSelectedProvider(provider);
    setShowBookingDialog(true);
    setBookingDetails({
      date: '',
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

    const bookingData = {
      providerId: selectedProvider.id,
      providerName: selectedProvider.name,
      service: selectedProvider.service,
      ...bookingDetails,
      totalEstimate: selectedProvider.hourlyRate * bookingDetails.estimatedHours,
      bookingDate: new Date().toISOString()
    };

    try {
      const response = await apiClient.providers.bookService(bookingData, authToken);
      if (response.ok) {
        const result = await response.json();
        alert(`Booking confirmed! Reference: ${result.bookingId}`);
        setShowBookingDialog(false);
        setSelectedProvider(null);
        
        // Optionally start a chat with the provider
        startProviderChat(selectedProvider);
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
      sender: currentUser.name,
      timestamp: new Date().toISOString(),
      type: 'user'
    };

    setChatMessages(prev => [...prev, message]);
    setNewMessage('');
    setSelectedFiles([]);

    try {
      await apiClient.chat.sendMessage(message, authToken);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const toggleFileUploadPermission = () => {
    setChatFilesAllowed(!chatFilesAllowed);
  };

  // Enhanced Chat Component with Provider Context
  const ChatSystem = () => (
    <>
      {/* Chat Trigger Button - Only show when not in provider chat */}
      {!currentChatProvider && (
        <button 
          onClick={() => setShowChat(true)}
          className="fixed bottom-24 right-4 rounded-full h-12 w-12 shadow-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors z-40"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat Dialog */}
      <Dialog open={showChat} onOpenChange={(open) => {
        setShowChat(open);
        if (!open) {
          setCurrentChatProvider(null);
        }
      }}>
        <DialogContent className="sm:max-w-md h-[80vh] flex flex-col p-0">
          <DialogHeader className="p-6 pb-4">
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              {currentChatProvider ? (
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {currentChatProvider.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span>Chat with {currentChatProvider.name}</span>
                </div>
              ) : (
                'Service Chat'
              )}
              {isAdminMode && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={toggleFileUploadPermission}
                  className="ml-auto"
                >
                  {chatFilesAllowed ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                  {chatFilesAllowed ? 'Files Allowed' : 'Files Locked'}
                </Button>
              )}
            </DialogTitle>
            <DialogDescription>
              {currentChatProvider ? (
                <div className="flex items-center gap-4 text-sm">
                  <span>{currentChatProvider.service}</span>
                  <Badge variant={currentChatProvider.available ? "default" : "secondary"}>
                    {currentChatProvider.available ? "Available" : "Busy"}
                  </Badge>
                  <span className="text-muted-foreground">
                    Responds in {currentChatProvider.responseTime}
                  </span>
                </div>
              ) : (
                'Chat with service providers about your requests'
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 flex flex-col min-h-0 px-6">
            <div className="flex-1 overflow-y-auto space-y-4 pb-4">
              {chatMessages.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>
                    {currentChatProvider 
                      ? `Start a conversation with ${currentChatProvider.name}` 
                      : 'Start a conversation about your service request'
                    }
                  </p>
                </div>
              ) : (
                chatMessages.map((message) => (
                  <div key={message.id} className="flex flex-col space-y-2">
                    <div className="flex items-start gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{message.sender.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 bg-muted p-3 rounded-lg">
                        <p className="text-sm font-medium">{message.sender}</p>
                        <p className="text-sm">{message.text}</p>
                        {message.files && message.files.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {message.files.map((file, index) => (
                              <div key={index} className="flex items-center gap-2 text-xs bg-background p-2 rounded">
                                {file.type?.startsWith('image/') ? <Image className="h-4 w-4" /> :
                                 file.type?.startsWith('video/') ? <Video className="h-4 w-4" /> :
                                 <FileIcon className="h-4 w-4" />}
                                <span>{file.name}</span>
                                <Download className="h-3 w-3 ml-auto cursor-pointer" />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="border-t pt-4 pb-6 space-y-3">
              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Selected Files:</p>
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm bg-muted p-2 rounded">
                      {file.type?.startsWith('image/') ? <Image className="h-4 w-4" /> :
                       file.type?.startsWith('video/') ? <Video className="h-4 w-4" /> :
                       <FileIcon className="h-4 w-4" />}
                      <span className="flex-1">{file.name}</span>
                      <Button variant="ghost" size="sm" onClick={() => removeFile(index)}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-1"
                />
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*,.pdf,.doc,.docx"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                  disabled={!chatFilesAllowed}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('file-upload')?.click()}
                  disabled={!chatFilesAllowed}
                  title={chatFilesAllowed ? "Upload files" : "File upload disabled by admin"}
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button onClick={sendMessage} size="sm">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              {!chatFilesAllowed && (
                <Alert className="bg-amber-50 border-amber-200">
                  <Lock className="h-4 w-4" />
                  <AlertDescription className="text-amber-800">
                    File uploads are locked. Admin authorization required.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );

  // Enhanced Booking Dialog
  const BookingDialog = () => (
    <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Book {selectedProvider?.name}
          </DialogTitle>
          <DialogDescription>
            {selectedProvider?.service} • R{selectedProvider?.hourlyRate}/hour
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <Input
                type="date"
                value={bookingDetails.date}
                onChange={(e) => setBookingDetails(prev => ({ ...prev, date: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Time</label>
              <Input
                type="time"
                value={bookingDetails.time}
                onChange={(e) => setBookingDetails(prev => ({ ...prev, time: e.target.value }))}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Service Description</label>
            <Textarea
              placeholder="Describe what you need done..."
              value={bookingDetails.description}
              onChange={(e) => setBookingDetails(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <Input
              placeholder="Enter your address"
              value={bookingDetails.location}
              onChange={(e) => setBookingDetails(prev => ({ ...prev, location: e.target.value }))}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Urgency</label>
              <Select value={bookingDetails.urgency} onValueChange={(value) => setBookingDetails(prev => ({ ...prev, urgency: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Priority</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Estimated Hours</label>
              <Select value={bookingDetails.estimatedHours.toString()} onValueChange={(value) => setBookingDetails(prev => ({ ...prev, estimatedHours: parseInt(value) }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 hour</SelectItem>
                  <SelectItem value="2">2 hours</SelectItem>
                  <SelectItem value="3">3 hours</SelectItem>
                  <SelectItem value="4">4 hours</SelectItem>
                  <SelectItem value="8">Full day (8 hours)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Estimated Total:</span>
              <span className="text-lg font-bold">
                R{(selectedProvider?.hourlyRate || 0) * bookingDetails.estimatedHours}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Final amount may vary based on actual work completed
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={handleBookingSubmit} className="flex-1">
              <CheckCircle className="h-4 w-4 mr-2" />
              Confirm Booking
            </Button>
            <Button variant="outline" onClick={() => setShowBookingDialog(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  // Payment Management Component
  const PaymentManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => setCurrentView('admin-overview')}>
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
            <div className="text-2xl font-bold">{blockedClients.length}</div>
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
              {blockedClients.map((client) => (
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
  const ProviderTrialManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => setCurrentView('admin-overview')}>
          ← Back
        </Button>
        <WayaWayaLogo size="sm" />
        <h1>Provider Trial Management</h1>
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

          <div className="space-y-3">
            <h4 className="font-semibold">Active Trials</h4>
            {featuredProviders.map((provider) => (
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
                      Commission due: R{provider.commissionDue.toFixed(2)}
                    </div>
                  </div>
                  <Badge variant={provider.trialDaysLeft > 0 ? 'default' : 'destructive'}>
                    {provider.trialDaysLeft > 0 ? 'Active' : 'Expired'}
                  </Badge>
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

  // Enhanced Admin Overview Component
  const AdminOverview = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <WayaWayaLogo size="lg" />
        <div>
          <h1>Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">Testing Backend: {API_BASE_URL}</p>
        </div>
      </div>

      <Alert>
        <Database className="h-4 w-4" />
        <AlertDescription>
          <strong>Development Mode Active:</strong> Connected to localhost:5000/api for backend testing.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* App Views */}
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setCurrentView('home')}>
          <CardContent className="p-6 text-center">
            <Search className="h-12 w-12 mx-auto mb-4 text-blue-600" />
            <h3 className="font-semibold">Client View</h3>
            <p className="text-sm text-muted-foreground">Browse services & request</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setCurrentView('provider')}>
          <CardContent className="p-6 text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-green-600" />
            <h3 className="font-semibold">Provider View</h3>
            <p className="text-sm text-muted-foreground">Provider dashboard</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setCurrentView('registration')}>
          <CardContent className="p-6 text-center">
            <User className="h-12 w-12 mx-auto mb-4 text-purple-600" />
            <h3 className="font-semibold">Registration</h3>
            <p className="text-sm text-muted-foreground">Provider signup flow</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setCurrentView('service-request')}>
          <CardContent className="p-6 text-center">
            <Clock className="h-12 w-12 mx-auto mb-4 text-orange-600" />
            <h3 className="font-semibold">Service Request</h3>
            <p className="text-sm text-muted-foreground">Request a service</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setCurrentView('matching')}>
          <CardContent className="p-6 text-center">
            <Zap className="h-12 w-12 mx-auto mb-4 text-yellow-600" />
            <h3 className="font-semibold">Matching Engine</h3>
            <p className="text-sm text-muted-foreground">Provider matching</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setCurrentView('ratings-reviews')}>
          <CardContent className="p-6 text-center">
            <Star className="h-12 w-12 mx-auto mb-4 text-pink-600" />
            <h3 className="font-semibold">Ratings & Reviews</h3>
            <p className="text-sm text-muted-foreground">Review system</p>
          </CardContent>
        </Card>

        {/* Management Views */}
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setCurrentView('payment-management')}>
          <CardContent className="p-6 text-center">
            <CreditCard className="h-12 w-12 mx-auto mb-4 text-blue-600" />
            <h3 className="font-semibold">Payment Management</h3>
            <p className="text-sm text-muted-foreground">EFT & Commission</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setCurrentView('trial-management')}>
          <CardContent className="p-6 text-center">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-green-600" />
            <h3 className="font-semibold">Trial Management</h3>
            <p className="text-sm text-muted-foreground">7-day trials & fees</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setCurrentView('client-management')}>
          <CardContent className="p-6 text-center">
            <Users className="h-12 w-12 mx-auto mb-4 text-purple-600" />
            <h3 className="font-semibold">Client Management</h3>
            <p className="text-sm text-muted-foreground">Blocking & payments</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setCurrentView('admin')}>
          <CardContent className="p-6 text-center">
            <Settings className="h-12 w-12 mx-auto mb-4 text-red-600" />
            <h3 className="font-semibold">Admin Interface</h3>
            <p className="text-sm text-muted-foreground">Manage platform</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setCurrentView('login')}>
          <CardContent className="p-6 text-center">
            <User className="h-12 w-12 mx-auto mb-4 text-indigo-600" />
            <h3 className="font-semibold">Auth System</h3>
            <p className="text-sm text-muted-foreground">Login/Signup flows</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setShowChat(true)}>
          <CardContent className="p-6 text-center">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 text-blue-600" />
            <h3 className="font-semibold">Chat System</h3>
            <p className="text-sm text-muted-foreground">File upload enabled</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <h4 className="font-bold mb-2 text-blue-800">📡 API Testing Info</h4>
          <div className="text-sm text-blue-700 space-y-1">
            <p>• Backend URL: <code className="bg-blue-100 px-1 rounded">{API_BASE_URL}</code></p>
            <p>• Admin Mode: Active (bypass authentication)</p>
            <p>• Currency: South African Rand (ZAR) only</p>
            <p>• All API calls will be made to your localhost backend</p>
            <p>• Check browser network tab to monitor requests</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button 
          onClick={handleLogout} 
          variant="outline"
          className="flex-1"
        >
          Exit Admin Mode
        </Button>
        <Button 
          onClick={() => window.location.reload()} 
          variant="default"
          className="flex-1"
        >
          🔄 Reload App
        </Button>
      </div>
    </div>
  );

  // Show admin login if not authenticated and no admin access
  if (!isAuthenticated && !isAdminMode) {
    if (showAdminLogin) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <Card>
              <CardHeader>
                <div className="text-center">
                  <WayaWayaLogo size="md" />
                  <CardTitle className="mt-4">🔧 Admin Access</CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">
                    Enter admin key to access development panel
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  type="password"
                  placeholder="Enter admin key"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                />
                <div className="flex gap-2">
                  <Button onClick={handleAdminLogin} className="flex-1">
                    Access Admin Panel
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAdminLogin(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
                <div className="text-center">
                  <Button 
                    variant="link" 
                    onClick={() => setCurrentView('landing')}
                    className="text-sm"
                  >
                    Go to Regular App
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    if (currentView === 'landing') {
      return (
        <div className="min-h-screen bg-background">
          <LandingScreen onNavigate={handleNavigation} />
          {/* Admin Access Button - Only show in development */}
          {import.meta.env.DEV && (
            <div className="fixed bottom-4 right-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdminLogin(true)}
                className="bg-white/90 backdrop-blur-sm shadow-lg"
              >
                <Settings className="h-4 w-4 mr-2" />
                Admin
              </Button>
            </div>
          )}
        </div>
      );
    }
    
    if (['login', 'signup', 'signup-client', 'signup-provider', 'forgot-password', 'forgot-username'].includes(currentView)) {
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

  // Show admin overview in admin mode
  if (isAdminMode && currentView === 'admin-overview') {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto p-4">
          <AdminOverview />
        </div>
        <ChatSystem />
        <BookingDialog />
      </div>
    );
  }

  // Show specialized admin components
  if (currentView === 'payment-management') {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto p-4">
          <PaymentManagement />
        </div>
        <ChatSystem />
        <BookingDialog />
      </div>
    );
  }

  if (currentView === 'trial-management') {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto p-4">
          <ProviderTrialManagement />
        </div>
        <ChatSystem />
        <BookingDialog />
      </div>
    );
  }

  if (currentView === 'client-management') {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto p-4">
          <ClientManagement />
        </div>
        <ChatSystem />
        <BookingDialog />
      </div>
    );
  }

  // Show specialized components
  if (currentView === 'service-request') {
    return (
      <div>
        <ServiceRequestModule
          onNavigate={handleNavigation}
          onRequestSubmit={handleServiceRequest}
        />
        <ChatSystem />
        <BookingDialog />
      </div>
    );
  }

  if (currentView === 'matching') {
    return (
      <div>
        <MatchingEngine
          onNavigate={handleNavigation}
          serviceRequest={serviceRequest}
          onStartBooking={startBooking}
          onStartChat={startProviderChat}
        />
        <ChatSystem />
        <BookingDialog />
      </div>
    );
  }

  if (currentView === 'ratings-reviews') {
    return (
      <div>
        <RatingsReviews
          onNavigate={handleNavigation}
        />
        <ChatSystem />
        <BookingDialog />
      </div>
    );
  }

  if (currentView === 'admin') {
    return (
      <div>
        <AdminInterface
          onNavigate={handleNavigation}
          apiClient={apiClient}
          authToken={authToken}
        />
        <ChatSystem />
        <BookingDialog />
      </div>
    );
  }

  // Helper functions
  const addCustomService = () => {
    if (newCustomService.name && newCustomService.rate) {
      const service = {
        id: Date.now(),
        ...newCustomService,
        isCustom: true
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

  const removeCustomService = (id) => {
    setCustomServices(customServices.filter(service => service.id !== id));
  };

  const togglePredefinedService = (serviceName) => {
    setSelectedServices(prev =>
      prev.includes(serviceName)
        ? prev.filter(s => s !== serviceName)
        : [...prev, serviceName]
    );
  };

  const handleBookingChange = (field, value) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  };

  const handleLocationChange = (field, value) => {
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
      const response = await apiClient.requests.submit(bookingData, authToken);
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
            <span>24/7 Available</span>
          </div>
        </div>
        <div className="absolute top-4 right-4 text-6xl opacity-20">🇿🇦</div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
        <Input
          placeholder="What service do you need?"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-12 text-base"
        />
      </div>

      {/* Emergency Button */}
      <Button
        className="w-full h-14 bg-red-600 hover:bg-red-700 text-white rounded-xl"
        onClick={() => setCurrentView('service-request')}
      >
        <Zap className="mr-2 h-5 w-5" />
        EMERGENCY SERVICE
      </Button>

      {/* Service Categories */}
      <div>
        <h2 className="mb-4">Service Categories</h2>
        <div className="grid grid-cols-2 gap-3">
          {serviceCategories.map((category, index) => (
            <Card
              key={index}
              className="cursor-pointer hover:shadow-md transition-shadow border-0 bg-gradient-to-br from-gray-50 to-gray-100"
              onClick={() => {
                setSelectedService(category.name);
                setCurrentView('service-request');
              }}
            >
              <CardContent className="p-4 text-center">
                <div className={`w-12 h-12 ${category.color} rounded-full flex items-center justify-center mx-auto mb-2 text-white text-xl`}>
                  {category.icon}
                </div>
                <p className="font-medium">{category.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Available Providers with Enhanced Actions */}
      <div>
        <h2 className="mb-4">Available Near You</h2>
        <div className="space-y-3">
          {featuredProviders.map((provider) => (
            <Card key={provider.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex flex-col space-y-4">
                  {/* Provider Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                          {provider.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{provider.name}</h3>
                        <p className="text-sm text-muted-foreground">{provider.service}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm ml-1">{provider.rating}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">({provider.reviews})</span>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3 mr-1" />
                            {provider.distance}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={provider.available ? "default" : "secondary"} className="mb-2">
                        {provider.available ? "Available" : "Busy"}
                      </Badge>
                      <p className="text-sm font-semibold">R{provider.hourlyRate}/hr</p>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startProviderChat(provider)}
                      className="flex-1"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Chat
                    </Button>
                    <Button
                      onClick={() => startBooking(provider)}
                      size="sm"
                      className="flex-1"
                      disabled={!provider.available}
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Book Now
                    </Button>
                  </div>
                  
                  {/* Quick Info */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Response time: {provider.responseTime}</span>
                    <span>Distance: {provider.distance}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  // Provider Registration (simplified for space)
  const ProviderRegistration = () => {
    const totalSteps = 5;
    const progress = (registrationStep / totalSteps) * 100;

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => setCurrentView(isAdminMode ? 'admin-overview' : 'home')}>
            ← Back
          </Button>
          <WayaWayaLogo size="sm" />
          <div className="flex-1">
            <h1>Become a Provider</h1>
            <p className="text-sm text-muted-foreground">Step {registrationStep} of {totalSteps}</p>
          </div>
        </div>
        <div className="mb-6">
          <Progress value={progress} className="h-2" />
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <Briefcase className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold mb-2">Provider Registration</h3>
              <p className="text-sm text-muted-foreground">Complete registration flow would be here</p>
              <p className="text-xs text-muted-foreground mt-2">Connected to: {API_BASE_URL}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Provider Dashboard (simplified for space)
  const ProviderDashboard = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => setCurrentView(isAdminMode ? 'admin-overview' : 'home')}>
          ← Back
        </Button>
        <WayaWayaLogo size="sm" />
        <h1>Provider Dashboard</h1>
      </div>
      
      <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6 rounded-2xl relative overflow-hidden">
        <div className="relative z-10">
          <h2>Provider Dashboard</h2>
          <p className="opacity-90">Welcome back!</p>
          <div className="flex gap-4 mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold">R2,340</div>
              <div className="text-sm opacity-80">This Week</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">12</div>
              <div className="text-sm opacity-80">Jobs Done</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">4.9</div>
              <div className="text-sm opacity-80">Rating</div>
            </div>
          </div>
        </div>
        <div className="absolute -top-4 -right-4 text-8xl opacity-10">🛠️</div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Provider Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">Provider dashboard functionality would be here</p>
            <p className="text-xs text-muted-foreground mt-2">API: {API_BASE_URL}</p>
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
      <ChatSystem />
      <BookingDialog />
    </div>
  );
}