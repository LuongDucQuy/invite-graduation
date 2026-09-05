import app from './app';
import { config } from './config';
import { prisma } from './prisma/client';

const PORT = config.port;

const startServer = async () => {
  try {
    // Verify database connection
    await prisma.$connect();
    console.log('✅ PostgreSQL database connected successfully');

    app.listen(PORT, () => {
      console.log(`🚀 Graduation Invitation API running at http://localhost:${PORT}`);
      console.log(`📡 Environment: ${config.env}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server and DB connections');
  await prisma.$disconnect();
  process.exit(0);
});
