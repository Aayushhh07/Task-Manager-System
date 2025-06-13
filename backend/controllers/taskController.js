import Task from '../models/Task.js';

// ✅ CREATE Task
export const createTask = async (req, res) => {
  try {
    const { title, description, priority, status, dueDate, assignedTo } = req.body;
    const attachments = req.files ? req.files.map(f => f.path) : [];

    const task = await Task.create({
      title,
      description,
      priority,
      status,
      dueDate,
      assignedTo,
      attachments,
    });

    res.status(201).json(task);
  } catch (err) {
    console.error('Task creation error:', err);
    res.status(500).json({ message: 'Failed to create task' });
  }
};

// ✅ GET All Tasks
export const getTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let tasks;
    if (userRole === 'admin') {
      // Admin gets all tasks
      tasks = await Task.find().populate('assignedTo', 'name email');
    } else {
      // Normal user gets only their assigned tasks
      tasks = await Task.find({ assignedTo: userId }).populate('assignedTo', 'name email');
    }

    res.json(tasks);
  } catch (err) {
    console.error('Get tasks error:', err);
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
};

// ✅ GET Task by ID
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('assignedTo', 'name email');
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    console.error('Get task by ID error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ UPDATE Task
export const updateTask = async (req, res) => {
  try {
    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Update failed' });
  }
};

// ✅ DELETE Task
export const deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Deletion failed' });
  }
};
