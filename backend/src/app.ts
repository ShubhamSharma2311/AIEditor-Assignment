import express, { Request, Response } from 'express';
import cors from 'cors';
import { imageRoutes } from './routes/imageRoutes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'AI Image Editor API is running' });
});

// Routes
app.use('/api/image', imageRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
