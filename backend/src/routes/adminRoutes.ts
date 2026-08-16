import { Router } from 'express';

import {
  getDashboardStats,
  getUserById,
  getUsers,
} from '../controllers/adminController';

import {
  authenticate,
  requireAdmin,
} from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate);
router.use(requireAdmin);

router.get('/stats', getDashboardStats);

router.get('/users', getUsers);

router.get('/users/:id', getUserById);

export default router;