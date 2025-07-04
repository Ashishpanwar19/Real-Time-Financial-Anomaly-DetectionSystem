import React from 'react';
import { SystemMetrics as SystemMetricsType } from '../types';
import { MetricsCard } from './MetricsCard';
import { Activity, Zap, AlertTriangle, Cpu, HardDrive, Server } from 'lucide-react';

interface SystemMetricsProps {
  metrics: SystemMetricsType;
}

export const SystemMetrics: React.FC<SystemMetricsProps> = ({ metrics }) => {
  const formatThroughput = (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k`;
    }
    return value.toString();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <MetricsCard
        title="Latency"
        value={metrics.latency.toFixed(1)}
        unit="ms"
        icon={Zap}
        trend={metrics.latency < 25 ? 'down' : 'up'}
        trendValue={`${metrics.latency < 25 ? '-' : '+'}${Math.abs(metrics.latency - 25).toFixed(1)}ms`}
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
        value={metrics.errorRate.toFixed(2)}
        unit="%"
        icon={AlertTriangle}
        trend={metrics.errorRate < 0.1 ? 'down' : 'up'}
        trendValue={`${metrics.errorRate < 0.1 ? '-' : '+'}${Math.abs(metrics.errorRate - 0.1).toFixed(2)}%`}
      />
      
      <MetricsCard
        title="CPU Usage"
        value={metrics.cpuUsage.toFixed(0)}
        unit="%"
        icon={Cpu}
        trend={metrics.cpuUsage < 60 ? 'down' : 'up'}
        trendValue={`${metrics.cpuUsage < 60 ? '-' : '+'}${Math.abs(metrics.cpuUsage - 60).toFixed(0)}%`}
      />
      
      <MetricsCard
        title="Memory Usage"
        value={metrics.memoryUsage.toFixed(0)}
        unit="%"
        icon={HardDrive}
        trend={metrics.memoryUsage < 70 ? 'down' : 'up'}
        trendValue={`${metrics.memoryUsage < 70 ? '-' : '+'}${Math.abs(metrics.memoryUsage - 70).toFixed(0)}%`}
      />
      
      <MetricsCard
        title="Active Nodes"
        value={metrics.activeNodes}
        unit="nodes"
        icon={Server}
        trend="stable"
        trendValue="online"
      />
    </div>
  );
};