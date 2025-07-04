import React, { useState } from 'react';
import { User } from '../types';
import { Settings, User as UserIcon, Bell, Shield, LogOut, Users, ChevronDown } from 'lucide-react';

interface UserProfileProps {
  user: User;
  onSwitchUser: (userId: string) => void;
  onLogout: () => void;
  availableUsers: User[];
}

export const UserProfile: React.FC<UserProfileProps> = ({ 
  user, 
  onSwitchUser, 
  onLogout, 
  availableUsers 
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'analyst': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'risk_manager': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'viewer': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatLastLogin = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ago`;
    }
    return `${minutes}m ago`;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-3 bg-gray-800 hover:bg-gray-700 rounded-lg p-3 transition-colors"
      >
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
          <UserIcon className="w-4 h-4 text-white" />
        </div>
        <div className="text-left">
          <div className="text-sm font-medium text-white">{user.name}</div>
          <div className="text-xs text-gray-400">{user.department}</div>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {showDropdown && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-medium text-white">{user.name}</div>
                <div className="text-sm text-gray-400">{user.email}</div>
                <div className={`inline-flex items-center px-2 py-1 rounded text-xs border ${getRoleColor(user.role)}`}>
                  {user.role.replace('_', ' ').toUpperCase()}
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-400">
              Last login: {formatLastLogin(user.lastLogin)}
            </div>
          </div>

          <div className="p-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-lg"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
            
            <div className="border-t border-gray-700 my-2" />
            
            <div className="px-3 py-2">
              <div className="text-xs text-gray-400 mb-2">Switch User (Demo)</div>
              {availableUsers.filter(u => u.id !== user.id).map(u => (
                <button
                  key={u.id}
                  onClick={() => {
                    onSwitchUser(u.id);
                    setShowDropdown(false);
                  }}
                  className="w-full flex items-center space-x-2 px-2 py-1 text-sm text-gray-300 hover:bg-gray-700 rounded mb-1"
                >
                  <Users className="w-3 h-3" />
                  <span>{u.name} ({u.role})</span>
                </button>
              ))}
            </div>
            
            <div className="border-t border-gray-700 my-2" />
            
            <button
              onClick={() => {
                onLogout();
                setShowDropdown(false);
              }}
              className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}

      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">User Preferences</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">Alert Thresholds</label>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Risk Score</span>
                    <span className="text-sm text-white">{user.preferences.alertThresholds.riskScore}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Transaction Amount</span>
                    <span className="text-sm text-white">${user.preferences.alertThresholds.transactionAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Velocity Limit</span>
                    <span className="text-sm text-white">{user.preferences.alertThresholds.velocityLimit}/min</span>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm text-gray-400">Notifications</label>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Email</span>
                    <div className={`w-4 h-4 rounded ${user.preferences.notifications.email ? 'bg-green-400' : 'bg-gray-600'}`} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Push</span>
                    <div className={`w-4 h-4 rounded ${user.preferences.notifications.push ? 'bg-green-400' : 'bg-gray-600'}`} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">SMS</span>
                    <div className={`w-4 h-4 rounded ${user.preferences.notifications.sms ? 'bg-green-400' : 'bg-gray-600'}`} />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm text-gray-400">Permissions</label>
                <div className="mt-2 flex flex-wrap gap-1">
                  {user.permissions.map(permission => (
                    <span key={permission} className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">
                      {permission.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};