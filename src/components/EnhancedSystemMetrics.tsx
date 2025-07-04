import React from 'react';
import { SystemMetrics as SystemMetricsType } from '../types';
import { MetricsCard } from './MetricsCard';
import { Activity, Zap, AlertTriangle, Cpu, HardDrive, Server, Database, Clock, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface EnhancedSystemMetricsProps {
  metrics: SystemMetricsType;
}

export const EnhancedSystemMetrics: React.FC<EnhancedSystemMetricsProps> = ({ metrics }) => {
  const formatThroughput = (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k`;
    }
    return value.toString();
  };

  const formatUptime = (uptime: number) => {
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    return `${days}d ${hours}h`;
  };

  // Generate sample data for charts
  const generateChartData = (baseValue: number, variance: number = 0.1) => {
    return Array.from({ length: 20 }, (_, i) => ({
      time: i,
      value: baseValue + (Math.random() - 0.5) * baseValue * variance
    }));
  };

  const latencyData = generateChartData(metrics.latency, 0.3);
  const throughputData = generateChartData(metrics.throughput, 0.2);

  return (
    <div className="space-y-6">
      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricsCard
          title="Latency"
          value={metrics.latency.toFixed(1)}
          unit="ms"
          icon={Zap}
          trend={metrics.latency < 25 ? 'down' : metrics.latency > 50 ? 'up' : 'stable'}
          trendValue={`${metrics.latency < 25 ? 'Optimal' : metrics.latency > 50 ? 'High' : 'Normal'}`}
          className={metrics.latency > 50 ? 'border-red-500/30 bg-red-500/5' : ''}
        />
        
        <MetricsCard
          title="Throughput"
          value={formatThroughput(metrics.throughput)}
          unit="TPS"
          icon={Activity}
          trend="stable"
          trendValue="steady"
        />
        
        <MetricsCard
          title="Error Rate"
          value={metrics.errorRate.toFixed(3)}
          unit="%"
          icon={AlertTriangle}
          trend={metrics.errorRate < 0.1 ? 'down' : 'up'}
          trendValue={`${metrics.errorRate < 0.1 ? 'Low' : 'Elevated'}`}
          className={metrics.errorRate > 0.5 ? 'border-red-500/30 bg-red-500/5' : ''}
        />
        
        <MetricsCard
          title="Queue Depth"
          value={metrics.queueDepth}
          unit="msgs"
          icon={Database}
          trend={metrics.queueDepth < 100 ? 'down' : 'up'}
          trendValue={`${metrics.queueDepth < 100 ? 'Normal' : 'Backlog'}`}
        />
      </div>

      {/* Secondary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricsCard
          title="CPU Usage"
          value={metrics.cpuUsage.toFixed(0)}
          unit="%"
          icon={Cpu}
          trend={metrics.cpuUsage < 60 ? 'down' : 'up'}
          trendValue={`${metrics.cpuUsage < 60 ? 'Normal' : 'High'}`}
          className={metrics.cpuUsage > 80 ? 'border-yellow-500/30 bg-yellow-500/5' : ''}
        />
        
        <MetricsCard
          title="Memory Usage"
          value={metrics.memoryUsage.toFixed(0)}
          unit="%"
          icon={HardDrive}
          trend={metrics.memoryUsage < 70 ? 'down' : 'up'}
          trendValue={`${metrics.memoryUsage < 70 ? 'Normal' : 'High'}`}
          className={metrics.memoryUsage > 85 ? 'border-yellow-500/30 bg-yellow-500/5' : ''}
        />
        
        <MetricsCard
          title="Active Nodes"
          value={metrics.activeNodes}
          unit="nodes"
          icon={Server}
          trend="stable"
          trendValue="online"
        />

        <MetricsCard
          title="Model Accuracy"
          value={metrics.modelAccuracy.toFixed(1)}
          unit="%"
          icon={TrendingUp}
          trend={metrics.modelAccuracy > 90 ? 'up' : 'down'}
          trendValue={`${metrics.modelAccuracy > 90 ? 'Excellent' : 'Degraded'}`}
          className={metrics.modelAccuracy < 85 ? 'border-red-500/30 bg-red-500/5' : ''}
        />
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Latency Trend</h3>
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-400">Last 20 samples</span>
            </div>
          </div>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={latencyData}>
                <XAxis dataKey="time" hide />
                <YAxis hide />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Throughput Trend</h3>
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-green-400" />
              <span className="text-sm text-gray-400">Transactions/sec</span>
            </div>
          </div>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={throughputData}>
                <XAxis dataKey="time" hide />
                <YAxis hide />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#10b981" 
                  fill="#10b981"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* System Status Summary */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">System Status Summary</h3>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-gray-400">Uptime: {formatUptime(metrics.uptime)}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-700/50 rounded-lg p-3">
            <div className="text-sm text-gray-400 mb-1">Performance Status</div>
            <div className={`text-lg font-semibold ${
              metrics.latency < 30 && metrics.errorRate < 0.1 ? 'text-green-400' :
              metrics.latency < 50 && metrics.errorRate < 0.5 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {metrics.latency < 30 && metrics.errorRate < 0.1 ? 'Optimal' :
               metrics.latency < 50 && metrics.errorRate < 0.5 ? 'Degraded' : 'Critical'}
            </div>
          </div>
          
          <div className="bg-gray-700/50 rounded-lg p-3">
            <div className="text-sm text-gray-400 mb-1">Resource Utilization</div>
            <div className={`text-lg font-semibold ${
              metrics.cpuUsage < 70 && metrics.memoryUsage < 80 ? 'text-green-400' :
              metrics.cpuUsage < 85 && metrics.memoryUsage < 90 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {metrics.cpuUsage < 70 && metrics.memoryUsage < 80 ? 'Normal' :
               metrics.cpuUsage < 85 && metrics.memoryUsage < 90 ? 'High' : 'Critical'}
            </div>
          </div>
          
          <div className="bg-gray-700/50 rounded-lg p-3">
            <div className="text-sm text-gray-400 mb-1">ML Pipeline Health</div>
            <div className={`text-lg font-semibold ${
              metrics.modelAccuracy > 90 ? 'text-green-400' :
              metrics.modelAccuracy > 85 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {metrics.modelAccuracy > 90 ? 'Excellent' :
               metrics.modelAccuracy > 85 ? 'Good' : 'Needs Attention'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};