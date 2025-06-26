import mongoose from "mongoose";

const connectDatabse = async () => {
  try {
    const con = await mongoose.connect(process.env.DB_LOCAL_URI, {
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 30000, // Keep trying to send operations for 30 seconds
      socketTimeoutMS: 30000, // Close sockets after 30 seconds of inactivity
    });
    console.log(`connected to mongodb host ${process.env.DB_LOCAL_URI}`);
  } catch (error) {
    console.log("mongodb connection error:", error.message);
    process.exit(-1);
  }
};

export { connectDatabse };
