import express from 'express';
import { 
  createUser, 
  getAllUsers, 
  getUserById,
  deleteUserById,
  approveUser,
  rejectUser,
} from '../controllers/userController';

const router = express.Router();

router.post('/', createUser);
router.get('/', getAllUsers);
router.get('/:userId', getUserById);
router.delete('/:userId', deleteUserById);

router.put('/:userId/approve', approveUser);
router.put('/:userId/reject', rejectUser);

export default router;