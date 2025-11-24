import dotenv from 'dotenv';
import app from './app';
import { connectDB } from './config/database';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/health`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
      console.log(`🎨 Image edit endpoint: http://localhost:${PORT}/api/image/edit`);
      console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth/login`);
      console.log(`📜 History endpoint: http://localhost:${PORT}/api/history`);
    });
  } catch (error: unknown) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
