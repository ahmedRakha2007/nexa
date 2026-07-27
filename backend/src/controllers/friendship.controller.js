import sendRequestService from "../services/friendShips/sendRequest.js";
import getReceivedFriendRequestsService from "../services/friendShips/getReceivedFriendRequests.js";
import getSentFriendRequestsService from "../services/friendShips/getSentFriendRequests.js";
import acceptFriendRequestService from "../services/friendShips/acceptFriendRequest.js";
import rejectFriendRequestService from "../services/friendShips/rejectFriendRequest.js";
import deleteFriendService from "../services/friendShips/deleteFriend.js";
import getFriendsService from "../services/friendShips/getFriends.js";
import cancelFriendRequestService from "../services/friendShips/cancelFriendRequest.js";
export const sendRequest = async (req, res) => {
    const { userId } = req.user;
    const { receiver_id } = req.body;
    await sendRequestService(userId, receiver_id);
    return res.status(200).json({
        "success": true,
        "message": "Friend request sent successfully."
    });
};
export const getReceivedFriendRequests = async (req, res) => {
    const { userId } = req.user;
    const requests = await getReceivedFriendRequestsService(userId);
    return res.status(200).json({
        "success": true,
        requests,
    });
};
export const getSentFriendRequests = async (req, res) => {
    const { userId } = req.user;
    const requests = await getSentFriendRequestsService(userId);
    return res.status(200).json({
        "success": true,
        requests,
    });
};
export const acceptFriendRequest = async (req, res) => {
    const id = req.params.id;
    const { userId } = req.user;
    await acceptFriendRequestService(id, userId);
    return res.status(200).json({
        "success": true,
        "message": "The friend request accepted successfully"
    });
};
export const rejectFriendRequest = async (req, res) => {
    const id = req.params.id;
    const { userId } = req.user;
    await rejectFriendRequestService(id, userId);
    return res.status(200).json({
        "success": true,
        "message": "The friend request rejected successfully"
    });
};
export const cancelFriendRequest = async (req, res) => {
    const id = req.params.id;
    const { userId } = req.user;
    await cancelFriendRequestService(id, userId);
    return res.status(200).json({
        "success": true,
        "message": "The friend request canceled successfully"
    });
};
export const removeFriend = async (req, res) => {
    const id = req.params.id;
    const { userId } = req.user;
    await deleteFriendService(id, userId);
    return res.status(200).json({
        "success": true,
        "message": "The friend deleted successfully"
    });
};
export const getFriends = async (req, res) => {
    const { userId } = req.user;
    const friends = await getFriendsService(userId);
    return res.status(200).json({
        "success": true,
        friends,
    });
};
//# sourceMappingURL=friendship.controller.js.map