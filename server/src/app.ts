import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { globalErrorHandler, notFoundHandler } from '@/middlewares';

const app = express();

app.use(helmet());

app.use(cors());

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
});

app.use('/api', limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

export const setupRoutes = async () => {
  try {
    const routes = await import('@/routes');
    app.use('/api', routes.default);
    app.use(notFoundHandler);
    app.use(globalErrorHandler);
  } catch (error) {
    console.error('Error setting up routes:', error);
    throw error;
  }
};

export default app;
