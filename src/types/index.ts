export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'analyst' | 'viewer' | 'risk_manager';
  department: string;
  permissions: string[];
  lastLogin: number;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'dark' | 'light';
  alertThresholds: {
    riskScore: number;
    transactionAmount: number;
    velocityLimit: number;
  };
  dashboardLayout: string[];
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

export interface Transaction {
  id: string;
  timestamp: number;
  amount: number;
  currency: string;
  fromAccount: string;
  toAccount: string;
  riskScore: number;
  anomalyType: 'none' | 'velocity' | 'amount' | 'pattern' | 'network' | 'geolocation' | 'device';
  status: 'pending' | 'approved' | 'flagged' | 'blocked' | 'investigating';
  location: string;
  deviceId: string;
  networkCluster?: string;
  mlModelVersion: string;
  confidence: number;
  investigationNotes?: string;
  assignedAnalyst?: string;
}

export interface SystemMetrics {
  latency: number;
  throughput: number;
  errorRate: number;
  cpuUsage: number;
  memoryUsage: number;
  activeNodes: number;
  queueDepth: number;
  modelAccuracy: number;
  uptime: number;
}

export interface Alert {
  id: string;
  type: 'critical' | 'high' | 'medium' | 'low' | 'info';
  title: string;
  description: string;
  timestamp: number;
  status: 'active' | 'acknowledged' | 'resolved' | 'escalated';
  assignedTo?: string;
  relatedTransactions: string[];
  severity: number;
  category: 'fraud' | 'system' | 'compliance' | 'security' | 'performance';
  autoResolved: boolean;
  escalationLevel: number;
  estimatedImpact: number;
}

export interface RiskModel {
  id: string;
  name: string;
  type: 'var' | 'monteCarlo' | 'stress' | 'scenario' | 'gnn' | 'autoencoder';
  value: number;
  confidence: number;
  lastUpdated: number;
  performance: {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
  };
  trainingData: {
    samples: number;
    lastTrained: number;
    version: string;
  };
}

export interface ThreatIntel {
  id: string;
  type: 'malware' | 'phishing' | 'fraud' | 'ddos' | 'insider' | 'aml' | 'sanctions';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  affectedSystems: string[];
  timestamp: number;
  source: string;
  iocs: string[]; // Indicators of Compromise
  mitreAttack: string[];
  confidence: number;
  status: 'investigating' | 'confirmed' | 'false_positive' | 'mitigated';
}

export interface NetworkNode {
  id: string;
  type: 'user' | 'merchant' | 'device' | 'location' | 'bank' | 'exchange';
  riskScore: number;
  connections: number;
  suspicious: boolean;
  volume: number;
  lastActivity: number;
  country: string;
  verified: boolean;
}

export interface NetworkEdge {
  source: string;
  target: string;
  weight: number;
  type: 'transaction' | 'device' | 'location' | 'ownership';
  frequency: number;
  totalAmount: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface DockerStatus {
  containers: {
    name: string;
    status: 'running' | 'stopped' | 'error' | 'starting';
    uptime: number;
    cpu: number;
    memory: number;
    health: 'healthy' | 'unhealthy' | 'starting';
  }[];
  services: {
    kafka: boolean;
    redis: boolean;
    postgres: boolean;
    ml_pipeline: boolean;
  };
  lastUpdate: number;
}