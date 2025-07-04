import React from 'react';
import { Shield, Activity, AlertTriangle, CheckCircle, Bell } from 'lucide-react';
import { UserProfile } from './UserProfile';
import { User } from '../types';

interface HeaderProps {
  isConnected: boolean;
  activeAlerts: number;
  criticalCount: number;
  systemStatus: 'healthy' | 'warning' | 'critical';
  currentUser: User | null;
  onSwitchUser: (userId: string) => void;
  onLogout: () => void;
  availableUsers: User[];
}

export const Header: React.FC<HeaderProps> = ({ 
  isConnected, 
  activeAlerts, 
  criticalCount,
  systemStatus,
  currentUser,
  onSwitchUser,
  onLogout,
  availableUsers
}) => {
  const getStatusColor = () => {
    switch (systemStatus) {
      case 'healthy': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = () => {
    switch (systemStatus) {
      case 'healthy': return <CheckCircle className="w-5 h-5" />;
      case 'warning': return <AlertTriangle className="w-5 h-5" />;
      case 'critical': return <AlertTriangle className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  return (
    <header className="bg-gray-900 border-b border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Shield className="w-8 h-8 text-blue-400" />
            <div>
              <h1 className="text-xl font-bold text-white">FinSecure Analytics</h1>
              <p className="text-sm text-gray-400">Real-Time Anomaly Detection Platform</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
            <span className="text-sm text-gray-300">
              {isConnected ? 'Live Stream Active' : 'Connection Lost'}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <span className={`text-sm font-medium ${getStatusColor()}`}>
              System {systemStatus}
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-gray-800 rounded-lg px-3 py-1">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-white">{activeAlerts} Active</span>
            </div>
            
            {criticalCount > 0 && (
              <div className="flex items-center space-x-2 bg-red-500/20 border border-red-500/30 rounded-lg px-3 py-1">
                <Bell className="w-4 h-4 text-red-400" />
                <span className="text-sm text-red-400">{criticalCount} Critical</span>
              </div>
            )}
          </div>
          
          <div className="text-sm text-gray-400">
            {new Date().toLocaleTimeString()}
          </div>
          
          {currentUser && (
            <UserProfile
              user={currentUser}
              onSwitchUser={onSwitchUser}
              onLogout={onLogout}
              availableUsers={availableUsers}
            />
          )}
        </div>
      </div>
    </header>
  );
};