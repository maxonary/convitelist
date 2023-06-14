import express from 'express';
import {
  createAdminUser,
  getAllAdminUsers,
  getAdminUserById,
  updateAdminUserById,
  deleteAdminUserById,
} from '../controllers/adminController';

const router = express.Router();

router.post('/', createAdminUser);
router.get('/', getAllAdminUsers);
router.get('/:adminUserId', getAdminUserById);
router.put('/:adminUserId', updateAdminUserById);
router.delete('/:adminUserId', deleteAdminUserById);

export default router;
