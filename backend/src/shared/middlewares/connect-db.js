import mongoose from "mongoose";

// Call this from server.js to connect to MongoDB
export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri || typeof uri !== "string") {
    console.error("❌ MongoDB URI is missing or invalid. Check MONGODB_URI in backend/.env");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
}

export default mongoose;
