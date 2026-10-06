import { Router } from "express";
import authMiddleware from "../../middleware/auth.middleware.js";
import organizationMiddleware from "../../middleware/organization.middleware.js";
import asyncHandler from "../../utils/async-handler.js";
import searchController from "./search.controller.js";
import queryValidationMiddleware from "../../middleware/query-validation.middleware.js";
import { searchSchema } from "./search.validator.js";

const router = Router();

router.get(
    "/:organizationId/search",
    authMiddleware,
    organizationMiddleware,
    queryValidationMiddleware(searchSchema),
    asyncHandler(searchController.search)
);

export default router;