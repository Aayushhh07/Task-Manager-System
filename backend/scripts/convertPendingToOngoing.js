const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Task = require('../models/Task');
dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const result = await Task.updateMany({ status: 'pending' }, { $set: { status: 'ongoing' } });
  console.log('Updated:', result.modifiedCount, 'tasks');
  process.exit();
};
run(); 