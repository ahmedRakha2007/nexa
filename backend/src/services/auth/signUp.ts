import { prisma } from "../../config/prisma.ts";
import { isAdult } from "../../utils/date.ts";
import { generateToken } from "../../utils/jwt.ts";
import { hashPassword } from "../../utils/password.ts";

interface SignUpInput {
  displayName: string;
  username: string;
  email: string;
  password: string;
  birthDate: string;
}

const signUpService = async (data: SignUpInput) => {
  const { displayName, username, email, password, birthDate } = data;

  const parsedBirthDate = new Date(birthDate);

  if (!isAdult(parsedBirthDate)) {
    throw new Error("You must be at least 18 years old.");
  }

  const existingEmail = await prisma.user.findUnique({
    where: { email },
  });

  if (existingEmail) {
    throw new Error("Email already exists.");
  }

  const existingUsername = await prisma.user.findUnique({
    where: { username },
  });

  if (existingUsername) {
    throw new Error("Username already exists.");
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      display_name: displayName,
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