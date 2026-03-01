import express from 'express';
import { getServerStatus, wakeUpServer, getRconStatus } from '../controllers/serverStatusController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes - anyone can check server status and wake up the server
router.get('/', getServerStatus);
router.post('/wakeup', wakeUpServer);

// Protected route - only authenticated admins can check RCON status
router.get('/rcon', authMiddleware, getRconStatus);

export default router;







