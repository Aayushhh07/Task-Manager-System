import express from 'express';
import multer from 'multer';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask
} from '../controllers/taskController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDFs are allowed'));
    }
  }
});

// CRUD routes
router.post('/', authMiddleware, upload.array('attachments', 3), createTask);
router.get('/', authMiddleware, getTasks);
router.get('/:id', authMiddleware, getTaskById);
router.put('/:id', authMiddleware, upload.array('attachments', 3), updateTask);
router.delete('/:id', authMiddleware, deleteTask);

export default router;
