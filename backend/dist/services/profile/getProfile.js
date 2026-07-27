import { prisma } from "../../config/prisma.js";
import createError from "http-errors";
const getProfileService = async (username) => {
    const profile = await prisma.user.findUnique({
        where: {
            username,
        },
        select: {
            id: true,
            display_name: true,
            username: true,
            profile_picture_url: true,
            bio: true,
            _count: {
                select: {
                    posts: true
                }
            },
        }
    });
    if (!profile) {
        throw createError(404, "Profile not found");
    }
    const friendsCount = await prisma.friendship.count({
        where: {
            status: "ACCEPTED",
            OR: [
                { sender_id: profile.id },
                { receiver_id: profile.id },
            ],
        },
    });
    return {
        display_name: profile.display_name,
        username: profile.username,
        profile_picture_url: profile.profile_picture_url,
        bio: profile.bio,
        posts_count: profile._count.posts,
        friends_count: friendsCount
    };
};
export default getProfileService;
//# sourceMappingURL=getProfile.js.map