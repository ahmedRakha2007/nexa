/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: User profile endpoints
 */
import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { getProfile, getProfilePosts, updateProfile, } from "../controllers/profile.controller.js";
import { updateProfileValidation } from "../middlewares/profile.validation.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import upload from "../middlewares/upload.middleware.js";
const profileRoutes = Router();
/**
 * @swagger
 * /profile/{username}:
 *   get:
 *     summary: Get a user's profile
 *     tags: [Profile]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Username of the user
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *       404:
 *         description: User not found
 */
profileRoutes.get("/:username", getProfile);
/**
 * @swagger
 * /profile/{username}/posts:
 *   get:
 *     summary: Get a user's posts
 *     tags: [Profile]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Username of the user
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
 *         description: User posts retrieved successfully
 *       404:
 *         description: User not found
 */
profileRoutes.get("/:username/posts", getProfilePosts);
/**
 * @swagger
 * /profile/me:
 *   patch:
 *     summary: Update the authenticated user's profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               display_name:
 *                 type: string
 *                 example: Ahmed Adel
 *               bio:
 *                 type: string
 *                 example: Full Stack Developer
 *               profile_image:
 *                 type: string
 *                 format: binary
 *                 description: Profile picture
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
profileRoutes.patch("/me", authMiddleware, upload.single("profile_image"), updateProfileValidation, validateRequest, updateProfile);
export default profileRoutes;
//# sourceMappingURL=profile.routes.js.map