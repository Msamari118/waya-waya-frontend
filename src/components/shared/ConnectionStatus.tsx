import React from 'react';
import { Server, Wifi, WifiOff } from 'lucide-react';
import { Button } from '../ui/button';

interface ConnectionStatusProps {
  isConnected: boolean | 'demo';
  onRetry: () => void;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ isConnected, onRetry }) => {
  if (isConnected === 'demo') {
    return (
      <div className="flex items-center gap-2 text-sm text-blue-600">
        <Server className="h-4 w-4" />
        <span>Demo Mode</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 text-sm ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
      {isConnected ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
      <span>{isConnected ? 'Connected' : 'Offline'}</span>
      {!isConnected && (
        <Button size="sm" variant="outline" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
};