import mongoose from "mongoose";
import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const MONGODB_URI = process.env.DATABASE_URI || "";

const connectMongoDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: "restaurant1",
    });
    console.log("Connected to MongoDB.");
  } catch (error) {
    console.log("MongoDB connection error:", error);
  }
};

export default connectMongoDB;
