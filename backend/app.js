import express from "express";

// import authRoute from "./routes/authRoute";
import authRoutes from "./routes/userRoute.js";

import { errorMiddleware } from "../backend/middlewares/errors.js";

const app = express();
app.use(express.json());
//importing all the routes

app.use("/api/v1", authRoutes);

app.use(errorMiddleware);
export { app };
