import express from 'express';
import cors from 'cors';

import authRoutes from './routes/authRoutes';
import adminRoutes from './routes/adminRoutes';

const app = express();

app.use(
  cors({
    origin: '*',
  }),
);

app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'KitSphere backend is running',
  });
});

app.use('/api/auth', authRoutes);

app.use('/api/admin', adminRoutes);

export default app;