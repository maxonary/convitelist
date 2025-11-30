import express from 'express';
import {
  createAdminUser,
  checkAdminExists,
  getAllAdminUsers,
  getAdminUserById,
  updateAdminUserById,
  deleteAdminUserById,
} from '../controllers/adminController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/check', checkAdminExists);
router.post('/register', createAdminUser);
router.get('/', authMiddleware, getAllAdminUsers);
router.get('/:adminUserId', authMiddleware, getAdminUserById);
router.put('/:adminUserId', authMiddleware, updateAdminUserById);
router.delete('/:adminUserId', authMiddleware, deleteAdminUserById);

export default router;
