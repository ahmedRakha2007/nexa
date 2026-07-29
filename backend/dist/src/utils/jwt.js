import jwt from "jsonwebtoken";
import { env } from "../config/env.ts";
export function generateToken(payload) {
    return jwt.sign(payload, env.JWT_SECRET, {
        expiresIn: env.JWT_EXPIRES_IN,
    });
}
export function verifyToken(token) {
    return jwt.verify(token, env.JWT_SECRET);
}
//# sourceMappingURL=jwt.js.map