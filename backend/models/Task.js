const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  status: { type: String, enum: ['ongoing', 'in progress', 'completed'], default: 'ongoing' },
  dueDate: { type: Date },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  attachments: [{ type: String }], // file paths
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
