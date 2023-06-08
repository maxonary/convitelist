import express from 'express';
import { createAdminUser, authenticateAdminUser } from '../controllers/authController';

const router = express.Router();

// Route to create a new admin user
router.post('/register', createAdminUser);

// Route to authenticate an admin user
router.post('/login', authenticateAdminUser);

export default router;