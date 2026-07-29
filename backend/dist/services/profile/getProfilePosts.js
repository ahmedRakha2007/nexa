import createError from "http-errors";
import { prisma } from "../../config/prisma.js";
const getProfilePostsService = async (username, page, limit) => {
    const user = await prisma.user.findUnique({
        where: {
            username,
        },
        select: {
            id: true,
        }
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
        }),
    ]);
    const totalPages = Math.ceil(totalPosts / limit);
    return { posts, total_pages: totalPages, page, limit };
};
export default getProfilePostsService;
//# sourceMappingURL=getProfilePosts.js.map