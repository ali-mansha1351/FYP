import { errorMiddleware } from "../backend/middlewares/errors.js";
import express from "express";
import cors from "cors";
import userRoute from "./routes/userRoute.js";
import patternRoutes from "./routes/patternRoutes.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: [
      "http://192.168.18.36:5173",
      "http://localhost:5173",
      "http://192.168.x.x:5173",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());

//importing all the routes

app.use("/api/v1", userRoute);
app.use("/api/v1", patternRoutes);

app.use(errorMiddleware);
export { app };
