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

// User creation should be public (for registration), but you can protect it if needed
// If you want to require invitation codes for user registration, uncomment the authMiddleware below
router.post('/', createUser);
// router.post('/', authMiddleware, createUser); // Uncomment to require authentication for user creation

// All other user operations require authentication
router.get('/', authMiddleware, getAllUsers);
router.get('/:userId', authMiddleware, getUserById);
router.delete('/:userId', authMiddleware, deleteUserById);

router.put('/:userId/approve', authMiddleware, approveUser);
router.put('/:userId/reject', authMiddleware, rejectUser);

export default router;