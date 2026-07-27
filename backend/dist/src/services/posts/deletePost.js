import createError from "http-errors";
import { prisma } from "../../config/prisma.js";
import { deleteImage } from "../../utils/cloudinary.js";
const deletePostService = async (id, userId) => {
    const post = await prisma.post.findUnique({
        where: {
            id,
        },
        select: {
            user_id: true,
            image_public_id: true
        }
    });
    if (!post) {
        throw createError(404, "Post not found");
    }
    if (post.user_id !== userId) {
        throw createError(403, "You are not allowed to delete this post");
    }
    if (post.image_public_id) {
        await deleteImage(post.image_public_id);
    }
    await prisma.post.delete({
        where: {
            id,
        },
    });
};
export default deletePostService;
//# sourceMappingURL=deletePost.js.map