import type { NextFunction, Request, Response } from "express";
export declare function createPost(req: Request & {
    user?: any;
}, res: Response): Promise<void>;
export declare const getPost: (req: Request<{
    id: string;
}>, res: Response, next: NextFunction) => Promise<void>;
export declare const editPost: (req: Request<{
    id: string;
}> & {
    user?: any;
}, res: Response, next: NextFunction) => Promise<void>;
export declare const deletePost: (req: Request<{
    id: string;
}> & {
    user?: any;
}, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=posts.controller.d.ts.map