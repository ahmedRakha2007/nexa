/**
 * @swagger
 * tags:
 *   name: Friendship
 *   description: Friend request and friendship management
 */

import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.ts";
import {
  acceptFriendRequest,
  getReceivedFriendRequests,
  getSentFriendRequests,
  sendRequest,
  rejectFriendRequest,
  cancelFriendRequest,
  removeFriend,
  getFriends,
} from "../controllers/friendship.controller.ts";
import {
  friendShipIdValidation,
  sendFriendRequestValidation,
} from "../middlewares/friendShip.validation.ts";
import { validateRequest } from "../middlewares/validateRequest.ts";

const friendShipRouter = Router();

/**
 * @swagger
 * /friendships:
 *   post:
 *     summary: Send a friend request
 *     tags: [Friendship]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - receiver_username
 *             properties:
 *               receiver_username:
 *                 type: string
 *                 example: john_doe
 *     responses:
 *       201:
 *         description: Friend request sent successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       409:
 *         description: Friend request already exists
 */
friendShipRouter.post(
  "/",
  authMiddleware,
  sendFriendRequestValidation,
  validateRequest,
  sendRequest
);

/**
 * @swagger
 * /friendships/received:
 *   get:
 *     summary: Get received friend requests
 *     tags: [Friendship]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Received friend requests retrieved successfully
 *       401:
 *         description: Unauthorized
 */
friendShipRouter.get(
  "/received",
  authMiddleware,
  getReceivedFriendRequests
);

/**
 * @swagger
 * /friendships/sent:
 *   get:
 *     summary: Get sent friend requests
 *     tags: [Friendship]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sent friend requests retrieved successfully
 *       401:
 *         description: Unauthorized
 */
friendShipRouter.get(
  "/sent",
  authMiddleware,
  getSentFriendRequests
);

/**
 * @swagger
 * /friendships/{id}/accept:
 *   patch:
 *     summary: Accept a friend request
 *     tags: [Friendship]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Friendship request ID
 *     responses:
 *       200:
 *         description: Friend request accepted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: You are not allowed to accept this request
 *       404:
 *         description: Friend request not found
 */
friendShipRouter.patch(
  "/:id/accept",
  authMiddleware,
  friendShipIdValidation,
  validateRequest,
  acceptFriendRequest
);

/**
 * @swagger
 * /friendships/{id}/reject:
 *   patch:
 *     summary: Reject a friend request
 *     tags: [Friendship]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Friendship request ID
 *     responses:
 *       200:
 *         description: Friend request rejected successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: You are not allowed to reject this request
 *       404:
 *         description: Friend request not found
 */
friendShipRouter.patch(
  "/:id/reject",
  authMiddleware,
  friendShipIdValidation,
  validateRequest,
  rejectFriendRequest
);

/**
 * @swagger
 * /friendships/{id}/cancel:
 *   patch:
 *     summary: Cancel a sent friend request
 *     tags: [Friendship]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Friendship request ID
 *     responses:
 *       200:
 *         description: Friend request cancelled successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: You are not allowed to cancel this request
 *       404:
 *         description: Friend request not found
 */
friendShipRouter.patch(
  "/:id/cancel",
  authMiddleware,
  friendShipIdValidation,
  validateRequest,
  cancelFriendRequest
);

/**
 * @swagger
 * /friendships/friends:
 *   get:
 *     summary: Get authenticated user's friends
 *     tags: [Friendship]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Friends retrieved successfully
 *       401:
 *         description: Unauthorized
 */
friendShipRouter.get(
  "/friends",
  authMiddleware,
  getFriends
);

/**
 * @swagger
 * /friendships/{id}:
 *   delete:
 *     summary: Remove a friend
 *     tags: [Friendship]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Friendship ID
 *     responses:
 *       200:
 *         description: Friend removed successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: You are not allowed to remove this friend
 *       404:
 *         description: Friendship not found
 */
friendShipRouter.delete(
  "/:id",
  authMiddleware,
  friendShipIdValidation,
  validateRequest,
  removeFriend
);


export default friendShipRouter;