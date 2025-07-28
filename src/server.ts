import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import path from 'path';
import dotenv from 'dotenv';
import { initializeDatabase, pool } from './database';

dotenv.config()

const app: Application = express();
const PORT: number = parseInt(process.env.PORT || '5000');

// --- Security & Utility Middleware ---
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "img-src": ["'self'", "data:", ""],
            "connect-src": ["'self'", "http://localhost:3000", "http://localhost:5173"],
        },
    },
}));

// Configure CORS
const corsOptions: cors.CorsOptions = {
  origin: process.env.NODE_ENV === 'production' ? 'https://yourdomain.com' : ['http://localhost:3000', 'http://localhost:5173'],
  optionsSuccessStatus: 200,
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Morgan for HTTP request logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// --- Rate Limiting ---
const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: { error: 'Too many requests from this IP, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(generalLimiter);

const authLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.RATE_LIMIT_AUTH_MAX || '5'),
  message: { error: 'Too many authentication attempts from this IP, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/auth', authLimiter);

// --- Database Initialization ---
initializeDatabase().catch(err => {
    console.error('💥 Critical error initializing database:', err);
    process.exit(1);
});

// --- API Routes ---
import authRoutes from './routes/auth';
import requestRoutes from './routes/requests';
import providerRoutes from './routes/providers';
import chatRoutes from './routes/chat';
import paymentRoutes from './routes/payments';
import adminRoutes from './routes/admin';

app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);

// --- Basic Test Route ---
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'WAYA WAYA! Backend API is running. 🚀' });
});

// --- Global Error Handler ---
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('💥 Unhandled error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
});

// --- Graceful Shutdown ---
process.on('SIGINT', () => {
    console.log('🛑 Shutting down server...');
    pool.end(() => {
        console.log('✅ Database pool closed.');
        process.exit(0);
    });
});

// --- Start Background Jobs ---
import './jobs/processCommissions';
console.log('🔄 Background jobs initialized.');

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`🚀 WAYA WAYA! Backend Server is running on port ${PORT}`);
});

export default app; 