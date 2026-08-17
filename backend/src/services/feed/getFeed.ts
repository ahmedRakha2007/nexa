import { prisma } from "../../config/prisma.ts";

const getFeedService = async (
  userId: string | undefined,
  page: number,
  limit: number
) => {
  const [totalPosts, posts] = await Promise.all([
    prisma.post.count({}),

    prisma.post.findMany({
      orderBy: {
        created_at: "desc",
      },

      skip: (page - 1) * limit,
      take: limit,

      select: {
        id: true,
        user_id: true,
        content: true,
        image_url: true,
        created_at: true,

        user: {
          select: {
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

        likes: userId
          ? {
              where: {
                user_id: userId,
              },
              select: {
                user_id: true,
              },
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
      likes_count: _count.likes,
      is_liked: userId ? likes.length > 0 : false,
    };
  });

  return {
    posts: formattedPosts,
    totalPosts,
    total_pages: totalPages,
    page,
    limit,
  };
};

export default getFeedService;