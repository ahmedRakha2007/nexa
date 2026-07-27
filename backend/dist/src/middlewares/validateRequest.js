import { validationResult } from "express-validator";
import createError from "http-errors";
export function validateRequest(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array(),
        });
    }
    next();
}
//# sourceMappingURL=validateRequest.js.map