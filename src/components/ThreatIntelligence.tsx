import React from 'react';
import { ThreatIntel } from '../types';
import { Shield, AlertTriangle, Zap, Eye, Bug, Users } from 'lucide-react';

interface ThreatIntelligenceProps {
  threats: ThreatIntel[];
}

export const ThreatIntelligence: React.FC<ThreatIntelligenceProps> = ({ threats }) => {
  const getThreatIcon = (type: ThreatIntel['type']) => {
    switch (type) {
      case 'malware': return <Bug className="w-4 h-4" />;
      case 'phishing': return <Eye className="w-4 h-4" />;
      case 'fraud': return <AlertTriangle className="w-4 h-4" />;
      case 'ddos': return <Zap className="w-4 h-4" />;
      case 'insider': return <Users className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity: ThreatIntel['severity']) => {
    switch (severity) {
      case 'low': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'high': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      case 'critical': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    if (minutes > 0) {
      return `${minutes}m ago`;
    }
    return `${seconds}s ago`;
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Threat Intelligence</h3>
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-blue-400" />
            <span className="text-sm text-gray-400">MITRE ATT&CK</span>
          </div>
        </div>
        <p className="text-sm text-gray-400 mt-1">Cybersecurity threat monitoring & analysis</p>
      </div>
      
      <div className="max-h-80 overflow-y-auto">
        {threats.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No active threats detected</p>
          </div>
        ) : (
          threats.map((threat) => (
            <div key={threat.id} className="p-4 border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${getSeverityColor(threat.severity)}`}>
                  {getThreatIcon(threat.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-white capitalize">{threat.type}</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${getSeverityColor(threat.severity)}`}>
                        {threat.severity}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">{formatTime(threat.timestamp)}</span>
                  </div>
                  <p className="text-sm text-gray-300 mb-2">{threat.description}</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-400">Affected systems:</span>
                    <div className="flex flex-wrap gap-1">
                      {threat.affectedSystems.map((system, index) => (
                        <span key={index} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                          {system}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};