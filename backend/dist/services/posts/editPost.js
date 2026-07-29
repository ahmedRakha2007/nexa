import createError from "http-errors";
import { Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../../config/prisma.js";
import { deleteImage, uploadImage } from "../../utils/cloudinary.js";
const editPostService = async (id, content, file, userId) => {
    const post = await prisma.post.findUnique({
        where: {
            id,
        },
        select: {
            user_id: true,
            image_public_id: true,
            content: true,
        },
    });
    if (!post) {
        throw createError(404, "Post not found");
    }
    if (post.user_id !== userId) {
        throw createError(403, "You are not allowed to edit this post");
    }
    const data = {};
    if (content !== undefined) {
        data.content = content;
    }
    if (file?.buffer) {
        // Upload first
        const { secure_url, public_id } = await uploadImage(file.buffer);
        // Delete old image only after successful upload
        if (post.image_public_id) {
            await deleteImage(post.image_public_id);
        }
        data.image_url = secure_url;
        data.image_public_id = public_id;
    }
    return await prisma.post.update({
        where: {
            id,
        },
        data,
        select: {
            id: true,
            content: true,
            image_url: true,
            created_at: true,
            updated_at: true,
        },
    });
};
export default editPostService;
//# sourceMappingURL=editPost.js.map