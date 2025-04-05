import mongoose from "mongoose";

const connectDatabse = async () => {
  try {
    const con = await mongoose.connect(process.env.DB_LOCAL_URI);
    console.log(`connected to mongodb host ${process.env.DB_LOCAL_URI}`);
  } catch (error) {
    console.log("mongodb connection error:", error.message);
    process.exit(-1);
  }
};

export { connectDatabse };
