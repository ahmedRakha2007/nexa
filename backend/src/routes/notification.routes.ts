import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.ts";
import { getNotifications, markAllNotificationsAsRead, markNotificationAsRead } from "../controllers/notification.controller.ts";

const notificationRouter = Router();

notificationRouter.get("/", authMiddleware, getNotifications);

notificationRouter.patch("/:id/read", authMiddleware, markNotificationAsRead);

notificationRouter.patch("/read-all", authMiddleware, markAllNotificationsAsRead);

export default notificationRouter;