import 'dotenv/config';
import app from './app';
import { database } from './config/database';

const PORT = process.env.PORT || 3000;

/**
 * Start server with database connection
 */
async function startServer() {
  try {
    // Connect to database
    await database.connect();

    // Start Express server
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });

    // Graceful shutdown handlers
    const gracefulShutdown = async (signal: string) => {
      console.log(`\n${signal} received. Starting graceful shutdown...`);
      
      server.close(async () => {
        console.log('✅ HTTP server closed');
        
        try {
          await database.disconnect();
          console.log('✅ Database connection closed');
          process.exit(0);
        } catch (error) {
          console.error('❌ Error during database disconnect:', error);
          process.exit(1);
        }
      });

      // Force close after 10 seconds
      setTimeout(() => {
        console.error('⚠️  Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();