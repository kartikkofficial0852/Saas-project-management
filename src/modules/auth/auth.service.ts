import bcrypt from "bcryptjs";
import AppError from "../../errors/app-error";
import { db } from "../../prisma/db"
import sendResponse from "../../utils/response";
import generateToken from "../../utils/jwt";


const authService = {
    async register(name: string, email: string, password: string) {
        const existingUser = await db.orm.public.User.where({ email }).first();

        if (existingUser) {
            throw new AppError("Email is already registered", 409);
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await db.orm.public.User.create({
            name,
            email,
            passwordHash
        })

        if (!user) {
            throw new AppError("Something went wrong while creating user", 500);
        }

        return {
            id: user.id,
            name: user.name,
            email: user.email
        }


    },

    async login(email: string, password: string) {
        const user = await db.orm.public.User.where({ email }).first();

        if (!user) {
            throw new AppError("Invalid email or password", 401);
        }

        const passwordCompare = await bcrypt.compare(password, user.passwordHash);

        if (!passwordCompare) {
            throw new AppError(
                "Invalid email or password",
                401
            );
        }

        const token = generateToken(user.id);

        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        };
    }
}

export default authService;