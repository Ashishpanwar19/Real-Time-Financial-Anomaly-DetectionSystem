import React, { useState } from 'react';
import { Alert } from '../types';
import { AlertTriangle, CheckCircle, Clock, Zap, Shield, TrendingUp, Eye, X, ArrowUp } from 'lucide-react';

interface AlertsPanelProps {
  alerts: Alert[];
  criticalAlerts: Alert[];
  onAcknowledge: (alertId: string) => void;
  onResolve: (alertId: string) => void;
  onEscalate: (alertId: string) => void;
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({
  alerts,
  criticalAlerts,
  onAcknowledge,
  onResolve,
  onEscalate
}) => {
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [filter, setFilter] = useState<'all' | 'critical' | 'active' | 'resolved'>('all');

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="w-4 h-4" />;
      case 'high': return <Zap className="w-4 h-4" />;
      case 'medium': return <Eye className="w-4 h-4" />;
      case 'low': return <TrendingUp className="w-4 h-4" />;
      case 'info': return <Shield className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getAlertColor = (type: Alert['type']) => {
    switch (type) {
      case 'critical': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'high': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'low': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'info': return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getStatusColor = (status: Alert['status']) => {
    switch (status) {
      case 'active': return 'text-red-400 bg-red-400/10';
      case 'acknowledged': return 'text-yellow-400 bg-yellow-400/10';
      case 'resolved': return 'text-green-400 bg-green-400/10';
      case 'escalated': return 'text-purple-400 bg-purple-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ago`;
    }
    return `${minutes}m ago`;
  };

  const formatImpact = (impact: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(impact);
  };

  const filteredAlerts = alerts.filter(alert => {
    switch (filter) {
      case 'critical': return alert.type === 'critical' || alert.type === 'high';
      case 'active': return alert.status === 'active';
      case 'resolved': return alert.status === 'resolved';
      default: return true;
    }
  });

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Alert Management</h3>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-red-500/20 text-red-400 px-2 py-1 rounded">
              <AlertTriangle className="w-3 h-3" />
              <span className="text-xs">{criticalAlerts.filter(a => a.status === 'active').length} Critical</span>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          {(['all', 'critical', 'active', 'resolved'] as const).map(filterType => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                filter === filterType
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No alerts match the current filter</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className="p-4 border-b border-gray-700/50 hover:bg-gray-700/30 cursor-pointer transition-colors"
              onClick={() => setSelectedAlert(alert)}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg border ${getAlertColor(alert.type)}`}>
                  {getAlertIcon(alert.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-white">{alert.title}</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(alert.status)}`}>
                        {alert.status}
                      </span>
                      {alert.escalationLevel > 0 && (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-purple-500/20 text-purple-400">
                          L{alert.escalationLevel}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">{formatTime(alert.timestamp)}</span>
                  </div>
                  <p className="text-sm text-gray-300 mb-2">{alert.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs text-gray-400">
                      <span>Severity: {alert.severity}</span>
                      <span>Impact: {formatImpact(alert.estimatedImpact)}</span>
                      <span className="capitalize">{alert.category}</span>
                    </div>
                    <div className="flex space-x-1">
                      {alert.status === 'active' && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onAcknowledge(alert.id);
                            }}
                            className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs hover:bg-yellow-500/30"
                          >
                            Ack
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onEscalate(alert.id);
                            }}
                            className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs hover:bg-purple-500/30"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                        </>
                      )}
                      {(alert.status === 'acknowledged' || alert.status === 'escalated') && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onResolve(alert.id);
                          }}
                          className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs hover:bg-green-500/30"
                        >
                          Resolve
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {selectedAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 border border-gray-700 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-white">Alert Details</h4>
              <button
                onClick={() => setSelectedAlert(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg border ${getAlertColor(selectedAlert.type)}`}>
                  {getAlertIcon(selectedAlert.type)}
                </div>
                <div>
                  <h5 className="font-medium text-white">{selectedAlert.title}</h5>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getAlertColor(selectedAlert.type)}`}>
                      {selectedAlert.type.toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(selectedAlert.status)}`}>
                      {selectedAlert.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-700/50 rounded-lg p-4">
                <p className="text-gray-300">{selectedAlert.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400">Severity Score</label>
                  <div className="text-white font-medium">{selectedAlert.severity}/100</div>
                </div>
                <div>
                  <label className="text-xs text-gray-400">Estimated Impact</label>
                  <div className="text-white font-medium">{formatImpact(selectedAlert.estimatedImpact)}</div>
                </div>
                <div>
                  <label className="text-xs text-gray-400">Category</label>
                  <div className="text-white font-medium capitalize">{selectedAlert.category}</div>
                </div>
                <div>
                  <label className="text-xs text-gray-400">Escalation Level</label>
                  <div className="text-white font-medium">Level {selectedAlert.escalationLevel}</div>
                </div>
              </div>
              
              <div>
                <label className="text-xs text-gray-400">Related Transactions</label>
                <div className="mt-2 flex flex-wrap gap-1">
                  {selectedAlert.relatedTransactions.map(txId => (
                    <span key={txId} className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">
                      {txId}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex space-x-2 pt-4 border-t border-gray-700">
                {selectedAlert.status === 'active' && (
                  <>
                    <button
                      onClick={() => {
                        onAcknowledge(selectedAlert.id);
                        setSelectedAlert(null);
                      }}
                      className="px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded hover:bg-yellow-500/30"
                    >
                      Acknowledge
                    </button>
                    <button
                      onClick={() => {
                        onEscalate(selectedAlert.id);
                        setSelectedAlert(null);
                      }}
                      className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded hover:bg-purple-500/30"
                    >
                      Escalate
                    </button>
                  </>
                )}
                {(selectedAlert.status === 'acknowledged' || selectedAlert.status === 'escalated') && (
                  <button
                    onClick={() => {
                      onResolve(selectedAlert.id);
                      setSelectedAlert(null);
                    }}
                    className="px-4 py-2 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30"
                  >
                    Resolve
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};