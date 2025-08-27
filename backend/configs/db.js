const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // listen for connection success
    mongoose.connection.on("connected", () => {
      console.log("✅ MongoDB connected");
    });

    // listen for connection errors
    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err);
    });

    await mongoose.connect(process.env.MONGODB_URI);
  } catch (error) {
    console.error("❌ Failed to connect MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
