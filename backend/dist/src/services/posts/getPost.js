// services/post.service.ts
import createError from "http-errors";
import { prisma } from "../../config/prisma.ts";
export const getPostService = async (id) => {
    const post = await prisma.post.findUnique({
        where: {
            id,
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
    if (!post) {
        throw createError(404, "Post not found");
    }
    return post;
};
export default getPostService;
//# sourceMappingURL=getPost.js.map