import { prisma } from "../../config/prisma.ts";

const getFriendsFeedService = async (
  userId: string,
  page: number,
  limit: number
) => {
  const friendships = await prisma.friendship.findMany({
    where: {
      OR: [{ sender_id: userId }, { receiver_id: userId }],
      status: "ACCEPTED",
    },
    select: {
      sender_id: true,
      receiver_id: true,
    },
  });

  const friendIds = friendships.map((friendship) =>
    friendship.sender_id === userId
      ? friendship.receiver_id
      : friendship.sender_id
  );

  if (friendIds.length === 0) {
    return {
      posts: [],
      total_posts: 0,
      total_pages: 0,
      page,
      limit,
    };
  }

  const [totalPosts, posts] = await Promise.all([
    prisma.post.count({
      where: {
        user_id: {
          in: friendIds,
        },
      },
    }),

    prisma.post.findMany({
      where: {
        user_id: {
          in: friendIds,
        },
      },

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

        // Number of likes
        _count: {
          select: {
            likes: true,
          },
        },

        // Only the current user's like
        likes: {
          where: {
            user_id: userId,
          },
          select: {
            user_id: true,
          },
        },
      },
    }),
  ]);

  const totalPages = Math.ceil(totalPosts / limit);

  const formattedPosts = posts.map((post) => {
    const { _count, likes, ...postData } = post;

    return {
      ...postData,
      likes_count: _count.likes,
      is_liked: likes.length > 0,
    };
  });

  return {
    posts: formattedPosts,
    total_posts: totalPosts,
    total_pages: totalPages,
    page,
    limit,
  };
};

export default getFriendsFeedService;
