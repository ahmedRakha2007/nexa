import type { Request, Response } from "express";
export declare const getProfile: (req: Request<{
    username: string;
}>, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getProfilePosts: (req: Request<{
    username: string;
}, {}, {}, {
    page?: string;
    limit?: string;
}>, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateProfile: (req: Request & {
    user?: {
        userId: string;
    };
}, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=profile.controller.d.ts.map