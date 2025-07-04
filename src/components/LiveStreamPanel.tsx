import React, { useState, useEffect } from 'react';
import { Activity, Play, Pause, Settings, BarChart3, Zap, AlertTriangle } from 'lucide-react';

interface LiveStreamPanelProps {
  isConnected: boolean;
  transactionCount: number;
  alertCount: number;
}

export const LiveStreamPanel: React.FC<LiveStreamPanelProps> = ({
  isConnected,
  transactionCount,
  alertCount
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [streamRate, setStreamRate] = useState(1.0);
  const [showSettings, setShowSettings] = useState(false);
  const [dataPoints, setDataPoints] = useState<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying) {
        setDataPoints(prev => {
          const newPoint = Math.random() * 100 + 50;
          return [...prev.slice(-19), newPoint];
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const toggleStream = () => {
    setIsPlaying(!isPlaying);
  };

  const handleRateChange = (rate: number) => {
    setStreamRate(rate);
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 shadow-xl">
      <div className="p-4 border-b border-gray-700 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Activity className="w-6 h-6 text-blue-400" />
              {isConnected && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Live Data Stream</h3>
              <p className="text-sm text-gray-400">Real-time transaction monitoring</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleStream}
              className={`p-2 rounded-lg transition-colors ${
                isPlaying 
                  ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                  : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/20 rounded-lg p-3 border border-blue-500/20">
            <div className="flex items-center space-x-2 mb-2">
              <BarChart3 className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-300">Transactions</span>
            </div>
            <div className="text-xl font-bold text-white">{transactionCount.toLocaleString()}</div>
            <div className="text-xs text-blue-400">+{Math.floor(Math.random() * 50 + 10)}/min</div>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-green-600/20 rounded-lg p-3 border border-green-500/20">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="w-4 h-4 text-green-400" />
              <span className="text-sm text-gray-300">Throughput</span>
            </div>
            <div className="text-xl font-bold text-white">{(Math.random() * 5000 + 8000).toFixed(0)}</div>
            <div className="text-xs text-green-400">TPS</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/20 rounded-lg p-3 border border-orange-500/20">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-orange-400" />
              <span className="text-sm text-gray-300">Alerts</span>
            </div>
            <div className="text-xl font-bold text-white">{alertCount}</div>
            <div className="text-xs text-orange-400">Active</div>
          </div>
        </div>

        {/* Live Chart */}
        <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-600/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Stream Activity</span>
            <div className={`flex items-center space-x-1 ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
              <span className="text-xs">{isConnected ? 'Connected' : 'Disconnected'}</span>
            </div>
          </div>
          
          <div className="h-16 flex items-end space-x-1">
            {dataPoints.map((point, index) => (
              <div
                key={index}
                className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t opacity-80"
                style={{
                  height: `${(point / 150) * 100}%`,
                  width: '4px',
                  minHeight: '2px'
                }}
              />
            ))}
          </div>
        </div>

        {showSettings && (
          <div className="mt-4 bg-gray-700/50 rounded-lg p-3 border border-gray-600/50">
            <h4 className="text-sm font-medium text-white mb-3">Stream Settings</h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-400">Stream Rate</label>
                <div className="flex items-center space-x-2 mt-1">
                  {[0.5, 1.0, 2.0, 5.0].map(rate => (
                    <button
                      key={rate}
                      onClick={() => handleRateChange(rate)}
                      className={`px-2 py-1 rounded text-xs transition-colors ${
                        streamRate === rate
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-xs text-gray-400">Data Sources</label>
                <div className="mt-1 space-y-1">
                  {['Kafka Stream', 'Redis Cache', 'ML Pipeline', 'Alert Engine'].map(source => (
                    <div key={source} className="flex items-center justify-between">
                      <span className="text-xs text-gray-300">{source}</span>
                      <div className="w-2 h-2 bg-green-400 rounded-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};