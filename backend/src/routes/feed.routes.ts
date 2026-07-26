/**
 * @swagger
 * tags:
 *   name: Feed
 *   description: Feed endpoints
 */

import { Router } from "express";
import { getFeed, getFriendsFeed } from "../controllers/feed.controller.ts";
import authMiddleware from "../middlewares/auth.middleware.ts";

const feedRouter = Router();

/**
 * @swagger
 * /feed:
 *   get:
 *     summary: Get the global feed
 *     tags: [Feed]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of posts per page
 *     responses:
 *       200:
 *         description: Global feed retrieved successfully
 */
feedRouter.get("/", getFeed);

/**
 * @swagger
 * /feed/friends:
 *   get:
 *     summary: Get posts from friends only
 *     tags: [Feed]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of posts per page
 *     responses:
 *       200:
 *         description: Friends feed retrieved successfully
 *       401:
 *         description: Unauthorized
 */
feedRouter.get("/friends", authMiddleware, getFriendsFeed);

export default feedRouter;