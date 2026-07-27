import { prisma } from "../../config/prisma.js";
const getFeedService = async (page, limit) => {
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
            }
        }),
    ]);
    const totalPages = Math.ceil(totalPosts / limit);
    return { posts, totalPosts, total_pages: totalPages, page, limit };
};
export default getFeedService;
//# sourceMappingURL=getFeed.js.map