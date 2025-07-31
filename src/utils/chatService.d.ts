export interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  readBy: string[];
  type: 'text' | 'file' | 'audio' | 'image';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
}

export interface ChatRoom {
  id: string;
  participants: string[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  createdAt: Date;
}

declare const chatService: {
  connect: (userId: string, token?: string) => Promise<void>;
  disconnect: () => void;
  isConnected: boolean;
  on: (event: string, callback: (data: any) => void) => void;
  off: (event: string, callback: (data: any) => void) => void;
  sendMessage: (messageData: any) => Promise<any>;
  joinChat: (chatId: string, userId: string) => Promise<void>;
  leaveChat: (chatId: string) => Promise<void>;
  getChats: (userId: string) => Promise<ChatRoom[]>;
  getUserChats: (userId: string) => Promise<{ success: boolean; data: ChatRoom[] }>;
  getMessages: (chatId: string) => Promise<ChatMessage[]>;
  getChatHistory: (chatId: string) => Promise<{ success: boolean; data: { messages: ChatMessage[] } }>;
  markAsRead: (chatId: string, messageId: string, userId: string) => Promise<void>;
  startTyping: (chatId: string) => void;
  stopTyping: (chatId: string) => void;
  sendTypingIndicator: (chatId: string, userId: string, isTyping: boolean) => void;
  createChat: (participants: string[], type: string, metadata: any) => Promise<{ success: boolean; data: ChatRoom }>;
  uploadFileToChat: (file: File, chatId: string, userId: string, onProgress?: (progress: number) => void) => Promise<{ success: boolean; message: any; error?: string }>;
  searchMessages: (chatId: string, query: string) => Promise<{ success: boolean; data: ChatMessage[] }>;
};

export default chatService; 