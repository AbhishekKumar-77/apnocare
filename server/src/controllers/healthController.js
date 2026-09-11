import { getDBStatus } from '../config/db.js';

export const getHealth = (req, res) => {
  const dbStatus = getDBStatus();
  res.status(200).json({
    status: 'online',
    appName: 'ApnoCare API',
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: {
      provider: 'MongoDB Atlas',
      ...dbStatus,
      message: dbStatus.isConnected
        ? 'Successfully connected to MongoDB Atlas'
        : 'Waiting for valid MongoDB Atlas connection string in server/.env',
    },
  });
};
