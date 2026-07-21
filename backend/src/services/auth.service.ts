import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import prisma from "../config/prisma";
import { env } from "../config/env";
import { LoginInput } from "../schemas/auth.schema";
import { ApiError } from "../utils/api-error";
import { JwtPayload } from "../types";

export const loginUser = async (input: LoginInput) => {
  const { email, password } = input;

  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    // Generic security message to prevent user enumeration
    throw new ApiError(401, "Invalid email or password");
  }

  // Check password hash
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  // Generate JWT token
  const payload: JwtPayload = {
    userId: user.id,
    email: user.email,
  };

  const signOptions: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  };

  const token = jwt.sign(payload, env.JWT_SECRET, signOptions);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    token,
  };
};

export const getCurrentUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new ApiError(404, "User profile not found");
  }

  return user;
};
