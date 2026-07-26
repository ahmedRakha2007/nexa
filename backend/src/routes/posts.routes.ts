/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Post management endpoints
 */

import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.ts";
import {
  createPost,
  deletePost,
  editPost,
  getPost,
} from "../controllers/posts.controller.ts";
import {
  createPostValidation,
  editPostValidation,
  postIdValidation,
} from "../middlewares/posts.validation.ts";
import { validateRequest } from "../middlewares/validateRequest.ts";
import upload from "../middlewares/upload.middleware.ts";

const postRoutes = Router();

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: Post text
 *                 example: Hello everyone!
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Optional image
 *     responses:
 *       201:
 *         description: Post created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
postRoutes.post(
  "/",
  authMiddleware,
  upload.single("image"),
  createPostValidation,
  validateRequest,
  createPost
);

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Get a post by its ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post retrieved successfully
 *       404:
 *         description: Post not found
 */
postRoutes.get("/:id", postIdValidation, validateRequest, getPost);

/**
 * @swagger
 * /posts/{id}:
 *   patch:
 *     summary: Update a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: Updated post content
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Optional new image
 *     responses:
 *       200:
 *         description: Post updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: You are not allowed to edit this post
 *       404:
 *         description: Post not found
 */
postRoutes.patch(
  "/:id",
  authMiddleware,
  upload.single("image"),
  editPostValidation,
  validateRequest,
  editPost
);

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Delete a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: You are not allowed to delete this post
 *       404:
 *         description: Post not found
 */
postRoutes.delete(
  "/:id",
  authMiddleware,
  postIdValidation,
  validateRequest,
  deletePost
);

export default postRoutes;