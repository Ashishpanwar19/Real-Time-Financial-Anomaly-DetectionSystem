import React, { useState } from 'react';
import { DockerStatus } from '../types';
import { Container, Server, Activity, AlertCircle, CheckCircle, Clock, Cpu, HardDrive } from 'lucide-react';

interface DockerMonitorProps {
  dockerStatus: DockerStatus;
  systemHealth: number;
  allServicesUp: boolean;
}

export const DockerMonitor: React.FC<DockerMonitorProps> = ({
  dockerStatus,
  systemHealth,
  allServicesUp
}) => {
  const [selectedContainer, setSelectedContainer] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-green-400 bg-green-400/10';
      case 'stopped': return 'text-red-400 bg-red-400/10';
      case 'error': return 'text-red-400 bg-red-400/10';
      case 'starting': return 'text-yellow-400 bg-yellow-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-400';
      case 'unhealthy': return 'text-red-400';
      case 'starting': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <CheckCircle className="w-4 h-4" />;
      case 'stopped': return <AlertCircle className="w-4 h-4" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      case 'starting': return <Clock className="w-4 h-4" />;
      default: return <Container className="w-4 h-4" />;
    }
  };

  const formatUptime = (uptime: number) => {
    const hours = Math.floor(uptime / 3600000);
    const minutes = Math.floor((uptime % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  };

  const formatLastUpdate = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const seconds = Math.floor(diff / 1000);
    return `${seconds}s ago`;
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Docker Infrastructure</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${allServicesUp ? 'bg-green-400' : 'bg-red-400'}`} />
              <span className="text-sm text-gray-400">
                System Health: {systemHealth.toFixed(0)}%
              </span>
            </div>
            <div className="text-xs text-gray-500">
              Updated {formatLastUpdate(dockerStatus.lastUpdate)}
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* Containers */}
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-3">Containers</h4>
            <div className="space-y-2">
              {dockerStatus.containers.map((container) => (
                <div
                  key={container.name}
                  className="bg-gray-700/50 rounded-lg p-3 cursor-pointer hover:bg-gray-700 transition-colors"
                  onClick={() => setSelectedContainer(
                    selectedContainer === container.name ? null : container.name
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-1 rounded ${getStatusColor(container.status)}`}>
                        {getStatusIcon(container.status)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{container.name}</div>
                        <div className="text-xs text-gray-400">
                          Uptime: {formatUptime(container.uptime)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xs font-medium ${getHealthColor(container.health)}`}>
                        {container.health}
                      </div>
                      <div className="text-xs text-gray-400">
                        CPU: {container.cpu.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  
                  {selectedContainer === container.name && (
                    <div className="mt-3 pt-3 border-t border-gray-600 grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <Cpu className="w-3 h-3 text-blue-400" />
                          <span className="text-xs text-gray-400">CPU Usage</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-600 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full bg-blue-400"
                              style={{ width: `${container.cpu}%` }}
                            />
                          </div>
                          <span className="text-xs text-white">{container.cpu.toFixed(1)}%</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <HardDrive className="w-3 h-3 text-green-400" />
                          <span className="text-xs text-gray-400">Memory Usage</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-600 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full bg-green-400"
                              style={{ width: `${container.memory}%` }}
                            />
                          </div>
                          <span className="text-xs text-white">{container.memory.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Services */}
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-3">Services</h4>
            <div className="space-y-2">
              {Object.entries(dockerStatus.services).map(([service, isUp]) => (
                <div key={service} className="bg-gray-700/50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-1 rounded ${isUp ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>
                        <Server className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white capitalize">
                          {service.replace('_', ' ')}
                        </div>
                        <div className="text-xs text-gray-400">
                          {service === 'kafka' && 'Message Streaming'}
                          {service === 'redis' && 'In-Memory Cache'}
                          {service === 'postgres' && 'Database'}
                          {service === 'ml_pipeline' && 'ML Processing'}
                        </div>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      isUp ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {isUp ? 'Online' : 'Offline'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* System Overview */}
        <div className="bg-gray-700/30 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-300">Infrastructure Overview</h4>
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-400">Real-time Monitoring</span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {dockerStatus.containers.filter(c => c.status === 'running').length}
              </div>
              <div className="text-xs text-gray-400">Running Containers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {Object.values(dockerStatus.services).filter(Boolean).length}
              </div>
              <div className="text-xs text-gray-400">Active Services</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${systemHealth >= 80 ? 'text-green-400' : systemHealth >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                {systemHealth.toFixed(0)}%
              </div>
              <div className="text-xs text-gray-400">System Health</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};