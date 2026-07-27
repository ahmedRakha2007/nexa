import type { Request, Response } from "express";
export declare const sendRequest: (req: Request & {
    user?: any;
}, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getReceivedFriendRequests: (req: Request & {
    user?: any;
}, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getSentFriendRequests: (req: Request & {
    user?: any;
}, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const acceptFriendRequest: (req: Request<{
    id: string;
}> & {
    user?: any;
}, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const rejectFriendRequest: (req: Request<{
    id: string;
}> & {
    user?: any;
}, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const cancelFriendRequest: (req: Request<{
    id: string;
}> & {
    user?: any;
}, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const removeFriend: (req: Request<{
    id: string;
}> & {
    user?: any;
}, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getFriends: (req: Request & {
    user?: any;
}, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=friendship.controller.d.ts.map