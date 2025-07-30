import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { 
  Users, Ban, Unlock, AlertTriangle, FileText, ArrowLeft 
} from 'lucide-react';
import { WayaWayaLogo } from '../common/WayaWayaLogo';
import { BlockedClient } from '../../types';
import { BLOCKED_CLIENTS } from '../../utils/constants';

interface ClientManagementProps {
  onBack: () => void;
}

export const ClientManagement: React.FC<ClientManagementProps> = ({ onBack }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={onBack}>
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
                      <p className="text-muted-foreground">Blocked: {client.blockedAt.toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive">R0.00</Badge>
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
}; 