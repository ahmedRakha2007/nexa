import getProfileService from "../services/profile/getProfile.js";
import getProfilePostsService from "../services/profile/getProfilePosts.js";
import { success } from "zod";
import updateProfileService from "../services/profile/updateProfile.js";
export const getProfile = async (req, res) => {
    const { username } = req.params;
    const profile = await getProfileService(username);
    return res.status(200).json({
        success: true,
        profile
    });
};
export const getProfilePosts = async (req, res) => {
    const { username } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const posts = await getProfilePostsService(username, page, limit);
    return res.status(200).json({
        success: true,
        posts
    });
};
export const updateProfile = async (req, res) => {
    const { file } = req;
    const { display_name, username, bio } = req.body;
    const { userId } = req.user;
    await updateProfileService(file, display_name, username, bio, userId);
    return res.status(201).json({
        success: true,
        message: "Profile updated successfully"
    });
};
//# sourceMappingURL=profile.controller.js.map