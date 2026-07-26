import { prisma } from "../../config/prisma.ts";
import { generateToken } from "../../utils/jwt.ts";
import { comparePassword } from "../../utils/password.ts";
import createError from "http-errors";

export interface SignInInput {
  identifier: string;
  password: string;
}

const signInService = async ({
  identifier,
  password,
}: SignInInput) => {
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: identifier },
        { username: identifier },
      ],
    },
    select: {
      id: true,
      display_name: true,
      username: true,
      email: true,
      provider: true,
      password_hash: true,
      birth_date: true,
      profile_picture_url: true,
      bio: true,
      created_at: true,
      updated_at: true,
    },
  });

  if (!user) {
    throw  createError(400, "Invalid credentials.");
  }

  if (user.provider === "GOOGLE") {
    throw  createError(
      400, "This account uses Google Sign-In. Please continue with Google."
    );
  }

  const isPasswordCorrect = await comparePassword(
    password,
    user.password_hash!
  );

  if (!isPasswordCorrect) {
    throw createError(404, "Invalid credentials.");
  }

  const token = generateToken({
    userId: user.id,
  });

  const { password_hash, ...safeUser } = user;

  return {
    message: "Signed in successfully.",
    user: safeUser,
    token,
  };
};

export default signInService;