const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connString = process.env.MONGOURI;
    if (!connString) {
      throw new Error('MONGOURI environment variable is not defined.');
    }
    await mongoose.connect(connString);
    console.log('MongoDB Connected successfully!');
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
