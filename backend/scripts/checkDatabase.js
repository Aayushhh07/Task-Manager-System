const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => { console.log('DB connected'); process.exit(0); })
  .catch((err) => { console.error('DB error:', err.message); process.exit(1); });
