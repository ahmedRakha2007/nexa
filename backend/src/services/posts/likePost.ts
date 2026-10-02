import { prisma } from "../../config/prisma.ts";
import createError from "http-errors";
import { createNotification } from "../notification/createNotification.ts";

export const likePostService = async (
  userId: string,
  postId: string
) => {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    select: {
      id: true,
      user_id: true
    },
  });

  if (!post) {
    throw createError(404, "Post doesn't exist");
  }

  const existingLike = await prisma.postLike.findUnique({
    where: {
      user_id_post_id: {
        user_id: userId,
        post_id: postId,
      },
    },
    select: {
      user_id: true,
    },
  });

  if (existingLike) {
    throw createError(409, "You already liked this post");
  }

  await prisma.postLike.create({
    data: {
      user_id: userId,
      post_id: postId,
    },
  });

   if (post.user_id !== userId) {
  const notification = await createNotification({
    recipientId: post.user_id,
    actorId: userId,
    type: "POST_LIKED",
    postId: post.id,
  });
}

  return {
    success: true,
    message: "Post liked successfully",
  };
};