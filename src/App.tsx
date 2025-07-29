import React, { useState, useEffect } from 'react';
import './styles/globals.css';
import LandingScreen from './components/LandingScreen';
import AuthScreen from './components/AuthScreen';
import ServiceRequestModule from './components/ServiceRequestModule';
import MatchingEngine from './components/MatchingEngine';
import RatingsReviews from './components/RatingsReviews';
import AdminInterface from './components/AdminInterface';
import { Search, MapPin, Star, Clock, Shield, Zap, Phone, Menu, User, Bell, Upload, CheckCircle, Plus, Briefcase, X, Edit3, MessageCircle, Navigation, CreditCard, Copy, Settings, Eye, Database, FileText, DollarSign, AlertTriangle, Ban, Lock, Unlock, Calendar, TrendingUp, Users, Receipt, Wallet, Send, Paperclip, Image, Video, FileIcon, Download, BookOpen, ArrowRight, ArrowLeft, LogOut } from 'lucide-react';
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
import apiClient from './types/apiClient';

// TypeScript Interfaces
interface User {
  id: string;
  email: string;
  userType: 'client' | 'provider' | 'admin';
  role?: string;
  name: string;
  phone?: string;
  location?: string;
  services?: string[];
  hourlyRate?: number;
  rating?: number;
  isVerified?: boolean;
}

interface ServiceRequest {
  id: string;
  serviceType: string;
  description: string;
  location: {
    lat: number | null;
    lng: number | null;
    address: string;
  };
  preferredTime: string;
  urgency: 'low' | 'normal' | 'high' | 'emergency';
  clientId: string;
  status: 'pending' | 'matched' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: string;
}

interface ChatMessage {
  id: number;
  text: string;
  files: File[];
  sender: string;
  timestamp: string;
  type: 'user' | 'provider' | 'system';
  providerId?: string;
}

interface Provider {
  id: number;
  name: string;
  email: string;
  phone: string;
  service: string;
  hourlyRate: number;
  rating: number;
  location: string;
  available: boolean;
  isVerified: boolean;
  services: string[];
  reviews: number;
  distance: string;
  currency: string;
  image: string | null;
  trialDaysLeft: number;
  commissionDue: number;
  responseTime: string;
}

interface CustomService {
  id: number;
  name: string;
  description: string;
  rate: string;
  category: string;
}

interface BookingDetails {
  date: string;
  time: string;
  description: string;
  urgency: 'low' | 'normal' | 'high' | 'emergency';
  location: string;
  estimatedHours: number;
}

interface BookingData {
  serviceType: string;
  description: string;
  preferredTime: string;
  location: {
    lat: number | null;
    lng: number | null;
    address: string;
  };
}

interface CustomServiceForm {
  name: string;
  description: string;
  rate: string;
  category: string;
}

// --- PRODUCTION API CLIENT ---
const getApiBaseUrl = () => {
  if (import.meta.env.DEV) {
    return 'https://waya-waya-backend-production.up.railway.app';
  }
  return import.meta.env.VITE_API_BASE_URL || 'https://waya-waya-backend-production.up.railway.app';
};

const API_BASE_URL = getApiBaseUrl();

// WAYA WAYA Logo Component
interface WayaWayaLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

