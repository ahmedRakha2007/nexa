import type { Request, Response } from "express";
import getProfileService from "../services/profile/getProfile.ts";
import getProfilePostsService from "../services/profile/getProfilePosts.ts";
import { success } from "zod";
import updateProfileService from "../services/profile/updateProfile.ts";


export const getProfile = async (req: Request<{ username: string }>, res: Response) => {
    const { username } = req.params;
    const profile = await getProfileService(username);
    return res.status(200).json({
        success: true,
        profile
    });
}   
export const getProfilePosts = async (req: Request<{ username: string }, {}, {}, {page?: string; limit?: string}>, res: Response) => {
    const { username } = req.params;
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const posts = await getProfilePostsService(username, page, limit);
    return res.status(200).json({
        success: true,
        posts
    });
}   

export const updateProfile = async (req: Request & { user?: { userId: string } }, res: Response) => {

    const { file } = req;
    const { display_name, username, bio } = req.body;
    const {userId} = req.user!
    
    const response = await updateProfileService(file, display_name, username, bio, userId);
    return res.status(201).json({
        success: true,
        message: "Profile updated successfully",
        user: response
    })

}