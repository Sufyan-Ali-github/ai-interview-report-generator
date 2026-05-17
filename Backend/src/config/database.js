import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();


const MONGODB_URI=process.env.MONGODB_URI_KEY;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 60000,
       tls: true,                          
      tlsAllowInvalidCertificates: true,  
    });
    console.log('✅ MongoDB Connected Successfully');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err);
    console.log('Retrying connection in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

mongoose.connection.on('connecting', () => console.log('Connecting to MongoDB...'));
mongoose.connection.on('connected', () => console.log('MongoDB Connected!'));
mongoose.connection.on('disconnected', () => console.log('MongoDB Disconnected!'));

export default connectDB;
