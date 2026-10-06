import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import organizationRoutes from "../modules/organizations/organization.routes";
import projectRoutes from "../modules/projects/project.routes";
import taskRoutes from "../modules/tasks/task.routes";
import commentRoutes from "../modules/comments/comment.routes.js";
import labelRoutes from "../modules/labels/label.routes.js";
import attachmentRoutes from "../modules/attachment/attachment.routes";
import logRoutes from "../modules/logs/log.routes.js";
import notificationRoutes from "../modules/notifications/notification.routes.js";
import taskStatusRoutes from "../modules/task-statuses/task-status.routes.js";
import searchRoutes from "../modules/search/search.routes.js";
import dashboardRoutes from "../modules/dashboard/dashboard.routes.js";
const router = Router();

router.use('/auth', authRoutes)
router.use('/organizations', organizationRoutes)
router.use('/organizations', projectRoutes)
router.use("/organizations", taskRoutes);
router.use("/organizations", commentRoutes);
router.use("/organizations", labelRoutes);
router.use("/organizations", attachmentRoutes);
router.use("/organizations", logRoutes);
router.use("/organizations", taskStatusRoutes);
router.use("/organizations", searchRoutes);
router.use("/organizations", dashboardRoutes);
router.use("/notifications", notificationRoutes);


export default router;