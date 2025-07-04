import React, { useState } from 'react';
import { Transaction } from '../types';
import { Activity, AlertTriangle, CheckCircle, Clock, DollarSign, MapPin, Smartphone } from 'lucide-react';

interface TransactionStreamProps {
  transactions: Transaction[];
}

export const TransactionStream: React.FC<TransactionStreamProps> = ({ transactions }) => {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'approved': return 'text-green-400 bg-green-400/10';
      case 'pending': return 'text-yellow-400 bg-yellow-400/10';
      case 'flagged': return 'text-orange-400 bg-orange-400/10';
      case 'blocked': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getStatusIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'flagged': return <AlertTriangle className="w-4 h-4" />;
      case 'blocked': return <AlertTriangle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 70) return 'text-red-400 bg-red-400/10';
    if (score >= 40) return 'text-yellow-400 bg-yellow-400/10';
    return 'text-green-400 bg-green-400/10';
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Live Transaction Stream</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-gray-400">Real-time</span>
          </div>
        </div>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="p-4 border-b border-gray-700/50 hover:bg-gray-700/50 cursor-pointer transition-colors"
            onClick={() => setSelectedTransaction(transaction)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${getStatusColor(transaction.status)}`}>
                  {getStatusIcon(transaction.status)}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-white">
                      {formatAmount(transaction.amount)}
                    </span>
                    <span className="text-xs text-gray-400">{transaction.currency}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-400">
                    <span>{transaction.fromAccount}</span>
                    <span>→</span>
                    <span>{transaction.toAccount}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className={`px-2 py-1 rounded text-xs font-medium ${getRiskScoreColor(transaction.riskScore)}`}>
                  Risk: {transaction.riskScore.toFixed(0)}
                </div>
                <div className="text-xs text-gray-400">
                  {formatTime(transaction.timestamp)}
                </div>
              </div>
            </div>
            
            {transaction.anomalyType !== 'none' && (
              <div className="mt-2 flex items-center space-x-2">
                <AlertTriangle className="w-3 h-3 text-orange-400" />
                <span className="text-xs text-orange-400 capitalize">
                  {transaction.anomalyType} anomaly detected
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-white">Transaction Details</h4>
              <button
                onClick={() => setSelectedTransaction(null)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400">Amount</label>
                  <div className="text-white font-medium">
                    {formatAmount(selectedTransaction.amount)} {selectedTransaction.currency}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-400">Status</label>
                  <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded text-xs ${getStatusColor(selectedTransaction.status)}`}>
                    {getStatusIcon(selectedTransaction.status)}
                    <span className="capitalize">{selectedTransaction.status}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-xs text-gray-400">Risk Score</label>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${selectedTransaction.riskScore >= 70 ? 'bg-red-400' : selectedTransaction.riskScore >= 40 ? 'bg-yellow-400' : 'bg-green-400'}`}
                      style={{ width: `${selectedTransaction.riskScore}%` }}
                    />
                  </div>
                  <span className="text-white text-sm">{selectedTransaction.riskScore.toFixed(0)}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>Location</span>
                  </label>
                  <div className="text-white text-sm">{selectedTransaction.location}</div>
                </div>
                <div>
                  <label className="text-xs text-gray-400 flex items-center space-x-1">
                    <Smartphone className="w-3 h-3" />
                    <span>Device</span>
                  </label>
                  <div className="text-white text-sm">{selectedTransaction.deviceId}</div>
                </div>
              </div>
              
              {selectedTransaction.anomalyType !== 'none' && (
                <div className="bg-orange-400/10 border border-orange-400/20 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-orange-400" />
                    <span className="text-orange-400 font-medium">Anomaly Detected</span>
                  </div>
                  <p className="text-sm text-orange-300 mt-1 capitalize">
                    {selectedTransaction.anomalyType} anomaly pattern identified
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};