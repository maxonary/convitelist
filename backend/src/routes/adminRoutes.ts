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
router.get('/:adminId', getAdminUserById);
router.put('/:adminId', updateAdminUserById);
router.delete('/:adminId', deleteAdminUserById);

export default router;
