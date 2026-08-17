import { prisma } from "../../config/prisma.ts";
import createError from "http-errors";

export const unlikePostService = async (
  userId: string,
  postId: string
) => {
    
    const post = await prisma.post.findUnique({
        where: { id: postId },
        select: { id: true },
    });

    if (!post) {
        throw createError(404, "Post doesn't exist");
    }

    const like = await prisma.postLike.findUnique({
        where: {
            user_id_post_id: {
            user_id: userId,
            post_id: postId,
            },
        },
    });

if (!like) {
  throw createError(409, "You haven't liked this post");
}
    await prisma.postLike.delete({
        where: {
            user_id_post_id: {
            user_id: userId,
            post_id: postId,
            },
        },
    });

   return {
            "success": true,
            "message": "Post unliked successfully"
        }

};