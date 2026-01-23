import express from 'express';
import { getServerStatus, wakeUpServer, getRconStatus } from '../controllers/serverStatusController';

const router = express.Router();

// Public routes - anyone can check server status and wake up the server
router.get('/', getServerStatus);
router.post('/wakeup', wakeUpServer);
router.get('/rcon', getRconStatus);

export default router;







