import express from 'express';
import {
  createAdminUser,
  getAllAdminUsers,
  getAdminUserById,
  updateAdminUserById,
  deleteAdminUserById,
} from '../controllers/adminController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', createAdminUser);
router.get('/', authMiddleware, getAllAdminUsers);
router.get('/:adminUserId', authMiddleware, getAdminUserById);
router.put('/:adminUserId', authMiddleware, updateAdminUserById);
router.delete('/:adminUserId', authMiddleware, deleteAdminUserById);

export default router;
