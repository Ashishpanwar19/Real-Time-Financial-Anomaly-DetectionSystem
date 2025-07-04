import { useState, useEffect } from 'react';
import { User } from '../types';

const mockUsers: User[] = [
  {
    id: 'user_1',
    name: 'Ashish Panwar',
    email: 'ashish05panwar@gmail.com',
    role: 'admin',
    department: 'Risk Management',
    permissions: ['view_all', 'manage_alerts', 'configure_models', 'export_data'],
    lastLogin: Date.now() - 3600000,
    preferences: {
      theme: 'dark',
      alertThresholds: {
        riskScore: 70,
        transactionAmount: 10000,
        velocityLimit: 50
      },
      dashboardLayout: ['metrics', 'transactions', 'network', 'threats'],
      notifications: {
        email: true,
        push: true,
        sms: false
      }
    }
  },
  {
    id: 'user_2',
    name: 'Karan Singh',
    email: 'karan.singh@finsecure.com',
    role: 'analyst',
    department: 'Fraud Investigation',
    permissions: ['view_transactions', 'manage_alerts', 'investigate'],
    lastLogin: Date.now() - 1800000,
    preferences: {
      theme: 'dark',
      alertThresholds: {
        riskScore: 60,
        transactionAmount: 5000,
        velocityLimit: 30
      },
      dashboardLayout: ['transactions', 'alerts', 'network', 'metrics'],
      notifications: {
        email: true,
        push: true,
        sms: true
      }
    }
  },
  {
    id: 'user_3',
    name: 'Emily Watson',
    email: 'emily.watson@finsecure.com',
    role: 'risk_manager',
    department: 'Quantitative Risk',
    permissions: ['view_models', 'configure_models', 'view_reports'],
    lastLogin: Date.now() - 7200000,
    preferences: {
      theme: 'dark',
      alertThresholds: {
        riskScore: 80,
        transactionAmount: 25000,
        velocityLimit: 100
      },
      dashboardLayout: ['models', 'metrics', 'threats', 'transactions'],
      notifications: {
        email: true,
        push: false,
        sms: false
      }
    }
  }
];

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate authentication check
    const timer = setTimeout(() => {
      // Default to Ashish Panwar (admin) for demo
      setCurrentUser(mockUsers[0]);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const login = (email: string, password: string) => {
    const user = mockUsers.find(u => u.email === email);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchUser = (userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
    }
  };

  return {
    currentUser,
    isLoading,
    login,
    logout,
    switchUser,
    availableUsers: mockUsers
  };
};