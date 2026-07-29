import { prisma } from "../../config/prisma.js";
import createError from "http-errors";
const cancelFriendRequestService = async (id, userId) => {
    const friendship = await prisma.friendship.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            sender_id: true,
            status: true,
        },
    });
    if (!friendship) {
        throw createError(404, "Friend request not found.");
    }
    if (friendship.status !== "PENDING") {
        throw createError(400, "This friend request is no longer pending.");
    }
    if (friendship.sender_id !== userId) {
        throw createError(403, "You are not allowed to cancel this friend request.");
    }
    await prisma.friendship.update({
        where: {
            id,
        },
        data: {
            status: "CANCELED",
        },
    });
};
export default cancelFriendRequestService;
//# sourceMappingURL=cancelFriendRequest.js.map