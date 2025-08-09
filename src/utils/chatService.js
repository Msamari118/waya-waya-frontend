/**
 * Production-Ready Real-time Chat Service
 * Supports Socket.IO connections, file sharing, and message management
 */
import socket from '../../lib/socket';

class ChatService {
    constructor() {
      // Browser-compatible environment variable access
      const env = (typeof process !== 'undefined' && process.env) ? process.env : {};
      
      this.socket = socket;
      this.isConnected = false;
      this.reconnectAttempts = 0;
      this.maxReconnectAttempts = 5;
      this.reconnectDelay = 1000;
      this.messageQueue = [];
      this.listeners = new Map();
      this.restApiURL = env.NEXT_PUBLIC_BACKEND_URL || env.NEXT_PUBLIC_API_URL || "https://your-railway-backend.railway.app/api";
      this.currentUserId = null;
      this.authToken = null;
    }
  
    /**
     * Initialize Socket.IO connection
     */
    async connect(userId, authToken) {
      if (this.isConnected) {
        return;
      }

      this.currentUserId = userId;
      this.authToken = authToken;
  
      try {
        // Set up socket event listeners
        this.socket.on('connect', () => {
          console.log('Chat service connected');
          this.isConnected = true;
          this.reconnectAttempts = 0;
          this.processMessageQueue();
          this.emit('connected');
        });

        this.socket.on('newMessage', (message) => {
          console.log('Received real-time message:', message);
          this.emit('messageReceived', message);
        });

        this.socket.on('disconnect', () => {
          console.log('Chat service disconnected');
          this.isConnected = false;
          this.emit('disconnected');
          this.handleReconnect();
        });

        this.socket.on('connect_error', (error) => {
          console.error('Connection error:', error);
          this.emit('error', error);
          this.handleReconnect();
        });

        // Connect the socket
        this.socket.connect();
        
      } catch (error) {
        console.error('Failed to connect to chat service:', error);
        this.emit('error', error);
      }
    }

    /**
     * Handle reconnection logic
     */
    handleReconnect() {
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        setTimeout(() => {
          console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
          this.socket.connect();
        }, this.reconnectDelay * this.reconnectAttempts);
      }
    }

    /**
     * Disconnect from chat service
     */
    disconnect() {
      if (this.socket) {
        this.socket.disconnect();
        this.isConnected = false;
        this.emit('disconnected');
      }
    }

    /**
     * Send a message
     */
    async sendMessage(receiverId, messageText, bookingId = null, attachment = null) {
      try {
        const formData = new FormData();
        formData.append('receiverId', receiverId.toString());
        formData.append('messageText', messageText);
        if (bookingId) formData.append('bookingId', bookingId.toString());
        if (attachment) formData.append('attachment', attachment);

        const response = await fetch(`${this.restApiURL}/chat/send`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.authToken}`
          },
          body: formData
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result.data;
      } catch (error) {
        console.error('Error sending message:', error);
        throw error;
      }
    }

    /**
     * Get conversations for current user
     */
    async getConversations() {
      try {
        const response = await fetch(`${this.restApiURL}/chat/conversations`, {
          headers: {
            'Authorization': `Bearer ${this.authToken}`
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result.data || [];
      } catch (error) {
        console.error('Error fetching conversations:', error);
        throw error;
      }
    }

    /**
     * Get messages for a specific conversation
     */
    async getMessages(otherUserId, bookingId = null) {
      try {
        let url = `${this.restApiURL}/chat/messages/${otherUserId}`;
        if (bookingId) url += `?bookingId=${bookingId}`;

        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${this.authToken}`
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result.data || [];
      } catch (error) {
        console.error('Error fetching messages:', error);
        throw error;
      }
    }

    /**
     * Mark message as read
     */
    async markAsRead(chatId, messageId, userId) {
      try {
        const response = await fetch(`${this.restApiURL}/chat/messages/${messageId}/read`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${this.authToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        console.error('Error marking message as read:', error);
        throw error;
      }
    }

    /**
     * Process queued messages when connection is restored
     */
    processMessageQueue() {
      while (this.messageQueue.length > 0) {
        const queuedMessage = this.messageQueue.shift();
        this.socket.emit('send_message', queuedMessage);
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
            console.error(`Error in event listener for ${event}:`, error);
          }
        });
      }
    }
}

export default new ChatService();