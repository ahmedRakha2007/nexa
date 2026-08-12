
import type { Request, Response } from "express";
import sendRequestService from "../services/friendShips/sendRequest.ts";
import getReceivedFriendRequestsService from "../services/friendShips/getReceivedFriendRequests.ts";
import getSentFriendRequestsService from "../services/friendShips/getSentFriendRequests.ts";
import acceptFriendRequestService from "../services/friendShips/acceptFriendRequest.ts";
import rejectFriendRequestService from "../services/friendShips/rejectFriendRequest.ts"
import deleteFriendService from "../services/friendShips/deleteFriend.ts";
import getFriendsService from "../services/friendShips/getFriends.ts";
import cancelFriendRequestService from "../services/friendShips/cancelFriendRequest.ts";



export const sendRequest = async (req: Request & { user?: any }, res: Response) => {
    const { userId } = req.user;
    const { receiver_id } = req.body;

    await sendRequestService(userId, receiver_id);

    return res.status(200).json({
        "success": true,
        "message": "Friend request sent successfully."
    });
};

export const getReceivedFriendRequests = async (req: Request & { user?: any }, res: Response) => {
    const { userId } = req.user;

    const requests = await getReceivedFriendRequestsService(userId);

    return res.status(200).json({
        "success": true,
        requests,
    });
};

export const getSentFriendRequests = async (req: Request & { user?: any }, res: Response) => {
    const { userId } = req.user;

    const requests = await getSentFriendRequestsService(userId);

    return res.status(200).json({
        "success": true,
        requests,
    });
};

export const acceptFriendRequest = async (req: Request<{id: string}> & { user?: any }, res: Response) => {
    const id = req.params.id;
    const { userId } = req.user;

     await acceptFriendRequestService(id, userId);

    return res.status(200).json({
        "success": true,
        "message": "The friend request accepted successfully"
    });
};

export const rejectFriendRequest = async (req: Request<{id: string}> & { user?: any }, res: Response) => {
    const id = req.params.id;
    const { userId } = req.user;

     await rejectFriendRequestService(id, userId);

    return res.status(200).json({
        "success": true,
        "message": "The friend request rejected successfully"
    });
};

export const cancelFriendRequest = async (req: Request<{id: string}> & { user?: any }, res: Response) => {
    const id = req.params.id;
    const { userId } = req.user;

     await cancelFriendRequestService(id, userId);

    return res.status(200).json({
        "success": true,
        "message": "The friend request canceled successfully"
    });
};

export const removeFriend = async (req: Request<{id: string}> & { user?: any }, res: Response) => {
    const id = req.params.id;
    const { userId } = req.user;

     await deleteFriendService(id, userId);

    return res.status(200).json({
        "success": true,
        "message": "The friend deleted successfully"
    });
};

export const getFriends = async (
  req: Request & { user?: any },
  res: Response
) => {
  const { userId } = req.user;

  const search = req.query.search as string | undefined;

  const friends = await getFriendsService(userId, search);

  return res.status(200).json({
    success: true,
    friends,
  });
};