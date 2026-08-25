import { prisma } from "../../config/prisma.ts";
import createError from "http-errors";
import { createNotification } from "../notification/createNotification.ts";

const createCommentService = async (
  userId: string,
  postId: string,
  content: string
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

  const comment = await prisma.comment.create({
    data: {
      user_id: userId,
      post_id: postId,
      content,
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          display_name: true,
          profile_picture_url: true,
        },
      },
    },
  });

  if (userId !== post.user_id) {
    await createNotification({
      recipientId: post.user_id,
      actorId: userId,
      type: "POST_COMMENTED",
      postId: post.id,
    });
  }

  return comment;
};

export default createCommentService;