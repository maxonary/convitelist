import express from 'express';
import { authenticateAdminUser, logoutAdminUser } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/login', authenticateAdminUser);
router.post('/logout', authMiddleware, logoutAdminUser);

export default router;