import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("jwt secret is missing");
}

export const authN = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const jwtToken = authHeader.split(" ")[1];

    if (!jwtToken) {
      return res.status(400).json({
        success: false,
        message: "Token is missing",
      });
    }

    const payload = jwt.verify(jwtToken, jwtSecret);

    if (typeof payload === "string" || !("userId" in payload)) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    req.userId = payload.userId;

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while authentication",
    });
  }
};
