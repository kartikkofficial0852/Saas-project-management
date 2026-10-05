import { Router } from "express";
import authMiddleware from "../../middleware/auth.middleware.js";
import asyncHandler from "../../utils/async-handler.js";
import notificationController from "./notification.controller.js";

const router = Router();

router.get(
    "/",
    authMiddleware,
    asyncHandler(notificationController.getAll)
);

router.patch(
    "/:notificationId/read",
    authMiddleware,
    asyncHandler(notificationController.markAsRead)
);

router.patch(
    "/read-all",
    authMiddleware,
    asyncHandler(notificationController.markAllAsRead)
);

router.delete(
    "/:notificationId",
    authMiddleware,
    asyncHandler(notificationController.delete)
);

export default router;