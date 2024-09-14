import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/user.model";

interface Token {
  id: string;
  username: string;
}

import { Request, Response, NextFunction } from "express";

dotenv.config();
export const authenticationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token =
      req.cookies?.token ||
      req?.header("Authorization")?.replace("Bearer ", "") ||
      req.params.token;
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "not authentic user",
      });
    }

    let decodedToken: Token | null = null;
    let user;
    if (process.env.JWT_SECRET_KEY)
      decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY) as Token;
    if (decodedToken && decodedToken.id)
      user = await User.findById(decodedToken.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "error while authentication",
    });
  }
};
