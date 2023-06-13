import express from 'express';
import {
  createAdminUser,
  getAllAdminUsers,
  getAdminUserById,
  deleteAdminUserById,
} from '../controllers/adminController';

const router = express.Router();

router.post('/', createAdminUser);
router.get('/', getAllAdminUsers);
router.get('/:adminId', getAdminUserById);
router.delete('/:adminId', deleteAdminUserById);

export default router;
