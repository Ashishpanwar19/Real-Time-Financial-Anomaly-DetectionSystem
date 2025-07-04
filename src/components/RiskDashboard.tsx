import React from 'react';
import { RiskModel } from '../types';
import { TrendingUp, TrendingDown, AlertTriangle, DollarSign, BarChart3, PieChart } from 'lucide-react';

interface RiskDashboardProps {
  riskModels: RiskModel[];
}

export const RiskDashboard: React.FC<RiskDashboardProps> = ({ riskModels }) => {
  const getModelIcon = (type: RiskModel['type']) => {
    switch (type) {
      case 'var': return <TrendingDown className="w-5 h-5" />;
      case 'monteCarlo': return <BarChart3 className="w-5 h-5" />;
      case 'stress': return <AlertTriangle className="w-5 h-5" />;
      case 'scenario': return <PieChart className="w-5 h-5" />;
      default: return <DollarSign className="w-5 h-5" />;
    }
  };

  const getModelColor = (type: RiskModel['type']) => {
    switch (type) {
      case 'var': return 'text-blue-400 bg-blue-400/10';
      case 'monteCarlo': return 'text-green-400 bg-green-400/10';
      case 'stress': return 'text-red-400 bg-red-400/10';
      case 'scenario': return 'text-yellow-400 bg-yellow-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const formatValue = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700">
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-white">Risk Management Models</h3>
        <p className="text-sm text-gray-400 mt-1">Financial engineering & quantitative risk analysis</p>
      </div>
      
      <div className="p-4 space-y-4">
        {riskModels.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Risk models loading...</p>
          </div>
        ) : (
          riskModels.map((model) => (
            <div key={model.id} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getModelColor(model.type)}`}>
                    {getModelIcon(model.type)}
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{model.name}</h4>
                    <p className="text-xs text-gray-400 capitalize">{model.type} model</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">Last updated</div>
                  <div className="text-xs text-gray-500">{formatTime(model.lastUpdated)}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400">Risk Value</label>
                  <div className="text-lg font-bold text-white">{formatValue(model.value)}</div>
                </div>
                <div>
                  <label className="text-xs text-gray-400">Confidence Level</label>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-600 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-blue-400"
                        style={{ width: `${model.confidence}%` }}
                      />
                    </div>
                    <span className="text-sm text-white">{model.confidence.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-600/50">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Model Performance</span>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-3 h-3 text-green-400" />
                    <span className="text-green-400">Stable</span>
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