/**
 * Production-Ready Real-time Chat Service
 * Supports WebSocket connections, file sharing, and message management (Browser-compatible)
 */

class ChatService {
    constructor() {
      // Browser-compatible environment variable access
      const env = (typeof process !== 'undefined' && process.env) ? process.env : {};
      
      this.ws = null;
      this.isConnected = false;
      this.reconnectAttempts = 0;
      this.maxReconnectAttempts = 5;
      this.reconnectDelay = 1000;
      this.messageQueue = [];
      this.listeners = new Map();
      this.baseURL = env.REACT_APP_WEBSOCKET_URL || 'wss://api.wayawaya.co.za/ws';
      this.restApiURL = env.REACT_APP_API_URL || 'https://api.wayawaya.co.za/api';
    }
  
    /**
     * Initialize WebSocket connection
     */
    async connect(userId, authToken) {
      if (this.ws && this.isConnected) {
        return;
      }
  
      try {
        this.ws = new WebSocket(`${this.baseURL}?userId=${userId}&token=${authToken}`);
        
        this.ws.onopen = () => {
          console.log('Chat service connected');
          this.isConnected = true;
          this.reconnectAttempts = 0;
          this.processMessageQueue();
          this.emit('connected');
        };
  
        this.ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            this.handleIncomingMessage(message);
          } catch (error) {
            console.error('Error parsing message:', error);
          }
        };
  
