import { Router } from "express";
import asyncHandler from "../../utils/async-handler";
import authController from "./auth.controller";
import validationMiddleware from "../../middleware/validation.middleware";
import { loginSchema, registerSchema } from "./auth.validator";
import authMiddleware from "../../middleware/auth.middleware";


const router = Router();

router.post('/register', validationMiddleware(registerSchema), asyncHandler(authController.register))
router.post('/login', validationMiddleware(loginSchema), asyncHandler(authController.login))
router.get('/me', authMiddleware, asyncHandler(authController.me))

export default router;