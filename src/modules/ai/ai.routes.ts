
import { Router } from "express";
import authMiddleware from "../../middleware/auth.middleware.js";
import asyncHandler from "../../utils/async-handler.js";
import aiController from "./ai.controller.js";
import { generateTaskDescriptionSchema, summarizeSchema, taskBreakdownSchema } from "./ai.validator.js";
import validationMiddleware from "../../middleware/validation.middleware.js";

const router = Router();

router.post(
    "/task-description",
    authMiddleware,
    validationMiddleware(generateTaskDescriptionSchema),
    asyncHandler(
        aiController.generateTaskDescription
    )
);

router.post(
    "/task-breakdown",
    authMiddleware,
    validationMiddleware(taskBreakdownSchema),
    asyncHandler(
        aiController.generateTaskBreakdown
    )
);

router.post(
    "/summarize",
    authMiddleware,
    validationMiddleware(summarizeSchema),
    asyncHandler(
        aiController.summarize
    )
);
export default router;