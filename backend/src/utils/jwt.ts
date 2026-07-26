import jwt from "jsonwebtoken";
import { env } from "../config/env.ts";


export function generateToken(payload: {userId: string}): string {
  return jwt.sign(payload, env.JWT_SECRET as jwt.Secret, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as jwt.SignOptions);
}

export function verifyToken(token: string): {userId: string} {
  return jwt.verify(token, env.JWT_SECRET!) as {userId: string};
} 