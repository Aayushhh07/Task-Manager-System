const Task = require('../models/Task');
const User = require('../models/User');
const path = require('path');

// GET /tasks (admin: all, user: assigned only)
exports.getTasks = async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? {} : { assignedTo: req.user._id };
    // Add search/filter/sort if needed from req.query
    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email')
      .sort('-createdAt');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /tasks/:id
exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('assignedTo', 'name email');
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (req.user.role !== 'admin' && task.assignedTo._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /tasks
exports.createTask = async (req, res) => {
  try {
    const { title, description, priority, status, dueDate, assignedTo } = req.body;
    let assignToUser = req.user._id;
    if (req.user.role === 'admin' && assignedTo) {
      assignToUser = assignedTo;
    }
    // Normal users can only assign to themselves
    if (req.user.role !== 'admin' && assignedTo && assignedTo !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Users can only assign tasks to themselves' });
    }
    // File upload (PDFs only)
    let attachments = [];
    if (req.files && req.files.length > 0) {
      attachments = req.files.map((file) => path.posix.join('uploads', path.basename(file.path)));
    }
    const task = await Task.create({
      title,
      description,
      priority,
      status,
      dueDate,
      assignedTo: assignToUser,
      attachments,
    });
    const populatedTask = await task.populate('assignedTo', 'name email');
    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /tasks/:id
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    // Only admin or assigned user can update
    if (
      req.user.role !== 'admin' &&
      task.assignedTo.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Access denied' });
    }
    // Only admin can reassign
    if (req.body.assignedTo && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can reassign tasks' });
    }
    // File upload (PDFs only)
    if (req.files && req.files.length > 0) {
      const newAttachments = req.files.map((file) => path.posix.join('uploads', path.basename(file.path)));
      task.attachments = task.attachments.concat(newAttachments);
    }
    // Update fields
    ['title', 'description', 'priority', 'status', 'dueDate', 'assignedTo'].forEach((field) => {
      if (req.body[field]) task[field] = req.body[field];
    });
    await task.save();
    const populatedTask = await Task.findById(task._id).populate('assignedTo', 'name email');
    res.json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /tasks/:id
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    // Only admin or assigned user can delete
    if (
      req.user.role !== 'admin' &&
      task.assignedTo.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Access denied' });
    }
    await task.deleteOne();
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /tasks/stats
exports.getStats = async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? {} : { assignedTo: req.user._id };
    const total = await Task.countDocuments(query);
    const completed = await Task.countDocuments({ ...query, status: 'completed' });
    const pending = await Task.countDocuments({ ...query, status: 'pending' });
    res.json({ total, completed, pending });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