        this.ws.onclose = () => {
          console.log('Chat service disconnected');
          this.isConnected = false;
          this.emit('disconnected');
          this.attemptReconnect(userId, authToken);
        };
  
        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.emit('error', error);
        };
  
      } catch (error) {
        console.error('Failed to connect to chat service:', error);
        this.emit('error', error);
      }
    }
  
    /**
     * Disconnect from chat service
     */
    disconnect() {
      if (this.ws) {
        this.ws.close();
        this.ws = null;
        this.isConnected = false;
      }
    }
  
    /**
     * Attempt to reconnect
     */
    async attemptReconnect(userId, authToken) {
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.log('Max reconnection attempts reached');
        this.emit('maxReconnectAttemptsReached');
        return;
      }
  
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms`);
      
      setTimeout(() => {
        this.connect(userId, authToken);
      }, delay);
    }
  
    /**
     * Send message to chat
     */
    async sendMessage(chatData) {
      const message = {
        type: 'message',
        id: this.generateMessageId(),
        timestamp: new Date().toISOString(),
        ...chatData
      };
  
      if (this.isConnected && this.ws) {
        this.ws.send(JSON.stringify(message));
      } else {
        // Queue message if not connected
        this.messageQueue.push(message);
        // Also try to send via REST API as fallback
        await this.sendMessageViaRest(message);
      }
  
      return message;
    }
  
    /**
     * Send message via REST API as fallback
     */
    async sendMessageViaRest(message) {
      try {
        const authToken = (typeof localStorage !== 'undefined') ? localStorage.getItem('authToken') : null;
        
        const response = await fetch(`${this.restApiURL}/chat/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify(message)
        });
  
        if (response.ok) {
          const result = await response.json();
          this.emit('messageSent', result);
          return result;
        } else {
          throw new Error('Failed to send message via REST API');
        }
      } catch (error) {
        console.error('REST API message send error:', error);
        this.emit('messageError', { message, error: error.message });
      }
    }
  
    /**
     * Join a chat room
     */
    joinChat(chatId, userId) {
      const joinMessage = {
        type: 'join_chat',
        chatId: chatId,
        userId: userId,
        timestamp: new Date().toISOString()
      };
  
      if (this.isConnected && this.ws) {
        this.ws.send(JSON.stringify(joinMessage));
      }
  
      this.emit('chatJoined', { chatId, userId });
    }
  
    /**
     * Leave a chat room
     */
    leaveChat(chatId, userId) {
      const leaveMessage = {
        type: 'leave_chat',
        chatId: chatId,
        userId: userId,
        timestamp: new Date().toISOString()
      };
  
      if (this.isConnected && this.ws) {
        this.ws.send(JSON.stringify(leaveMessage));
      }
  
      this.emit('chatLeft', { chatId, userId });
    }
  
    /**
     * Send typing indicator
     */
    sendTypingIndicator(chatId, userId, isTyping) {
      const typingMessage = {
        type: 'typing',
        chatId: chatId,
        userId: userId,
        isTyping: isTyping,
        timestamp: new Date().toISOString()
      };
  
      if (this.isConnected && this.ws) {
        this.ws.send(JSON.stringify(typingMessage));
      }
    }
  
    /**
     * Mark message as read
     */
    markAsRead(chatId, messageId, userId) {
      const readMessage = {
        type: 'mark_read',
        chatId: chatId,
        messageId: messageId,
        userId: userId,
        timestamp: new Date().toISOString()
      };
  
      if (this.isConnected && this.ws) {
        this.ws.send(JSON.stringify(readMessage));
      }
    }
  
    /**
     * Handle incoming messages
     */
    handleIncomingMessage(message) {
      switch (message.type) {
        case 'message':
          this.emit('messageReceived', message);
          break;
        case 'typing':
          this.emit('typingIndicator', message);
          break;
        case 'message_read':
          this.emit('messageRead', message);
          break;
        case 'user_joined':
          this.emit('userJoined', message);
          break;
        case 'user_left':
          this.emit('userLeft', message);
          break;
        case 'file_shared':
          this.emit('fileShared', message);
          break;
        case 'system_message':
          this.emit('systemMessage', message);
          break;
        default:
          console.log('Unknown message type:', message.type);
      }
    }
  
    /**
     * Process queued messages
     */
    processMessageQueue() {
      while (this.messageQueue.length > 0 && this.isConnected) {
        const message = this.messageQueue.shift();
        this.ws.send(JSON.stringify(message));
      }
    }
  
    /**
     * Get chat history
     */
    async getChatHistory(chatId, page = 1, limit = 50) {
      try {
        const authToken = (typeof localStorage !== 'undefined') ? localStorage.getItem('authToken') : null;
        
        const response = await fetch(`${this.restApiURL}/chat/${chatId}/messages?page=${page}&limit=${limit}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
  
        if (response.ok) {
          return await response.json();
        } else {
          throw new Error('Failed to fetch chat history');
        }
      } catch (error) {
        console.error('Chat history fetch error:', error);
        return { success: false, error: error.message };
      }
    }
  
    /**
     * Create new chat
     */
    async createChat(participants, chatType = 'direct', metadata = {}) {
      try {
        const authToken = (typeof localStorage !== 'undefined') ? localStorage.getItem('authToken') : null;
        
        const response = await fetch(`${this.restApiURL}/chat/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify({
            participants,
            chatType,
            metadata
          })
        });
  
        if (response.ok) {
          const chat = await response.json();
          this.emit('chatCreated', chat);
          return chat;
        } else {
          throw new Error('Failed to create chat');
        }
      } catch (error) {
        console.error('Chat creation error:', error);
        return { success: false, error: error.message };
      }
    }
  
    /**
     * Get user's chats
     */
    async getUserChats(userId) {
      try {
        const authToken = (typeof localStorage !== 'undefined') ? localStorage.getItem('authToken') : null;
        
        const response = await fetch(`${this.restApiURL}/chat/user/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
  
        if (response.ok) {
          return await response.json();
        } else {
          throw new Error('Failed to fetch user chats');
        }
      } catch (error) {
        console.error('User chats fetch error:', error);
        return { success: false, error: error.message };
      }
    }
  
    /**
     * Upload file to chat
     */
    async uploadFileToChat(file, chatId, userId, onProgress) {
      try {
        const fileUploadService = await import('./fileUploadService.js');
        const uploadResult = await fileUploadService.default.uploadChatFile(file, userId, chatId, onProgress);
  
        if (uploadResult.success) {
          // Send file message
          const fileMessage = await this.sendMessage({
            chatId: chatId,
            senderId: userId,
            messageType: 'file',
            content: uploadResult.metadata.originalName,
            fileUrl: uploadResult.url,
            fileType: uploadResult.metadata.type,
            fileSize: uploadResult.metadata.size,
            preview: uploadResult.preview
          });
  
          return { success: true, message: fileMessage, fileData: uploadResult };
        } else {
          throw new Error(uploadResult.error);
        }
      } catch (error) {
        console.error('File upload to chat error:', error);
        return { success: false, error: error.message };
      }
    }
  
    /**
     * Search messages
     */
    async searchMessages(chatId, query, page = 1, limit = 20) {
      try {
        const authToken = (typeof localStorage !== 'undefined') ? localStorage.getItem('authToken') : null;
        
        const response = await fetch(`${this.restApiURL}/chat/${chatId}/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
  
        if (response.ok) {
          return await response.json();
        } else {
          throw new Error('Failed to search messages');
        }
      } catch (error) {
        console.error('Message search error:', error);
        return { success: false, error: error.message };
      }
    }
  
    /**
     * Delete message
     */
    async deleteMessage(chatId, messageId, userId) {
      try {
        const authToken = (typeof localStorage !== 'undefined') ? localStorage.getItem('authToken') : null;
        
        const response = await fetch(`${this.restApiURL}/chat/${chatId}/messages/${messageId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
  
        if (response.ok) {
          const result = await response.json();
          this.emit('messageDeleted', { chatId, messageId, userId });
          return result;
        } else {
          throw new Error('Failed to delete message');
        }
      } catch (error) {
        console.error('Message deletion error:', error);
        return { success: false, error: error.message };
      }
    }
  
    /**
     * Event listener management
     */
    on(event, callback) {
      if (!this.listeners.has(event)) {
        this.listeners.set(event, []);
      }
      this.listeners.get(event).push(callback);
    }
  
    off(event, callback) {
      if (this.listeners.has(event)) {
        const callbacks = this.listeners.get(event);
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    }
  
    emit(event, data) {
      if (this.listeners.has(event)) {
        this.listeners.get(event).forEach(callback => {
          try {
            callback(data);
          } catch (error) {
            console.error('Error in event listener:', error);
          }
        });
      }
    }
  
    /**
     * Generate unique message ID using browser-compatible method
     */
    generateMessageId() {
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 15);
      return `msg_${timestamp}_${random}`;
    }
  
    /**
     * Get connection status
     */
    getConnectionStatus() {
      return {
        isConnected: this.isConnected,
        reconnectAttempts: this.reconnectAttempts,
        queuedMessages: this.messageQueue.length
      };
    }
  
    /**
     * Generate simple hash for message integrity (browser-compatible)
     */
    generateMessageHash(messageContent) {
      let hash = 0;
      const str = JSON.stringify(messageContent);
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
      }
      return hash.toString(36);
    }
  }
  
  export default new ChatService();