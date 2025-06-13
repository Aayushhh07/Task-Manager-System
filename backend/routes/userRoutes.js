import express from 'express';
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js'; // optional: for admin

const router = express.Router();

// Admin-only routes
router.get('/', authMiddleware, roleMiddleware(['admin']), getUsers);
router.get('/:id', authMiddleware, roleMiddleware(['admin']), getUserById);
router.put('/:id', authMiddleware, roleMiddleware(['admin']), updateUser);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deleteUser);

export default router;
