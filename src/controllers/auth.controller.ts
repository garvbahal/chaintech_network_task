import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import { loginSchema, signupSchema } from "../schemas/auth.schema.js";
import { UserModel } from "../models/user.model.js";
import dotenv from "dotenv";
dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("Jwt Secret Missing");
}

export const signup = async (req: Request, res: Response) => {
  try {
    const { success, error, data } = signupSchema.safeParse(req.body);

    if (!success) {
      return res.status(400).json({
        success: false,
        message: error.flatten(),
      });
    }

    const { username, password } = data;

    const existingUser = await UserModel.findOne({ username: username });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await UserModel.create({
      username,
      passwordHashed: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "User signed up successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while signing up",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { success, data, error } = loginSchema.safeParse(req.body);

    if (!success) {
      return res.status(400).json({
        success: false,
        message: error.flatten(),
      });
    }

    const { username, password } = data;

    const userExists = await UserModel.findOne({ username });

    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: "User not signedup, please signup first",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      userExists.passwordHashed,
    );

    if (!passwordMatch) {
      return res.status(400).json({
        success: false,
        message: "Wrong Password",
      });
    }

    const token = jwt.sign(
      {
        userId: userExists._id,
      },
      jwtSecret,
      {
        expiresIn: "7d",
      },
    );

    return res.status(200).json({
      success: true,
      message: "Login Successfull",
      token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while loggin in",
    });
  }
};
