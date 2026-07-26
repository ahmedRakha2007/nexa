import type { NextFunction, Request, Response } from "express";
import createPostService from "../services/posts/createPost.ts";
import getPostService from "../services/posts/getPost.ts";
import editPostService from "../services/posts/editPost.ts";
import deletePostService from "../services/posts/deletePost.ts";



export async function createPost(req: Request & { user?: any }, res: Response) {

        const { userId } = req.user
        const { file } = req
        const { content } = req.body 
        const post = await createPostService(content, file, userId);

        res.status(201).json({
            success: true,
            data: post
        });
}

export const getPost = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {

    const { id } = req.params;

    const post = await getPostService(id);

    res.status(200).json({
      success: true,
      data: post,
    });
};

export const editPost = async (req: Request<{ id: string }> & { user?: any }, res: Response, next: NextFunction) => {

    const { id } = req.params;
    const { content } = req.body;
    const { userId } = req.user;
    const {file} = req

    const post = await editPostService(id, content, file, userId);

    res.status(200).json({
      success: true,
      data: post,
    });
};


export const deletePost = async (req: Request<{ id: string }> & { user?: any }, res:Response, next: NextFunction) => {
  
        const { id } = req.params
        const {userId} = req.user
         await deletePostService(id, userId)

        res.status(200).json({
            success: true,
            message: "The post deleted successfully",
        })
}


