import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.DATABASE_URL;
    
    if (!mongoURI) {
      console.warn('⚠️  DATABASE_URL not set. Running without database (history features disabled)');
      return;
    }
    
    await mongoose.connect(mongoURI);
    
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.warn('⚠️  MongoDB connection failed. Running without database (history features disabled)');
    console.error('MongoDB error details:', error);
    // Don't exit - let the app run without DB
  }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});
