import { prisma } from "../../config/prisma.ts";
import createError from "http-errors";

const deleteCommentService = async (
  userId: string,
  commentId: string
) => {
  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
    select: {
      id: true,
      user_id: true,
    },
  });

  if (!comment) {
    throw createError(404, "Comment doesn't exist");
  }

  if (comment.user_id !== userId) {
    throw createError(403, "You are not allowed to delete this comment");
  }

  await prisma.comment.delete({
    where: {
      id: commentId,
    },
  });

  return {
    success: true,
    message: "Comment deleted successfully",
  };
};

export default deleteCommentService;