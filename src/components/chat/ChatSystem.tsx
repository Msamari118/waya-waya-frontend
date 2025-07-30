import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  MessageCircle, Unlock, Lock, Send, Paperclip, X, 
  Image, Video, FileIcon, Download 
} from 'lucide-react';
import { ChatMessage, Provider } from '../../types';

interface ChatSystemProps {
  showChat: boolean;
  setShowChat: (show: boolean) => void;
  chatMessages: ChatMessage[];
  setChatMessages: (messages: ChatMessage[]) => void;
  newMessage: string;
  setNewMessage: (message: string) => void;
  selectedFiles: File[];
  setSelectedFiles: (files: File[]) => void;
  chatFilesAllowed: boolean;
  currentChatProvider: Provider | null;
  setCurrentChatProvider: (provider: Provider | null) => void;
  providerChats: Record<number, ChatMessage[]>;
  setProviderChats: (chats: Record<number, ChatMessage[]>) => void;
  currentUser: any;
  isAdminMode: boolean;
  toggleFileUploadPermission: () => void;
  sendMessage: () => void;
  handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  removeFile: (index: number) => void;
}

export const ChatSystem: React.FC<ChatSystemProps> = ({
  showChat,
  setShowChat,
  chatMessages,
  newMessage,
  setNewMessage,
  selectedFiles,
  setSelectedFiles,
  chatFilesAllowed,
  currentChatProvider,
  setCurrentChatProvider,
  currentUser,
  isAdminMode,
  toggleFileUploadPermission,
  sendMessage,
  handleFileSelect,
  removeFile
}) => {
  return (
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
}; 