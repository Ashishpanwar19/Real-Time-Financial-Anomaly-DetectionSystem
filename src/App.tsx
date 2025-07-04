import React, { useMemo } from 'react';
import { Header } from './components/Header';
import { EnhancedSystemMetrics } from './components/EnhancedSystemMetrics';
import { TransactionStream } from './components/TransactionStream';
import { NetworkGraph } from './components/NetworkGraph';
import { RiskDashboard } from './components/RiskDashboard';
import { ThreatIntelligence } from './components/ThreatIntelligence';
import { AlertsPanel } from './components/AlertsPanel';
import { DockerMonitor } from './components/DockerMonitor';
import { LiveStreamPanel } from './components/LiveStreamPanel';
import { AnimatedBackground } from './components/AnimatedBackground';
import { useRealtimeData } from './hooks/useRealtimeData';
import { useAuth } from './hooks/useAuth';
import { useAlerts } from './hooks/useAlerts';
import { useDockerStatus } from './hooks/useDockerStatus';

function App() {
  const { transactions, systemMetrics, threatIntel, riskModels, isConnected } = useRealtimeData();
  const { currentUser, isLoading, switchUser, logout, availableUsers } = useAuth();
  const { 
    alerts, 
    criticalAlerts, 
    activeAlerts, 
    criticalCount,
    acknowledgeAlert, 
    resolveAlert, 
    escalateAlert 
  } = useAlerts();
  const { dockerStatus, systemHealth, allServicesUp } = useDockerStatus();

  const systemStatus = useMemo(() => {
    const highRiskTransactions = transactions.filter(tx => tx.riskScore >= 70).length;
    const criticalThreats = threatIntel.filter(threat => threat.severity === 'critical').length;
    const highLatency = systemMetrics.latency > 50;
    const highErrorRate = systemMetrics.errorRate > 0.5;
    const lowModelAccuracy = systemMetrics.modelAccuracy < 85;
    const systemIssues = !allServicesUp || systemHealth < 80;

    if (criticalThreats > 0 || highLatency || highErrorRate || lowModelAccuracy || systemIssues) {
      return 'critical';
    }
    if (highRiskTransactions > 5 || threatIntel.length > 10 || systemMetrics.latency > 30) {
      return 'warning';
    }
    return 'healthy';
  }, [transactions, threatIntel, systemMetrics, allServicesUp, systemHealth]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center relative">
        <AnimatedBackground />
        <div className="text-center relative z-10">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white text-lg">Initializing FinSecure Analytics...</div>
          <div className="text-gray-400 text-sm mt-2">Loading user profile and system status</div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center relative">
        <AnimatedBackground />
        <div className="text-center relative z-10">
          <div className="text-red-400 text-lg">Authentication Required</div>
          <div className="text-gray-400 text-sm mt-2">Please contact your system administrator</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white relative">
      <AnimatedBackground />
      
      <div className="relative z-10">
        <Header 
          isConnected={isConnected} 
          activeAlerts={activeAlerts.length}
          criticalCount={criticalCount}
          systemStatus={systemStatus}
          currentUser={currentUser}
          onSwitchUser={switchUser}
          onLogout={logout}
          availableUsers={availableUsers}
        />
        
        <main className="p-6 space-y-6">
          {/* Welcome Section */}
          <section className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Welcome back, {currentUser.name}
                </h2>
                <p className="text-gray-400 mt-1">
                  {currentUser.department} • {currentUser.role.replace('_', ' ').toUpperCase()} Access
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400">Current Session</div>
                <div className="text-white font-medium">
                  {new Date().toLocaleDateString()} • {new Date().toLocaleTimeString()}
                </div>
              </div>
            </div>
          </section>

          {/* Live Stream Panel */}
          <section>
            <LiveStreamPanel
              isConnected={isConnected}
              transactionCount={transactions.length}
              alertCount={activeAlerts.length}
            />
          </section>

          {/* System Performance Metrics */}
          {currentUser.permissions.includes('view_all') && (
            <section>
              <h2 className="text-xl font-semibold mb-4">System Performance & Infrastructure</h2>
              <EnhancedSystemMetrics metrics={systemMetrics} />
            </section>
          )}

          {/* Docker Infrastructure Monitoring */}
          {currentUser.permissions.includes('view_all') && (
            <section>
              <DockerMonitor 
                dockerStatus={dockerStatus}
                systemHealth={systemHealth}
                allServicesUp={allServicesUp}
              />
            </section>
          )}

          {/* Alert Management */}
          {currentUser.permissions.includes('manage_alerts') && (
            <section>
              <AlertsPanel
                alerts={alerts}
                criticalAlerts={criticalAlerts}
                onAcknowledge={acknowledgeAlert}
                onResolve={resolveAlert}
                onEscalate={escalateAlert}
              />
            </section>
          )}

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Transaction Stream */}
            {currentUser.permissions.includes('view_transactions') && (
              <div className="lg:col-span-1">
                <TransactionStream transactions={transactions} />
              </div>
            )}
            
            {/* Network Graph */}
            {currentUser.permissions.includes('view_all') && (
              <div className="lg:col-span-1">
                <NetworkGraph transactions={transactions} />
              </div>
            )}
          </div>

          {/* Risk Management and Threat Intelligence */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Risk Dashboard */}
            {(currentUser.permissions.includes('view_models') || currentUser.permissions.includes('configure_models')) && (
              <div className="lg:col-span-1">
                <RiskDashboard riskModels={riskModels} />
              </div>
            )}
            
            {/* Threat Intelligence */}
            {currentUser.permissions.includes('view_all') && (
              <div className="lg:col-span-1">
                <ThreatIntelligence threats={threatIntel} />
              </div>
            )}
          </div>

          {/* Footer Information */}
          <footer className="border-t border-gray-800 pt-6 mt-8 backdrop-blur-sm">
            <div className="flex items-center justify-between text-sm text-gray-400">
              <div>
                FinSecure Analytics Platform v1.0.0 • Real-Time Financial Anomaly Detection
              </div>
              <div className="flex items-center space-x-4">
                <span>Docker: {dockerStatus.containers.filter(c => c.status === 'running').length}/{dockerStatus.containers.length} Running</span>
                <span>Uptime: {Math.floor(systemMetrics.uptime / 86400)}d {Math.floor((systemMetrics.uptime % 86400) / 3600)}h</span>
                <span>User: {currentUser.role.toUpperCase()}</span>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App;