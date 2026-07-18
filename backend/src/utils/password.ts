import bcrypt from "bcrypt"
import { env } from "../config/env.ts";

export async function hashPassword(password:string) {
    return bcrypt.hash(password, env.SALT);
}

    
export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}