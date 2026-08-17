import createError from "http-errors";
import { prisma } from "../../config/prisma.ts";

export const getPostService = async (
  userId: string | undefined,
  postId: string
) => {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
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
      _count: {
        select: {
          likes: true,
        },
      },
    },
  });

  if (!post) {
    throw createError(404, "Post not found");
  }

  const isLiked = userId
    ? await prisma.postLike.findUnique({
        where: {
          user_id_post_id: {
            user_id: userId,
            post_id: postId,
          },
        },
        select: {
          user_id: true,
        },
      })
    : null;

  return {
    ...post,
    likes_count: post._count.likes,
    is_liked: Boolean(isLiked),
  };
};

export default getPostService;
