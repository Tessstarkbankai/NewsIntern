import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://himanshu28071994:123%40singh@cluster0.vspupf1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

export const connectDB = async () => {
  try {
    const connection = await mongoose.connect(MONGODB_URI);
    
    connection.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    connection.connection.on('error', (err) => {
      console.error('MongoDB error:', err);
    });

    console.log('MongoDB connected successfully');
    return connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process?.exit(1);
  }
};