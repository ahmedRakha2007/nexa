import createError from "http-errors";
import { prisma } from "../../config/prisma.ts";

const getProfilePostsService = async (
  username: string,
  page: number,
  limit: number,
  userId?: string
) => {
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
    },
  });

  if (!user) {
    throw createError(404, "Profile not found");
  }

  const [totalPosts, posts] = await Promise.all([
    prisma.post.count({
      where: {
        user_id: user.id,
      },
    }),

    prisma.post.findMany({
      where: {
        user_id: user.id,
      },
      orderBy: {
        created_at: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,

      include: {
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },

        likes: userId
          ? {
              where: {
                user_id: userId,
              },
              select: {
                user_id: true,
              },
              take: 1,
            }
          : false,
      },
    }),
  ]);

  const totalPages = Math.ceil(totalPosts / limit);

  const formattedPosts = posts.map((post) => {
    const { _count, likes, ...postData } = post;

    return {
        ...postData,
        comments_count: _count.comments,
        likes_count: _count.likes,
        is_liked: userId ? likes.length > 0 : false,
    };
  });


  return {
    posts: formattedPosts,
    total_pages: totalPages,
    page,
    limit,
  };
};

export default getProfilePostsService;