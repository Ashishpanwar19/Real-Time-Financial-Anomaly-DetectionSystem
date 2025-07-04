import { useState, useEffect, useCallback } from 'react';
import { Transaction, SystemMetrics, ThreatIntel, RiskModel } from '../types';

// Simulated real-time data generators
const generateTransaction = (): Transaction => {
  const anomalyTypes = ['none', 'velocity', 'amount', 'pattern', 'network'] as const;
  const statuses = ['pending', 'approved', 'flagged', 'blocked'] as const;
  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD'];
  const locations = ['New York', 'London', 'Tokyo', 'Singapore', 'Frankfurt'];
  
  const isAnomaly = Math.random() < 0.15; // 15% anomaly rate
  const anomalyType = isAnomaly ? anomalyTypes[Math.floor(Math.random() * (anomalyTypes.length - 1)) + 1] : 'none';
  const riskScore = isAnomaly ? Math.random() * 40 + 60 : Math.random() * 30 + 10;
  
  return {
    id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now(),
    amount: Math.random() * 50000 + 100,
    currency: currencies[Math.floor(Math.random() * currencies.length)],
    fromAccount: `acc_${Math.random().toString(36).substr(2, 8)}`,
    toAccount: `acc_${Math.random().toString(36).substr(2, 8)}`,
    riskScore,
    anomalyType,
    status: isAnomaly ? (Math.random() > 0.5 ? 'flagged' : 'blocked') : 'approved',
    location: locations[Math.floor(Math.random() * locations.length)],
    deviceId: `dev_${Math.random().toString(36).substr(2, 8)}`,
    networkCluster: isAnomaly ? `cluster_${Math.floor(Math.random() * 5) + 1}` : undefined,
    mlModelVersion: 'v2.1.3',
    confidence: Math.random() * 30 + 70,
  };
};

const generateSystemMetrics = (): SystemMetrics => ({
  latency: Math.random() * 20 + 15, // 15-35ms
  throughput: Math.random() * 5000 + 8000, // 8k-13k TPS
  errorRate: Math.random() * 0.5, // 0-0.5%
  cpuUsage: Math.random() * 30 + 40, // 40-70%
  memoryUsage: Math.random() * 25 + 55, // 55-80%
  activeNodes: Math.floor(Math.random() * 5) + 12, // 12-16 nodes
  queueDepth: Math.floor(Math.random() * 200) + 50, // 50-250 messages
  modelAccuracy: Math.random() * 10 + 85, // 85-95%
  uptime: Math.random() * 2592000 + 86400, // 1-30 days
});

const generateThreatIntel = (): ThreatIntel => {
  const types = ['malware', 'phishing', 'fraud', 'ddos', 'insider'] as const;
  const severities = ['low', 'medium', 'high', 'critical'] as const;
  const descriptions = [
    'Suspicious pattern detected in transaction velocity',
    'Unusual device fingerprint observed',
    'Potential account takeover attempt',
    'Anomalous network traffic detected',
    'Insider threat indicators identified'
  ];
  
  return {
    id: `threat_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    type: types[Math.floor(Math.random() * types.length)],
    severity: severities[Math.floor(Math.random() * severities.length)],
    description: descriptions[Math.floor(Math.random() * descriptions.length)],
    affectedSystems: [`system_${Math.floor(Math.random() * 10) + 1}`],
    timestamp: Date.now(),
    source: 'ML Pipeline',
    iocs: [`ioc_${Math.random().toString(36).substr(2, 8)}`],
    mitreAttack: ['T1078', 'T1110', 'T1190'],
    confidence: Math.random() * 30 + 70,
    status: 'investigating',
  };
};

const generateRiskModel = (): RiskModel => {
  const types = ['var', 'monteCarlo', 'stress', 'scenario'] as const;
  const names = ['Portfolio VaR', 'Monte Carlo Simulation', 'Stress Test', 'Scenario Analysis'];
  
  return {
    id: `risk_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    name: names[Math.floor(Math.random() * names.length)],
    type: types[Math.floor(Math.random() * types.length)],
    value: Math.random() * 10000000 + 1000000,
    confidence: Math.random() * 20 + 80,
    lastUpdated: Date.now(),
    performance: {
      accuracy: Math.random() * 10 + 85,
      precision: Math.random() * 10 + 85,
      recall: Math.random() * 10 + 80,
      f1Score: Math.random() * 10 + 82,
    },
    trainingData: {
      samples: Math.floor(Math.random() * 1000000) + 500000,
      lastTrained: Date.now() - Math.random() * 86400000,
      version: 'v2.1.3',
    },
  };
};

export const useRealtimeData = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>(generateSystemMetrics());
  const [threatIntel, setThreatIntel] = useState<ThreatIntel[]>([]);
  const [riskModels, setRiskModels] = useState<RiskModel[]>([]);
  const [isConnected, setIsConnected] = useState(true);

  const addTransaction = useCallback(() => {
    const newTransaction = generateTransaction();
    setTransactions(prev => [newTransaction, ...prev.slice(0, 99)]); // Keep last 100
  }, []);

  const addThreatIntel = useCallback(() => {
    const newThreat = generateThreatIntel();
    setThreatIntel(prev => [newThreat, ...prev.slice(0, 19)]); // Keep last 20
  }, []);

  const updateRiskModel = useCallback(() => {
    const newModel = generateRiskModel();
    setRiskModels(prev => {
      const existing = prev.find(m => m.type === newModel.type);
      if (existing) {
        return prev.map(m => m.type === newModel.type ? newModel : m);
      }
      return [...prev, newModel];
    });
  }, []);

  useEffect(() => {
    // Generate initial data
    const initialTransactions = Array.from({ length: 20 }, generateTransaction);
    setTransactions(initialTransactions);
    
    const initialModels = Array.from({ length: 4 }, generateRiskModel);
    setRiskModels(initialModels);

    // Simulate real-time transaction stream
    const transactionInterval = setInterval(addTransaction, 800 + Math.random() * 400);
    
    // Update system metrics
    const metricsInterval = setInterval(() => {
      setSystemMetrics(generateSystemMetrics());
    }, 2000);
    
    // Add threat intel occasionally
    const threatInterval = setInterval(() => {
      if (Math.random() < 0.3) { // 30% chance every 5 seconds
        addThreatIntel();
      }
    }, 5000);
    
    // Update risk models
    const riskInterval = setInterval(updateRiskModel, 3000);
    
    // Simulate connection status
    const connectionInterval = setInterval(() => {
      setIsConnected(Math.random() > 0.05); // 95% uptime
    }, 1000);

    return () => {
      clearInterval(transactionInterval);
      clearInterval(metricsInterval);
      clearInterval(threatInterval);
      clearInterval(riskInterval);
      clearInterval(connectionInterval);
    };
  }, [addTransaction, addThreatIntel, updateRiskModel]);

  return {
    transactions,
    systemMetrics,
    threatIntel,
    riskModels,
    isConnected,
  };
};