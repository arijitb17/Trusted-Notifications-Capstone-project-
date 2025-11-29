const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      console.error("❌ MONGO_URI is not set in .env");
      process.exit(1);
    }

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // fail fast if Atlas not reachable
    });

    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
