import mongoose from "mongoose";
import neo4j from "neo4j-driver";

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

const connectGraphDB = async () => {
  let driver;
  try {
    driver = neo4j.driver(
      process.env.NEO4J_URI,
      neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
    );
    const serverInfo = await driver.getServerInfo();
    console.log("connection established with neo4j database");
    console.log(serverInfo);
    return driver;
  } catch (error) {
    console.log(`connection error\n${error}\nCause: ${error.cause}`);
  }
};

export { connectDatabse, connectGraphDB };
