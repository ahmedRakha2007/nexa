import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.ts";
import { acceptFriendRequest, getReceivedFriendRequests, getSentFriendRequests, sendRequest, rejectFriendRequest, cancelFriendRequest, removeFriend, getFriends } from "../controllers/friendship.controller.ts";
import type { Request, Response } from "express";
import { friendShipIdValidation, sendFriendRequestValidation } from "../middlewares/frinedShip.validation.ts";
import { validateRequest } from "../middlewares/validateRequest.ts";

const friendShipRouter = Router();

// send a request
friendShipRouter.post("/", authMiddleware, sendFriendRequestValidation, validateRequest, sendRequest);

// get received requests
friendShipRouter.get("/received", authMiddleware, getReceivedFriendRequests);

//get sent requests
friendShipRouter.get("/sent", authMiddleware, getSentFriendRequests);

// Accept friend request
friendShipRouter.patch(
  "/:id/accept",
  authMiddleware,
  friendShipIdValidation,
  validateRequest,
  acceptFriendRequest
);

// Reject friend request
friendShipRouter.patch(
  "/:id/reject",
   friendShipIdValidation,
  validateRequest,
  authMiddleware,
  rejectFriendRequest
);

// Cancel sent friend request
friendShipRouter.patch(
  "/:id/cancel",
   friendShipIdValidation,
  validateRequest,
  authMiddleware,
  cancelFriendRequest
);

// Get my friends
friendShipRouter.get("/friends", authMiddleware, getFriends);

// Remove friend
friendShipRouter.delete(
  "/:id",
  friendShipIdValidation,
  validateRequest,
  authMiddleware,
  removeFriend
);

export default friendShipRouter;