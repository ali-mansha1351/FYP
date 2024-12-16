import express from "express";

// import authRoute from "./routes/authRoute";
import userRoute from "./routes/userRoute.js";
import { errorMiddleware } from "../backend/middlewares/errors.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());

//importing all the routes

app.use("/api/v1", userRoute);

app.use(errorMiddleware);
export { app };
