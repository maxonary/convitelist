import express from 'express';
import { authenticateAdminUser } from '../controllers/authController';

const router = express.Router();

router.post('/login', authenticateAdminUser);

export default router;