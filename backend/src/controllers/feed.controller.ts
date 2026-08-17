import { response, type Request, type Response } from "express"
import getFeedService from "../services/feed/getFeed.ts"
import getFriendsFeedService from "../services/feed/getFriendsFeed.ts"


export const getFeed = async (req: Request<{}, {}, {}, {page?: string, limit?: string}> & {user?: {userId: string}}, res: Response) => {

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const {userId} = req.user!
    const posts = await getFeedService(userId, page, limit);
    
    res.status(200).json({
        success: true,
        posts,
    });
}


export const getFriendsFeed = async (req: Request<{}, {}, {}, {page?: string, limit?: string}> & {user?: any}, res: Response) => {

    const userId = req.user.userId
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10

    const posts = await getFriendsFeedService(userId, page, limit)

    res.status(200).json({
        success: true,
        posts,
    })
}