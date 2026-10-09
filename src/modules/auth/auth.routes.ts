import { Router } from "express";
import asyncHandler from "../../utils/async-handler.js";
import authController from "./auth.controller.js";
import validationMiddleware from "../../middleware/validation.middleware.js";
import { loginSchema, registerSchema } from "./auth.validator.js";
import authMiddleware from "../../middleware/auth.middleware.js";


const router = Router();

router.post('/register', validationMiddleware(registerSchema), asyncHandler(authController.register))
router.post('/login', validationMiddleware(loginSchema), asyncHandler(authController.login))
router.get('/me', authMiddleware, asyncHandler(authController.me))

export default router;