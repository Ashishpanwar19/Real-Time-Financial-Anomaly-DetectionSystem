import { useState, useEffect } from 'react';
import { DockerStatus } from '../types';

const generateDockerStatus = (): DockerStatus => {
  const containers = [
    {
      name: 'finsecure-app',
      status: Math.random() > 0.95 ? 'error' : 'running',
      uptime: Math.random() * 86400000 + 3600000, // 1-24 hours
      cpu: Math.random() * 30 + 10, // 10-40%
      memory: Math.random() * 40 + 30, // 30-70%
      health: Math.random() > 0.9 ? 'unhealthy' : 'healthy'
    },
    {
      name: 'redis',
      status: Math.random() > 0.98 ? 'stopped' : 'running',
      uptime: Math.random() * 172800000 + 7200000, // 2-48 hours
      cpu: Math.random() * 10 + 2, // 2-12%
      memory: Math.random() * 20 + 15, // 15-35%
      health: Math.random() > 0.95 ? 'unhealthy' : 'healthy'
    },
    {
      name: 'postgres',
      status: Math.random() > 0.97 ? 'error' : 'running',
      uptime: Math.random() * 259200000 + 10800000, // 3-72 hours
      cpu: Math.random() * 25 + 5, // 5-30%
      memory: Math.random() * 35 + 25, // 25-60%
      health: Math.random() > 0.92 ? 'unhealthy' : 'healthy'
    },
    {
      name: 'kafka',
      status: Math.random() > 0.96 ? 'starting' : 'running',
      uptime: Math.random() * 345600000 + 14400000, // 4-96 hours
      cpu: Math.random() * 20 + 8, // 8-28%
      memory: Math.random() * 30 + 40, // 40-70%
      health: Math.random() > 0.93 ? 'starting' : 'healthy'
    },
    {
      name: 'ml-pipeline',
      status: Math.random() > 0.94 ? 'error' : 'running',
      uptime: Math.random() * 172800000 + 3600000, // 1-48 hours
      cpu: Math.random() * 50 + 20, // 20-70%
      memory: Math.random() * 40 + 50, // 50-90%
      health: Math.random() > 0.88 ? 'unhealthy' : 'healthy'
    }
  ] as const;

  return {
    containers: containers.map(container => ({
      ...container,
      status: container.status as 'running' | 'stopped' | 'error' | 'starting',
      health: container.health as 'healthy' | 'unhealthy' | 'starting'
    })),
    services: {
      kafka: Math.random() > 0.05,
      redis: Math.random() > 0.02,
      postgres: Math.random() > 0.03,
      ml_pipeline: Math.random() > 0.08
    },
    lastUpdate: Date.now()
  };
};

export const useDockerStatus = () => {
  const [dockerStatus, setDockerStatus] = useState<DockerStatus>(generateDockerStatus());

  useEffect(() => {
    const interval = setInterval(() => {
      setDockerStatus(generateDockerStatus());
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const healthyContainers = dockerStatus.containers.filter(c => c.health === 'healthy').length;
  const totalContainers = dockerStatus.containers.length;
  const systemHealth = (healthyContainers / totalContainers) * 100;

  const allServicesUp = Object.values(dockerStatus.services).every(Boolean);

  return {
    dockerStatus,
    systemHealth,
    allServicesUp,
    healthyContainers,
    totalContainers
  };
};