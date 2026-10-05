import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.MONGO_DB_NAME || "photoConnection",
    });

    console.log(`MongoDB Connected : ${conn.connection.host}`);
  } catch (error) {
    // console.log(error.message);
    process.exit(1);
  }
};

export default connectDB;
