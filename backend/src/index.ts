import dotenv from 'dotenv';
import app from './app';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`🎨 Image edit endpoint: http://localhost:${PORT}/api/image/edit`);
});
