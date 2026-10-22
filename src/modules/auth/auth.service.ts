// import bcrypt from "bcryptjs";
// import AppError from "../../errors/app-error.js";
// import { db } from "../../prisma/db.js";
// import generateToken from "../../utils/jwt.js";


// const authService = {
//     async register(name: string, email: string, password: string) {
//         const existingUser = await db.orm.public.User.where({ email }).first();

//         if (existingUser) {
//             throw new AppError("Email is already registered", 409);
//         }

//         const passwordHash = await bcrypt.hash(password, 10);

//         const user = await db.orm.public.User.create({
//             name,
//             email,
//             passwordHash
//         })

//         if (!user) {
//             throw new AppError("Something went wrong while creating user", 500);
//         }

//         return {
//             id: user.id,
//             name: user.name,
//             email: user.email
//         }


//     },

//     async login(email: string, password: string) {
//         const user = await db.orm.public.User.where({ email }).first();

//         if (!user) {
//             throw new AppError("Invalid email or password", 401);
//         }

//         const passwordCompare = await bcrypt.compare(password, user.passwordHash);

//         if (!passwordCompare) {
//             throw new AppError(
//                 "Invalid email or password",
//                 401
//             );
//         }

//         const token = generateToken(user.id);

//         return {
//             token,
//             user: {
//                 id: user.id,
//                 name: user.name,
//                 email: user.email,
//             },
//         };
//     }
// }

// export default authService;


import bcrypt from "bcryptjs";
import AppError from "../../errors/app-error.js";
import { db } from "../../prisma/db.js";
import generateToken from "../../utils/jwt.js";

const authService = {
    async register(
        name: string,
        email: string,
        password: string,
        organizationName: string
    ) {
        const passwordHash = await bcrypt.hash(password, 10);

        const result = await db.transaction(async (tx) => {
            const existingUser = await tx.orm.public.User
                .where({ email })
                .first();

            if (existingUser) {
                throw new AppError("Email is already registered", 409);
            }

            const user = await tx.orm.public.User.create({
                name,
                email,
                passwordHash,
            });

            if (!user) {
                throw new AppError(
                    "Something went wrong while creating user",
                    500
                );
            }

            const organization = await tx.orm.public.Organization.create({
                name: organizationName,
            });

            const membership =
                await tx.orm.public.OrganizationMember.create({
                    userId: user.id,
                    organizationId: organization.id,
                    role: "OWNER",
                });

            return {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                },
                organization,
                membership,
            };
        });

        const token = generateToken(result.user.id);

        return {
            token,
            user: result.user,
            organization: result.organization,
            membership: result.membership,
        };
    },

    async login(email: string, password: string) {
        const user = await db.orm.public.User
            .where({ email })
            .first();

        if (!user) {
            throw new AppError("Invalid email or password", 401);
        }

        const passwordCompare = await bcrypt.compare(
            password,
            user.passwordHash
        );

        if (!passwordCompare) {
            throw new AppError("Invalid email or password", 401);
        }

        const memberships =
            await db.orm.public.OrganizationMember
                .where({ userId: user.id })
                .include(
                    "organization",
                    (organization) =>
                        organization.select("id", "name")
                )
                .select("role")
                .all();

        const organizations = memberships.map((membership) => ({
            ...membership.organization,
            role: membership.role,
        }));

        const token = generateToken(user.id);

        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
            organizations,
        };
    },
};

export default authService;
