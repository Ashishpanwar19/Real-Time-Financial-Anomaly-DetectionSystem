import { useState, useEffect, useCallback } from 'react';
import { Alert } from '../types';

const generateAlert = (): Alert => {
  const types = ['critical', 'high', 'medium', 'low', 'info'] as const;
  const categories = ['fraud', 'system', 'compliance', 'security', 'performance'] as const;
  const statuses = ['active', 'acknowledged', 'resolved', 'escalated'] as const;
  
  const alertTemplates = [
    {
      title: 'High-Risk Transaction Cluster Detected',
      description: 'Multiple transactions from suspicious network cluster showing coordinated behavior',
      category: 'fraud' as const,
      severity: 85
    },
    {
      title: 'ML Model Performance Degradation',
      description: 'Autoencoder model accuracy dropped below 90% threshold',
      category: 'system' as const,
      severity: 70
    },
    {
      title: 'Unusual Velocity Pattern',
      description: 'Account showing 300% increase in transaction velocity',
      category: 'fraud' as const,
      severity: 75
    },
    {
      title: 'System Latency Spike',
      description: 'Processing latency exceeded 100ms for 5 consecutive minutes',
      category: 'performance' as const,
      severity: 60
    },
    {
      title: 'Potential AML Violation',
      description: 'Transaction pattern matches known money laundering schemes',
      category: 'compliance' as const,
      severity: 95
    },
    {
      title: 'Insider Threat Indicator',
      description: 'Employee access pattern deviates from normal behavior',
      category: 'security' as const,
      severity: 80
    }
  ];

  const template = alertTemplates[Math.floor(Math.random() * alertTemplates.length)];
  const type = template.severity >= 90 ? 'critical' : 
               template.severity >= 75 ? 'high' :
               template.severity >= 50 ? 'medium' : 'low';

  return {
    id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    type,
    title: template.title,
    description: template.description,
    timestamp: Date.now(),
    status: Math.random() > 0.7 ? 'active' : statuses[Math.floor(Math.random() * statuses.length)],
    relatedTransactions: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, 
      () => `tx_${Math.random().toString(36).substr(2, 8)}`),
    severity: template.severity,
    category: template.category,
    autoResolved: Math.random() > 0.8,
    escalationLevel: Math.floor(Math.random() * 3),
    estimatedImpact: Math.random() * 1000000
  };
};

export const useAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [criticalAlerts, setCriticalAlerts] = useState<Alert[]>([]);

  const addAlert = useCallback(() => {
    const newAlert = generateAlert();
    setAlerts(prev => [newAlert, ...prev.slice(0, 49)]); // Keep last 50 alerts
    
    if (newAlert.type === 'critical' || newAlert.type === 'high') {
      setCriticalAlerts(prev => [newAlert, ...prev.slice(0, 9)]); // Keep last 10 critical
    }
  }, []);

  const acknowledgeAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, status: 'acknowledged' } : alert
    ));
    setCriticalAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, status: 'acknowledged' } : alert
    ));
  }, []);

  const resolveAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, status: 'resolved' } : alert
    ));
    setCriticalAlerts(prev => prev.filter(alert => alert.id !== alertId));
  }, []);

  const escalateAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { 
        ...alert, 
        status: 'escalated',
        escalationLevel: alert.escalationLevel + 1,
        type: alert.type === 'high' ? 'critical' : alert.type
      } : alert
    ));
  }, []);

  useEffect(() => {
    // Generate initial alerts
    const initialAlerts = Array.from({ length: 15 }, generateAlert);
    setAlerts(initialAlerts);
    setCriticalAlerts(initialAlerts.filter(a => a.type === 'critical' || a.type === 'high'));

    // Add new alerts periodically
    const interval = setInterval(() => {
      if (Math.random() < 0.4) { // 40% chance every 3 seconds
        addAlert();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [addAlert]);

  const activeAlerts = alerts.filter(a => a.status === 'active');
  const criticalCount = criticalAlerts.filter(a => a.status === 'active').length;

  return {
    alerts,
    criticalAlerts,
    activeAlerts,
    criticalCount,
    acknowledgeAlert,
    resolveAlert,
    escalateAlert,
    addAlert
  };
};