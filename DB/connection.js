import mongoose from "mongoose"

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/skygate');
    console.log('Connected to MongoDataBase');
  } catch (error) {
    console.error('DB connection error:', error);
    process.exit(1);
  }
};