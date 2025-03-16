import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { Badge } from './badge';
import { Button } from './button';
import { useAuth } from '../../lib/auth/use-auth';

export function UserProfileCard() {
  const { user } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);

  if (!user) {
    return null;
  }

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const initials = user.name ? getInitials(user.name) : 'U';

  // Format user role for display
  const formatRole = (role: string) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  // Get appropriate badge color based on role
  const getRoleBadgeColor = (role: string) => {
    const baseColor = isDarkMode ? 'text-white' : 'text-gray-800';
    switch (role) {
      case 'admin':
        return `bg-blue-100 ${baseColor}`;
      case 'superadmin':
        return `bg-purple-100 ${baseColor}`;
      case 'premium':
        return `bg-amber-100 ${baseColor}`;
      case 'enterprise':
        return `bg-emerald-100 ${baseColor}`;
      default:
        return `bg-slate-100 ${baseColor}`;
    }
  };

  return (
    <Card className={`w-full max-w-md mx-auto ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-14 w-14">
          <AvatarImage src={user.picture || ''} alt={user.name || 'User'} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle>{user.name}</CardTitle>
          <CardDescription>{user.email}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-slate-500'} mb-1`}>Account Type</h3>
            <div className="flex flex-wrap gap-2">
              {user.roles && user.roles.map((role, index) => (
                <Badge key={index} className={getRoleBadgeColor(role)}>
                  {formatRole(role)}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-slate-500'} mb-1`}>Plan</h3>
            <p className={`font-medium ${isDarkMode ? 'text-gray-200' : ''}`}>{formatRole(user.plan || 'Free')}</p>
          </div>

          {user.username && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Username</h3>
              <p className="font-medium text-foreground">@{user.username}</p>
            </div>
          )}

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Status</h3>
            <Badge className={user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}>
              {user.status?.charAt(0).toUpperCase() + user.status?.slice(1) || 'Unknown'}
            </Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t border-border pt-4 flex justify-between">
        <Button variant="outline">Edit Profile</Button>
        <Button variant="outline" className="text-red-600 hover:text-red-800 hover:bg-red-50">Logout</Button>
      </CardFooter>
      <div>
          <label className="switch">
            <input type="checkbox" onChange={() => setIsDarkMode(!isDarkMode)} checked={isDarkMode} />
            <span className="slider round"></span>
          </label>
        </div>
    </Card>
  );
}