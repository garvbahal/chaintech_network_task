import type { Request, Response } from "express";
import {
  createCategorySchema,
  createTaskSchema,
  deleteTaskSchema,
  markCompleteSchema,
  updateTaskSchema,
} from "../schemas/task.schema.js";
import { TaskModel } from "../models/task.model.js";
import { CategoryModel } from "../models/category.model.js";

export const createTask = async (req: Request, res: Response) => {
  try {
    const { success, data, error } = createTaskSchema.safeParse(req.body);

    if (!success) {
      return res.status(400).json({
        success: false,
        message: error.flatten(),
      });
    }

    const { title, description, categoryName, dueDate } = data;

    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const categoryResponse = await CategoryModel.findOne({
      categoryName,
      createdBy: userId,
    });

    if (!categoryResponse) {
      return res.status(400).json({
        success: false,
        message: "Please create a category of this kind first",
      });
    }

    const task = await TaskModel.create({
      title,
      description: description ?? "",
      dueDate,
      userId,
      category: categoryResponse._id,
    });

    return res.status(200).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating the task",
      error: error,
    });
  }
};

export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const tasks = await TaskModel.find({ userId })
      .select("title description isCompleted category dueDate createdAt")
      .populate({
        path: "category",
        select: "categoryName",
      })
      .exec();

    return res.status(200).json({
      success: true,
      message: "Tasks fetched successfully",
      tasks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching the tasks",
    });
  }
};

export const markComplete = async (req: Request, res: Response) => {
  try {
    const { success, error, data } = markCompleteSchema.safeParse(req.params);

    if (!success) {
      return res.status(400).json({
        success: false,
        message: error.flatten(),
      });
    }

    const { taskId } = data;

    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const task = await TaskModel.findOne({ _id: taskId, userId });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    if (task.isCompleted) {
      return res.status(400).json({
        success: false,
        message: "Task is already completed",
      });
    }

    task.isCompleted = true;
    await task.save();

    return res.status(200).json({
      success: true,
      message: "Task completed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while marking the task as complete",
    });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { success, data, error } = deleteTaskSchema.safeParse(req.params);

    if (!success) {
      return res.status(400).json({
        success: false,
        message: error.flatten(),
      });
    }

    const { taskId } = data;

    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized to delete the task",
      });
    }

    const deletedTask = await TaskModel.findOneAndDelete({
      _id: taskId,
      userId,
    });

    if (!deletedTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while deleting the task",
    });
  }
};

export const editTask = async (req: Request, res: Response) => {
  try {
    const { success, data, error } = updateTaskSchema.safeParse(req.body);

    if (!success) {
      return res.status(400).json({
        success: false,
        message: error.flatten(),
      });
    }
    const { taskId } = req.params;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { title, description, categoryId, dueDate, isCompleted } = data;

    const updatedTask = await TaskModel.findOneAndUpdate(
      { _id: taskId, userId },
      {
        $set: {
          ...(title !== undefined && { title }),
          ...(description !== undefined && { description }),
          ...(dueDate !== undefined && { dueDate }),
          ...(isCompleted !== undefined && { isCompleted }),
          ...(categoryId !== undefined && { category: categoryId }),
        },
      },
      { new: true },
    );

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while editing the task",
    });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { success, data, error } = createCategorySchema.safeParse(req.body);

    if (!success) {
      return res.status(400).json({
        success: false,
        message: error.flatten(),
      });
    }

    const { categoryName } = data;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const categoryExists = await CategoryModel.findOne({
      categoryName,
      createdBy: userId,
    });

    if (categoryExists) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    await CategoryModel.create({
      categoryName,
      createdBy: userId,
    });

    return res.status(200).json({
      success: true,
      message: "Category created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating the category",
    });
  }
};
