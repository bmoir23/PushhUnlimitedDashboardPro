
import React from 'react';
import { Dashboard } from '../components/layouts/dashboard';
import { UserProfileCard } from '../components/ui/user-profile-card';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Settings, Key, Bell, Shield } from 'lucide-react';

export default function ProfilePage() {
  return (
    <Dashboard>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <UserProfileCard />
          </div>
          
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="general">
                  <TabsList className="grid grid-cols-4 mb-8">
                    <TabsTrigger value="general" className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      <span className="hidden sm:inline">General</span>
                    </TabsTrigger>
                    <TabsTrigger value="security" className="flex items-center gap-2">
                      <Key className="h-4 w-4" />
                      <span className="hidden sm:inline">Security</span>
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      <span className="hidden sm:inline">Notifications</span>
                    </TabsTrigger>
                    <TabsTrigger value="privacy" className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      <span className="hidden sm:inline">Privacy</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="general">
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Profile settings will appear here</p>
                      <p className="text-sm text-slate-400 mt-2">(Feature under development)</p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="security">
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Security settings will appear here</p>
                      <p className="text-sm text-slate-400 mt-2">(Feature under development)</p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="notifications">
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Notification preferences will appear here</p>
                      <p className="text-sm text-slate-400 mt-2">(Feature under development)</p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="privacy">
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Privacy settings will appear here</p>
                      <p className="text-sm text-slate-400 mt-2">(Feature under development)</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Dashboard>
  );
}
