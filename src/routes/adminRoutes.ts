import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import {
  adminLogin,
  approveUser,
  rejectUser,
} from '../controllers/adminController';

const router = express.Router();

router.post('/login', adminLogin);
router.patch('/:userId/approve', authMiddleware, approveUser);
router.patch('/:userId/reject', authMiddleware, rejectUser);

export default router;
