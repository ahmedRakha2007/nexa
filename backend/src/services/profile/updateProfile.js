import createError from "http-errors";
import { prisma } from "../../config/prisma.js";
import { deleteImage, uploadImage } from "../../utils/cloudinary.js";
const updateProfileService = async (file, display_name, username, bio, userId) => {
    // Check if the user exists
    const currentProfile = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            id: true,
            display_name: true,
            username: true,
            bio: true,
            profile_picture_url: true,
            profile_picture_id: true,
        },
    });
    if (!currentProfile) {
        throw createError(404, "User not found.");
    }
    // Check username uniqueness
    if (username) {
        const existingUsername = await prisma.user.findUnique({
            where: { username },
            select: {
                id: true,
            },
        });
        if (existingUsername && existingUsername.id !== userId) {
            throw createError(409, "Username already exists.");
        }
    }
    // Build the update object dynamically
    const data = {};
    if (display_name !== undefined) {
        data.display_name = display_name;
    }
    if (username !== undefined) {
        data.username = username;
    }
    if (bio !== undefined) {
        data.bio = bio;
    }
    // Handle profile picture
    if (file?.buffer) {
        if (currentProfile.profile_picture_id) {
            await deleteImage(currentProfile.profile_picture_id);
        }
        const { secure_url, public_id } = await uploadImage(file.buffer);
        data.profile_picture_url = secure_url;
        data.profile_picture_id = public_id;
    }
    await prisma.user.update({
        where: {
            id: userId,
        },
        data,
    });
};
export default updateProfileService;
//# sourceMappingURL=updateProfile.js.map