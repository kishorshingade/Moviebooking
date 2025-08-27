const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => console.log("Database connected"));
    await mongoose.connect(process.env.MONGODB_URI);
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

module.exports = connectDB;
