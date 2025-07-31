import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll_area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import { 
  MessageCircle, Send, Paperclip, Image, FileText, X, Download, Search,
  MoreVertical, Phone, Video, Info, Archive, Trash2, Flag, Copy,
  Smile, Mic, MicOff, Pause, Play, Volume2, VolumeX, CheckCheck,
  Clock, AlertCircle, Wifi, WifiOff, Loader2, Camera, File, Music,
  MapPin, Calendar, Star, Heart, ThumbsUp, ThumbsDown
} from 'lucide-react';
import { WayaWayaLogo } from './shared/WayaWayaLogo';
import chatService from '../utils/chatService.js';
import fileUploadService from '../utils/fileUploadService.js';

interface ChatSystemProps {
  currentUser: any;
  selectedProvider?: any;
  onClose?: () => void;
  isOpen?: boolean;
}

export const ChatSystem: React.FC<ChatSystemProps> = ({
  currentUser,
  selectedProvider,
  onClose,
  isOpen = false
}) => {
  // State management
  const [chats, setChats] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState<any>(null);
  const [audioChunks, setAudioChunks] = useState<any[]>([]);
  const [showChatInfo, setShowChatInfo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize chat service
  useEffect(() => {
    if (currentUser && isOpen) {
      initializeChatService();
    }

    return () => {
      if (chatService.isConnected) {
        chatService.disconnect();
      }
    };
  }, [currentUser, isOpen]);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Create chat with selected provider
  useEffect(() => {
    if (selectedProvider && currentUser && isConnected) {
      createOrFindProviderChat();
    }
  }, [selectedProvider, currentUser, isConnected]);

  const initializeChatService = async () => {
    setLoading(true);
    
    try {
      // Set up event listeners
      chatService.on('connected', handleConnected);
      chatService.on('disconnected', handleDisconnected);
      chatService.on('messageReceived', handleMessageReceived);
      chatService.on('typingIndicator', handleTypingIndicator);
      chatService.on('messageRead', handleMessageRead);
      chatService.on('fileShared', handleFileShared);
      chatService.on('error', handleError);

      // Connect to chat service
      await chatService.connect(currentUser.id, localStorage.getItem('authToken') || undefined);
      
      // Load user's chats
      await loadUserChats();
      
    } catch (error) {
      console.error('Failed to initialize chat service:', error);
      setError('Failed to connect to chat service');
    } finally {
      setLoading(false);
    }
  };

  const handleConnected = () => {
    setIsConnected(true);
    setError('');
  };

  const handleDisconnected = () => {
    setIsConnected(false);
    setError('Connection lost. Attempting to reconnect...');
  };

  const handleMessageReceived = (message: any) => {
    if (activeChat && message.chatId === activeChat.id) {
      setMessages(prev => [...prev, message]);
      
      // Mark as read if chat is active
      chatService.markAsRead(message.chatId, message.id, currentUser.id);
    }

    // Update chat list
    updateChatInList(message.chatId, message);
  };

  const handleTypingIndicator = (data: any) => {
    if (activeChat && data.chatId === activeChat.id && data.userId !== currentUser.id) {
      if (data.isTyping) {
        setTypingUsers(prev => [...prev.filter(id => id !== data.userId), data.userId]);
      } else {
        setTypingUsers(prev => prev.filter(id => id !== data.userId));
      }
    }
  };

  const handleMessageRead = (data: any) => {
    if (activeChat && data.chatId === activeChat.id) {
      setMessages(prev => prev.map(msg => 
        msg.id === data.messageId 
          ? { ...msg, readBy: [...(msg.readBy || []), data.userId] }
          : msg
      ));
    }
  };

  const handleFileShared = (fileData: any) => {
    handleMessageReceived(fileData);
  };

  const handleError = (error: any) => {
    console.error('Chat service error:', error);
    setError(error.message || 'An error occurred');
  };

  const loadUserChats = async () => {
    try {
      const result = await chatService.getUserChats(currentUser.id);
      if (result.success) {
        setChats(result.data);
      }
    } catch (error) {
      console.error('Failed to load chats:', error);
    }
  };

  const createOrFindProviderChat = async () => {
    try {
      // Check if chat already exists
             const existingChat = chats.find(chat => 
         chat.participants.some((p: any) => p.id === selectedProvider.id) &&
         chat.participants.some((p: any) => p.id === currentUser.id)
       );

      if (existingChat) {
        setActiveChat(existingChat);
        await loadChatMessages(existingChat.id);
      } else {
        // Create new chat
        const newChat = await chatService.createChat(
          [currentUser.id, selectedProvider.id],
          'provider_client',
          { 
            providerId: selectedProvider.id,
            providerName: selectedProvider.name,
            service: selectedProvider.service
          }
        );

        if (newChat.success) {
          setChats(prev => [newChat.data, ...prev]);
          setActiveChat(newChat.data);
          await loadChatMessages(newChat.data.id);
        }
      }
    } catch (error) {
      console.error('Failed to create/find provider chat:', error);
    }
  };

  const loadChatMessages = async (chatId: any) => {
    try {
      const result = await chatService.getChatHistory(chatId);
      if (result.success) {
        setMessages(result.data.messages || []);
        
        // Join chat room
        chatService.joinChat(chatId, currentUser.id);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeChat) return;

    const messageData = {
      chatId: activeChat.id,
      senderId: currentUser.id,
      content: newMessage.trim(),
      messageType: 'text',
      timestamp: new Date().toISOString()
    };

    try {
      const sentMessage = await chatService.sendMessage(messageData);
      setMessages(prev => [...prev, sentMessage]);
      setNewMessage('');
      
      // Stop typing indicator
      if (isTyping) {
        setIsTyping(false);
        chatService.sendTypingIndicator(activeChat.id, currentUser.id, false);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setError('Failed to send message');
    }
  };

  const handleTyping = (e: any) => {
    setNewMessage(e.target.value);

    if (!activeChat) return;

    // Send typing indicator
    if (!isTyping) {
      setIsTyping(true);
      chatService.sendTypingIndicator(activeChat.id, currentUser.id, true);
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      chatService.sendTypingIndicator(activeChat.id, currentUser.id, false);
    }, 2000);
  };

  const handleFileUpload = async (files: any) => {
    if (!files || files.length === 0 || !activeChat) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        const uploadResult = await chatService.uploadFileToChat(
          file,
          activeChat.id,
          currentUser.id,
          (progress) => {
            const overallProgress = ((i / files.length) * 100) + (progress / files.length);
            setUploadProgress(overallProgress);
          }
        );

        if (uploadResult.success) {
          setMessages(prev => [...prev, uploadResult.message]);
        } else {
          throw new Error(uploadResult.error);
        }
      }

      setShowFileUpload(false);
      setSelectedFiles([]);
    } catch (error) {
      console.error('File upload error:', error);
      setError('Failed to upload file');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      recorder.ondataavailable = (event) => {
        setAudioChunks(prev => [...prev, event.data]);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioFile = new (File as any)([audioBlob], `voice_${Date.now()}.wav`);
        
        await handleFileUpload([audioFile]);
        setAudioChunks([]);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      setMediaRecorder(recorder);
      setRecording(true);
      setRecordingTime(0);
      
      recorder.start();

      // Start recording timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Voice recording error:', error);
      setError('Failed to start voice recording');
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorder && recording) {
      mediaRecorder.stop();
      setRecording(false);
      
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  };

  const searchMessages = async (query: any) => {
    if (!query.trim() || !activeChat) return;

    try {
      const result = await chatService.searchMessages(activeChat.id, query);
      if (result.success) {
        setSearchResults(result.data);
      }
    } catch (error) {
      console.error('Message search error:', error);
    }
  };

  const formatTime = (timestamp: any) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const updateChatInList = (chatId: any, lastMessage: any) => {
    setChats(prev => prev.map(chat => 
      chat.id === chatId 
        ? { ...chat, lastMessage, updatedAt: new Date().toISOString() }
        : chat
    ).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));
  };

  const getMessageStatus = (message: any) => {
    if (message.senderId === currentUser.id) {
      const readCount = message.readBy?.length || 0;
      if (readCount > 1) { // More than just sender
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
      } else {
        return <CheckCheck className="h-3 w-3 text-gray-400" />;
      }
    }
    return null;
  };

  const renderMessage = (message: any) => {
    const isOwn = message.senderId === currentUser.id;
    const isFile = message.messageType === 'file';
    const isImage = isFile && message.fileType?.startsWith('image/');
    const isAudio = isFile && message.fileType?.startsWith('audio/');

    return (
      <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
        {!isOwn && (
          <Avatar className="h-8 w-8 mr-2">
            <AvatarFallback>
              {message.senderName?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
        )}
        
        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isOwn 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-100 text-gray-900'
        }`}>
          {isFile ? (
            <div className="space-y-2">
              {isImage && message.preview ? (
                <div className="space-y-2">
                  <img 
                    src={message.preview.medium || message.fileUrl} 
                    alt={message.content}
                    className="rounded-lg max-w-full h-auto cursor-pointer"
                    onClick={() => window.open(message.fileUrl, '_blank')}
                  />
                  <p className="text-sm">{message.content}</p>
                </div>
              ) : isAudio ? (
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="ghost">
                    <Play className="h-4 w-4" />
                  </Button>
                  <span className="text-sm">{message.content}</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm">{message.content}</span>
                  <Button size="sm" variant="ghost" onClick={() => window.open(message.fileUrl, '_blank')}>
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <p>{message.content}</p>
          )}
          
          <div className={`flex items-center justify-between mt-1 ${
            isOwn ? 'text-blue-100' : 'text-gray-500'
          }`}>
            <span className="text-xs">{formatTime(message.timestamp)}</span>
            {getMessageStatus(message)}
          </div>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:w-96 p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="p-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <WayaWayaLogo size="sm" />
                <div>
                  <SheetTitle className="text-lg">Chat</SheetTitle>
                  {selectedProvider && (
                    <p className="text-sm text-muted-foreground">
                      {selectedProvider.name} - {selectedProvider.service}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  isConnected ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <Button variant="ghost" size="sm" onClick={() => setShowSearch(!showSearch)}>
                  <Search className="h-4 w-4" />
                </Button>
                {activeChat && (
                  <Button variant="ghost" size="sm" onClick={() => setShowChatInfo(true)}>
                    <Info className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            
            {/* Connection Status */}
            {!isConnected && (
              <Alert className="mt-2">
                <WifiOff className="h-4 w-4" />
                <AlertDescription>
                  {error || 'Connecting to chat service...'}
                </AlertDescription>
              </Alert>
            )}
            
            {/* Search Bar */}
            {showSearch && (
              <div className="mt-2">
                <Input
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    searchMessages(e.target.value);
                  }}
                />
              </div>
            )}
          </SheetHeader>

          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : activeChat ? (
            <>
              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map(renderMessage)}
                  
                  {/* Typing indicators */}
                  {typingUsers.length > 0 && (
                    <div className="flex items-center space-x-2 text-gray-500">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-sm">Someone is typing...</span>
                    </div>
                  )}
                </div>
                <div ref={messagesEndRef} />
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t">
                {uploading && (
                  <div className="mb-2">
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFileUpload(Array.from(e.target.files || []))}
                    accept="image/*,application/pdf,.doc,.docx,.txt"
                  />
                  
                  <div className="flex-1 relative">
                    <Input
                      ref={messageInputRef}
                      value={newMessage}
                      onChange={handleTyping}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Type a message..."
                      disabled={!isConnected || uploading}
                    />
                  </div>
                  
                  {newMessage.trim() ? (
                    <Button onClick={sendMessage} disabled={!isConnected || uploading}>
                      <Send className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={recording ? stopVoiceRecording : startVoiceRecording}
                      disabled={!isConnected || uploading}
                    >
                      {recording ? (
                        <div className="flex items-center space-x-1">
                          <MicOff className="h-4 w-4 text-red-500" />
                          <span className="text-xs">{recordingTime}s</span>
                        </div>
                      ) : (
                        <Mic className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Select a chat to start messaging</h3>
                <p className="text-muted-foreground">
                  Choose from your existing conversations or start a new one
                </p>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ChatSystem;