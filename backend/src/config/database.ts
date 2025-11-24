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
  } catch (error: unknown) {
    console.warn('⚠️  MongoDB connection failed. Running without database (history features disabled)');
    // Don't exit - let the app run without DB
  }
};
