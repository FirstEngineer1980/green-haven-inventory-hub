
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const LoginActivity: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Login Activity</CardTitle>
        <CardDescription>
          Recent logins to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium">Current Session</p>
              <p className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString()} • {navigator.userAgent.includes('Windows') ? 'Windows' : 
                  navigator.userAgent.includes('Mac') ? 'MacOS' : 
                  navigator.userAgent.includes('Linux') ? 'Linux' : 'Unknown OS'}
              </p>
            </div>
            <div className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full">
              Active Now
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
