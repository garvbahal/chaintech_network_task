import { Router } from "express";
import { authN } from "../middlewares/auth.middleware.js";
import {
  createCategory,
  createTask,
  deleteTask,
  editTask,
  getAllTasks,
  markComplete,
} from "../controllers/task.controller.js";

const taskRouter = Router();

taskRouter.post("/createTask", authN, createTask);
taskRouter.get("/getTasks", authN, getAllTasks);
taskRouter.post("/setComplete/:taskId", authN, markComplete);
taskRouter.delete("/task/:taskId", authN, deleteTask);
taskRouter.post("/updateTask/:taskId", authN, editTask);
taskRouter.post("/createCategory", authN, createCategory);

export default taskRouter;
