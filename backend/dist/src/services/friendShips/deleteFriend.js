import { prisma } from "../../config/prisma.ts";
import createError from "http-errors";
const deleteFriendService = async (id, userId) => {
    // check if they are friends
    const friendship = await prisma.friendship.findUnique({
        where: { id },
    });
    if (!friendship) {
        throw createError(404, "friendship doesn't exist");
    }
    if (friendship.status !== "ACCEPTED") {
        throw createError(400, "You are not friend to this user");
    }
    if (friendship.sender_id !== userId && friendship.receiver_id !== userId) {
        throw createError(403, "You are not allowed to remove this friend.");
    }
    await prisma.friendship.delete({
        where: {
            id
        }
    });
};
export default deleteFriendService;
//# sourceMappingURL=deleteFriend.js.map