const WayaWayaLogo = ({ size = 'sm', showText = true }: WayaWayaLogoProps) => {
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
const validatePassword = (password: string) => {
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

const featuredProviders: Provider[] = [
  {
    id: 1,
    name: 'Ahmed Hassan',
    email: 'ahmed.hassan@example.com',
    phone: '+27 82 123 4567',
    service: 'Electrician',
    hourlyRate: 250,
    rating: 4.9,
    location: 'Johannesburg, Gauteng',
    available: true,
    isVerified: true,
    services: ['Electrical', 'Installation', 'Repairs'],
    reviews: 127,
    distance: '2.3 km',
    currency: 'R',
    image: null,
    trialDaysLeft: 3,
    commissionDue: 145.50,
    responseTime: '~15 min'
  },
  {
    id: 2,
    name: 'Maria Santos',
    email: 'maria.santos@example.com',
    phone: '+27 83 456 7890',
    service: 'House Cleaning',
    hourlyRate: 180,
    rating: 4.8,
    location: 'Cape Town, Western Cape',
    available: true,
    isVerified: true,
    services: ['Cleaning', 'Deep Cleaning', 'Organizing'],
    reviews: 89,
    distance: '1.8 km',
    currency: 'R',
    image: null,
    trialDaysLeft: 0,
    commissionDue: 89.25,
    responseTime: '~5 min'
  },
  {
    id: 3,
    name: 'James Wilson',
    email: 'james.wilson@example.com',
    phone: '+27 84 789 0123',
    service: 'Plumber',
    hourlyRate: 300,
    rating: 4.7,
    location: 'Durban, KwaZulu-Natal',
    available: false,
    isVerified: true,
    services: ['Plumbing', 'Emergency Repairs', 'Installation'],
    reviews: 156,
    distance: '3.1 km',
    currency: 'R',
    image: null,
    trialDaysLeft: 7,
    commissionDue: 230.75,
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

const setAdminAccess = (access: boolean) => {
  localStorage.setItem('adminAccess', access.toString());
};

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

  // Mock data with proper Provider interface
  const mockProviders: Provider[] = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '+27 82 123 4567',
      service: 'Plumbing',
      hourlyRate: 150,
      rating: 4.8,
      location: 'Johannesburg, Gauteng',
      available: true,
      isVerified: true,
      services: ['Plumbing', 'Emergency Repairs'],
      reviews: 127,
      distance: '2.3 km',
      currency: 'R',
      image: null,
      trialDaysLeft: 0,
      commissionDue: 0,
      responseTime: '15 min'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      phone: '+27 83 456 7890',
      service: 'Electrical',
      hourlyRate: 180,
      rating: 4.9,
      location: 'Cape Town, Western Cape',
      available: true,
      isVerified: true,
      services: ['Electrical', 'Installation'],
      reviews: 89,
      distance: '1.8 km',
      currency: 'R',
      image: null,
      trialDaysLeft: 0,
      commissionDue: 0,
      responseTime: '20 min'
    },
    {
      id: 3,
      name: 'Mike Wilson',
      email: 'mike.wilson@example.com',
      phone: '+27 84 789 0123',
      service: 'Cleaning',
      hourlyRate: 120,
      rating: 4.7,
      location: 'Durban, KwaZulu-Natal',
      available: false,
      isVerified: true,
      services: ['Cleaning', 'Deep Cleaning'],
      reviews: 203,
      distance: '3.1 km',
      currency: 'R',
      image: null,
      trialDaysLeft: 0,
      commissionDue: 0,
      responseTime: '25 min'
    }
  ];

  // Check for admin access on app load
  useEffect(() => {
    const checkAccess = async () => {
      const hasAdminAccess = await checkEnvironmentAccess();
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

  const handleNavigation = (view: string) => {
    setCurrentView(view);
  };

  const handleServiceRequest = (request: ServiceRequest) => {
    setServiceRequest(request);
  };

  // Provider Chat Functions
  const startProviderChat = async (provider: Provider) => {
    setCurrentChatProvider(provider);
    setShowChat(true);
    
    // Load existing messages for this provider
    if (!providerChats[provider.id]) {
      try {
        const response = await apiClient.chat.getProviderMessages(provider.id.toString(), authToken || '');
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
      sender: currentUser?.name || 'Unknown',
      timestamp: new Date().toISOString(),
      type: 'user' as const,
      providerId: currentChatProvider.id
    };

    // Update local state
    const chatMessage: ChatMessage = {
      ...message,
      providerId: String(currentChatProvider.id)
    };
    const updatedMessages = [...chatMessages, chatMessage];
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
        providerId: currentChatProvider.id.toString()
      }, authToken || '');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  // Booking Functions
  const startBooking = (provider: Provider) => {
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
          <div className="space-y-2">
            <label className="text-sm font-medium">Service Type</label>
            <Input
              value={bookingData.serviceType}
              onChange={(e) => handleBookingChange('serviceType', e.target.value)}
              placeholder="e.g., Plumbing, Electrical"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={bookingData.description}
              onChange={(e) => handleBookingChange('description', e.target.value)}
              placeholder="Describe your service need..."
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Preferred Time</label>
            <Input
              type="datetime-local"
              value={bookingData.preferredTime}
              onChange={(e) => handleBookingChange('preferredTime', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Location</label>
            <div className="space-y-2">
              <Input
                placeholder="Address"
                value={bookingData.location.address}
                onChange={(e) => handleLocationChange('address', e.target.value)}
              />
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Latitude"
                  value={bookingData.location.lat || ''}
                  onChange={(e) => handleLocationChange('lat', parseFloat(e.target.value) || null)}
                />
                <Input
                  type="number"
                  placeholder="Longitude"
                  value={bookingData.location.lng || ''}
                  onChange={(e) => handleLocationChange('lng', parseFloat(e.target.value) || null)}
                />
              </div>
            </div>
          </div>
          
          {bookingError && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{bookingError}</AlertDescription>
            </Alert>
          )}
          
          <div className="flex gap-2">
            <Button onClick={handleSubmitBooking} className="flex-1">
              <Send className="h-4 w-4 mr-2" />
              Submit Booking
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredProviders.map((provider) => (
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

  // Provider Registration (simplified for space)
  const ProviderRegistration = () => {
    const totalSteps = 5;
    const progress = (registrationStep / totalSteps) * 100;

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => setCurrentView(isAdminMode ? 'admin-overview' : 'home')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
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
        
        {/* Service Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Select Your Services
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {['Plumbing', 'Electrical', 'Cleaning', 'Gardening', 'Painting', 'Carpentry'].map((service) => (
                <div key={service} className="flex items-center space-x-2">
                  <Checkbox 
                    id={service}
                    checked={selectedServices.includes(service)}
                    onCheckedChange={() => togglePredefinedService(service)}
                  />
                  <label htmlFor={service} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {service}
                  </label>
                </div>
              ))}
            </div>
            
            <Separator />
            
            {/* Custom Service Form */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Custom Services</h4>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowCustomServiceForm(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Custom Service
                </Button>
              </div>
              
              {showCustomServiceForm && (
                <Card className="p-4 border-dashed">
                  <div className="space-y-3">
                    <Input
                      placeholder="Service name"
                      value={newCustomService.name}
                      onChange={(e) => setNewCustomService(prev => ({ ...prev, name: e.target.value }))}
                    />
                    <Textarea
                      placeholder="Description"
                      value={newCustomService.description}
                      onChange={(e) => setNewCustomService(prev => ({ ...prev, description: e.target.value }))}
                    />
                    <div className="flex gap-2">
                      <Input
                        placeholder="Rate (e.g., R150/hour)"
                        value={newCustomService.rate}
                        onChange={(e) => setNewCustomService(prev => ({ ...prev, rate: e.target.value }))}
                      />
                      <Select 
                        value={newCustomService.category} 
                        onValueChange={(value) => setNewCustomService(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="home">Home</SelectItem>
                          <SelectItem value="office">Office</SelectItem>
                          <SelectItem value="outdoor">Outdoor</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={addCustomService} className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add Service
                      </Button>
                      <Button variant="outline" onClick={() => setShowCustomServiceForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
              
              {/* Display Custom Services */}
              {customServices.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-sm font-medium">Your Custom Services:</h5>
                  {customServices.map((service) => (
                    <div key={service.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">{service.name}</p>
                        <p className="text-sm text-muted-foreground">{service.description}</p>
                        <p className="text-sm text-green-600">{service.rate}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCustomService(service.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

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

  // Enhanced Provider Dashboard with navigation
  const ProviderDashboard = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => setCurrentView(isAdminMode ? 'admin-overview' : 'home')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
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

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setCurrentView('payment-management')}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CreditCard className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">Payment Management</h3>
                <p className="text-sm text-muted-foreground">Manage earnings & payments</p>
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
                <p className="text-sm text-muted-foreground">View & manage clients</p>
              </div>
              <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Settings className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold">Service Settings</h3>
                <p className="text-sm text-muted-foreground">Configure your services</p>
              </div>
              <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
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
