import { prisma } from "../../config/prisma.ts";
import { isAdult } from "../../utils/date.ts";
import { generateToken } from "../../utils/jwt.ts";
import { hashPassword } from "../../utils/password.ts";
import createError from "http-errors";

interface SignUpInput {
  display_name: string;
  username: string;
  email: string;
  password: string;
  birth_date: string;
}

const signUpService = async (data: SignUpInput) => {
  const { display_name, username, email, password, birth_date } = data;

  const parsedBirthDate = new Date(birth_date);

  if (!isAdult(parsedBirthDate)) {
  throw createError(400, "You must be at least 18 years old.");
}

  const existingEmail = await prisma.user.findUnique({
    where: { email },
  });

  if (existingEmail) {
  throw createError(409, "Email already exists.");
}

  const existingUsername = await prisma.user.findUnique({
    where: { username },
  });

 if (existingUsername) {
  throw createError(409, "Username already exists.");
}

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      display_name: display_name,
      username,
      email,
      password_hash: hashedPassword,
      provider: "LOCAL",
      birth_date: parsedBirthDate,
    },
    select: {
      id: true,
      display_name: true,
      username: true,
      email: true,
      provider: true,
      birth_date: true,
      profile_picture_url: true,
      bio: true,
      created_at: true,
      updated_at: true,
    },
  });

  const token = generateToken({
    userId: user.id,
  });

  return {
    message: "User created successfully",
    user,
    token,
  };
};

export default signUpService;