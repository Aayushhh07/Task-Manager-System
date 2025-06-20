const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/authMiddleware');
const taskController = require('../controllers/taskController');

// Multer config: PDFs only
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'backend/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed!'), false);
  }
};
const upload = multer({ storage, fileFilter });

router.use(protect);

router.get('/stats', taskController.getStats);
router.get('/', taskController.getTasks);
router.get('/:id', taskController.getTask);
router.post('/', upload.array('attachments'), taskController.createTask);
router.put('/:id', upload.array('attachments'), taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;
