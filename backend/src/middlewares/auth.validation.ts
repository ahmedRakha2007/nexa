import { body } from "express-validator";

export const signUpValidation = [
  // Reject unknown fields
  body().custom((value) => {
    const allowedFields = [
      "displayName",
      "username",
      "email",
      "password",
      "birthDate",
    ];

    const receivedFields = Object.keys(value);

    const unknownFields = receivedFields.filter(
      (field) => !allowedFields.includes(field)
    );

    if (unknownFields.length > 0) {
      throw new Error(
        `Unknown fields: ${unknownFields.join(", ")}`
      );
    }

    return true;
  }),

  // Validate displayName
  body("displayName")
    .notEmpty()
    .withMessage("Display name is required"),

  // Validate username
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters"),

  // Validate email
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is invalid"),

  // Validate password
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),

  // Validate birthDate
  body("birthDate")
    .notEmpty()
    .withMessage("Birth date is required")
    .isISO8601()
    .withMessage("Birth date must be a valid date"),
];



const signInValidation = [
  // Reject unknown fields
  body().custom((value, { req }) => {
    const allowedFields = ["identifier", "password"];

    const receivedFields = Object.keys(req.body);

    const unknownFields = receivedFields.filter(
      (field) => !allowedFields.includes(field)
    );

    if (unknownFields.length > 0) {
      throw new Error(
        `Unknown field(s): ${unknownFields.join(", ")}`
      );
    }

    return true;
  }),

  // Validate identifier (email or username)
  body("identifier")
    .trim()
    .notEmpty()
    .withMessage("Email or username is required."),

  // Validate password
  body("password")
    .notEmpty()
    .withMessage("Password is required."),
];

export default signInValidation;