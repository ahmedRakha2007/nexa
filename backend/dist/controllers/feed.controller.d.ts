import { type Request, type Response } from "express";
export declare const getFeed: (req: Request<{}, {}, {}, {
    page?: string;
    limit?: string;
}>, res: Response) => Promise<void>;
export declare const getFriendsFeed: (req: Request<{}, {}, {}, {
    page?: string;
    limit?: string;
}> & {
    user?: any;
}, res: Response) => Promise<void>;
//# sourceMappingURL=feed.controller.d.ts.map