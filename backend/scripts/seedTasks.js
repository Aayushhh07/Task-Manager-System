const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Task = require('../models/Task');
const User = require('../models/User');
dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const users = await User.find();
  if (users.length === 0) return console.log('No users found. Seed users first.');
  await Task.deleteMany();
  const tasks = [
    {
      title: 'Sample Task 1',
      description: 'This is a sample task',
      priority: 'high',
      status: 'pending',
      dueDate: new Date(),
      assignedTo: users[0]._id,
      attachments: [],
    },
  ];
  await Task.insertMany(tasks);
  console.log('Tasks seeded');
  process.exit();
};
seed();
