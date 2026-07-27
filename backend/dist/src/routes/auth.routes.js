import { Router } from "express";
import { signIn, signUp } from "../controllers/auth.controller.js";
import signInValidation, { signUpValidation } from "../middlewares/auth.validation.js";
import { validateRequest } from "../middlewares/validateRequest.js";
const authRoutes = Router();
/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Authentication endpoints
 */
/**
 * @swagger
 * /auth/sign-up:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - display_name
 *               - username
 *               - email
 *               - password
 *               - birth_date
 *             properties:
 *               display_name:
 *                 type: string
 *                 example: Ahmed Adel
 *               username:
 *                 type: string
 *                 example: ahmed23
 *               email:
 *                 type: string
 *                 format: email
 *                 example: ahmed@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123!
 *               birth_date:
 *                 type: string
 *                 format: date
 *                 example: 2005-04-12
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: Username or email already exists
 */
authRoutes.post("/sign-up", signUpValidation, validateRequest, signUp);
/**
 * @swagger
 * /auth/sign-in:
 *   post:
 *     summary: Sign in to an existing account
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - identifier
 *               - password
 *             properties:
 *               identifier:
 *                 type: string
 *                 description: Username or email
 *                 example: ahmed23
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123!
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid credentials
 */
authRoutes.post("/sign-in", signInValidation, validateRequest, signIn);
export default authRoutes;
//# sourceMappingURL=auth.routes.js.map