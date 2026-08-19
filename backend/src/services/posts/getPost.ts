import createError from "http-errors";
import { prisma } from "../../config/prisma.ts";

export const getPostService = async (
  postId: string,
  userId?: string,
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

      comments: {
        orderBy: {
          created_at: "asc",
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
      },

      _count: {
        select: {
          likes: true,
          comments: true,
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


  const { _count, comments, ...postData } = post;
  return {
    ...postData,
    comments: comments,
    likes_count: post._count.likes,
    comments_count: post._count.comments,
    is_liked: Boolean(isLiked),
  };
};

export default getPostService;
