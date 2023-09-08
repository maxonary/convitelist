import express from 'express';
import { 
  createUser, 
  getAllUsers, 
  getUserById,
  deleteUserById,
  approveUser,
  rejectUser,
} from '../controllers/userController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', createUser);
router.get('/', authMiddleware, getAllUsers);
router.get('/:userId', authMiddleware, getUserById);
router.delete('/:userId', authMiddleware, deleteUserById);

router.put('/:userId/approve', authMiddleware, approveUser);
router.put('/:userId/reject', authMiddleware, rejectUser);

export default router;