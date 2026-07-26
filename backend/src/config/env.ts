import "dotenv/config";

export const env = {
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN, 
  PORT: Number(process.env.PORT),
  SALT: Number(process.env.SALT),
  CLOUDINARY_KEY_NAME: process.env.CLOUDINARY_KEY_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
};