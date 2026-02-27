import express from 'express';
import { getServerStatus, wakeUpServer, sleepServer } from '../controllers/serverStatusController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes - anyone can check server status and wake up the server
router.get('/', getServerStatus);
router.post('/wakeup', wakeUpServer);

// Admin-only route - only authenticated admins can put server to sleep
router.post('/sleep', authMiddleware, sleepServer);

export default router;







