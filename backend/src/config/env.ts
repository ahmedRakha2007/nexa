import "dotenv/config";

export const env = {
  DATABASE_URL: process.env.DATABASE_URL!,
  JWT_SECRET: process.env.JWT_SECRET!,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN!, 
  PORT: Number(process.env.PORT)!,
  SALT: Number(process.env.SALT)!
};