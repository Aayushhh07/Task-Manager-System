const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const users = await User.find();
  users.forEach(u => console.log(`${u._id}: ${u.name} <${u.email}> [${u.role}]`));
  process.exit();
};
run();
