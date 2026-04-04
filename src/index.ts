import express from "express";
const app = express();
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
import { dbConnect } from "./config/dbConnect.js";
import taskRouter from "./routes/task.router.js";
import authRouter from "./routes/auth.router.js";
const PORT = process.env.PORT || 5000;
app.use(express.json());

// app.use(
//   cors({
//     origin: process.env.FRONTEND_URL,
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE"],
//   }),
// );

dbConnect();

app.use("/api/v1", taskRouter);
app.use("/api/v1", authRouter);

app.listen(PORT, () => {
  console.log(`App is listening at ${PORT}`);
});
