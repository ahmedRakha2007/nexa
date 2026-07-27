import { prisma } from "../../config/prisma.js";
const getFriendsService = async (userId) => {
    const friendships = await prisma.friendship.findMany({
        where: {
            OR: [{ sender_id: userId }, { receiver_id: userId }],
            status: "ACCEPTED",
        },
        orderBy: {
            created_at: "desc",
        },
        select: {
            id: true,
            created_at: true,
            sender_id: true,
            receiver_id: true,
            sender: {
                select: {
                    id: true,
                    username: true,
                    display_name: true,
                    profile_picture_url: true,
                },
            },
            receiver: {
                select: {
                    id: true,
                    username: true,
                    display_name: true,
                    profile_picture_url: true,
                },
            },
        },
    });
    return friendships.map((friendship) => {
        const friend = friendship.sender_id === userId ? friendship.receiver : friendship.sender;
        return {
            friendship_id: friendship.id,
            created_at: friendship.created_at,
            friend,
        };
    });
};
export default getFriendsService;
//# sourceMappingURL=getFriends.js.map