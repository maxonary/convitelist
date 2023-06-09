import express from 'express';
import { createAdminUser } from '../controllers/userController';

const router = express.Router();

router.post('/register', createAdminUser);

export default router;