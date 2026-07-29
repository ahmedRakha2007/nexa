import createError from "http-errors";
import { prisma } from "../../config/prisma.ts";
const sendRequestService = async (userId, receiver_id) => {
    // Can't send a request to yourself
    if (userId === receiver_id) {
        throw createError(400, "You can't send a friend request to yourself.");
    }
    // Check if receiver exists
    const receiver = await prisma.user.findUnique({
        where: {
            id: receiver_id,
        },
        select: {
            id: true,
        },
    });
    if (!receiver) {
        throw createError(404, "User not found.");
    }
    // Find friendship in either direction
    const friendship = await prisma.friendship.findFirst({
        where: {
            OR: [
                {
                    sender_id: userId,
                    receiver_id,
                },
                {
                    sender_id: receiver_id,
                    receiver_id: userId,
                },
            ],
        },
    });
    // No friendship yet
    if (!friendship) {
        await prisma.friendship.create({
            data: {
                sender_id: userId,
                receiver_id,
                status: "PENDING",
            },
        });
        return;
    }
    // Already friends
    if (friendship.status === "ACCEPTED") {
        throw createError(400, "This user is already your friend.");
    }
    // Pending request already exists
    if (friendship.status === "PENDING") {
        throw createError(400, "A friend request already exists.");
    }
    // Rejected or canceled -> send again
    await prisma.friendship.update({
        where: {
            id: friendship.id,
        },
        data: {
            sender_id: userId,
            receiver_id,
            status: "PENDING",
        },
    });
};
export default sendRequestService;
//# sourceMappingURL=sendRequest.js.map