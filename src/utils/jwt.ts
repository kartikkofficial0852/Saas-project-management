import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || "1d";

const generateToken = (userId: number) => {
    return jwt.sign(
        {
            sub: userId
        },
        JWT_SECRET,
        {
            expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn']
        }
    );
}

export default generateToken;