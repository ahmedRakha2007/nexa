import { body } from "express-validator";
import { validateRequest } from "./validateRequest.js";
export const updateProfileValidation = [
    body()
        .custom((_, { req }) => {
        const allowedFields = [
            "display_name",
            "username",
            "bio",
        ];
        const receivedFields = Object.keys(req.body);
        const invalidFields = receivedFields.filter((field) => !allowedFields.includes(field));
        if (invalidFields.length > 0) {
            throw new Error(`Unknown field(s): ${invalidFields.join(", ")}`);
        }
        return true;
    }),
    body("display_name")
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage("Display name must be between 2 and 50 characters."),
    body("username")
        .optional()
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage("Username must be between 3 and 30 characters.")
        .matches(/^[a-zA-Z0-9._]+$/)
        .withMessage("Username can only contain letters, numbers, dots, and underscores."),
    body("bio")
        .optional()
        .trim()
        .isLength({ max: 160 })
        .withMessage("Bio cannot exceed 160 characters."),
    body().custom((_, { req }) => {
        if (!req.body.display_name &&
            !req.body.username &&
            !req.body.bio &&
            !req.file) {
            throw new Error("At least one field must be provided.");
        }
        return true;
    }),
    validateRequest,
];
//# sourceMappingURL=profile.validation.js.map