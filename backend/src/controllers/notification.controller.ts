import type { Request, Response } from "express";


import markNotificationAsReadService from "../services/notification/markNotificationAsRead.ts";
import getNotificationsService from "../services/notification/getNotifications.ts";
import markAllNotificationsAsReadService from "../services/notification/markAllNotificationsAsRead.ts";


interface NotificationParams {
    id: string
}

export const getNotifications = async (
  req: Request & {user?: {userId: string}},
  res: Response,
) => {
    const userId = req.user!.userId;

    const notifications = await getNotificationsService(userId);

    res.status(200).json({
      success: true,
      notifications,
    });
};

export const markNotificationAsRead = async (
  req: Request & {user?: {userId: string}},
  res: Response,
) => {
    const userId = req.user!.userId;
    const notificationId = req.params.id;

    await markNotificationAsReadService(notificationId, userId);

    res.status(200).json({
      success: true,
      message: "Notification marked as read.",
    });
};

export const markAllNotificationsAsRead = async (
  req: Request & {user?: {userId: string}},
  res: Response,
) => {
    const userId = req.user!.userId;

    await markAllNotificationsAsReadService(userId);

    res.status(200).json({
      success: true,
      message: "All notifications marked as read.",
    });
};