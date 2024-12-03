import { app } from "./app.js";
import { connectDatabse } from "./config/database.js";
import dotenv from "dotenv";

process.on("unCaughtException", (errors) => {
  console.log(`uncaught exception due to error ${errors}`);
  //console.log("shutting down server due to unhandled promise rejection");
  process.exit(1);
});
//setting up config file
dotenv.config({ path: "backend/config/config.env" });
//connecting to db
connectDatabse();

const server = app.listen(process.env.PORT, () => {
  console.log(
    `server started in port ${process.env.PORT} in ${process.env.NODE_ENV} mode`
  );
});

process.on("unhandledRejection", (err) => {
  console.log(`unhandled rejection due to error ${err}`);
  //console.log("shutting down server due to unhandled promise rejection");
  server.close(() => {
    process.exit(1);
  });
});
