import bcrypt from "bcrypt";
import { env } from "../config/env.ts";
export async function hashPassword(password) {
    return bcrypt.hash(password, env.SALT);
}
export async function comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
}
//# sourceMappingURL=password.js.map