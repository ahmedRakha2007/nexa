import { body, param } from "express-validator";

export const createPostValidation = [
  // Reject unknown fields
  body().custom((value, { req }) => {
    const allowedFields = ["content"];

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

  // Validate content if it exists
  body("content")
    .optional()
    .isString()
    .withMessage("Content must be a string.")
    .bail()
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Content must not exceed 2000 characters."),

  // Business rule
  body().custom((value, { req }) => {
    const content = req.body.content?.trim();
    const image = req.file;

    if (!content && !image) {
      throw new Error(
        "A post must contain either text or an image."
      );
    }

    return true;
  }),
];

export const postIdValidation = [
  param("id").isUUID().withMessage("Invalid post id"),
]

export const editPostValidation = [

  param("id").isUUID().withMessage("Invalid post id"),

  // Reject unknown fields
  body().custom((value, { req }) => {
    const allowedFields = ["content"];

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

  // Validate content if it exists
  body("content")
    .optional()
    .isString()
    .withMessage("Content must be a string.")
    .bail()
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Content must not exceed 2000 characters."),

  // Business rule
  body().custom((value, { req }) => {
    const content = req.body.content?.trim();
    const image = req.file;

    if (!content && !image) {
      throw new Error(
        "A post must contain either text or an image."
      );
    }

    return true;
  }),
];

export const createCommentValidation = [
  // Validate post ID
  param("postId")
    .isUUID()
    .withMessage("Invalid post id"),

  // Reject unknown fields
  body().custom((value, { req }) => {
    const allowedFields = ["content"];

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

  // Validate comment content
  body("content")
    .exists()
    .withMessage("Comment content is required.")
    .bail()
    .isString()
    .withMessage("Comment content must be a string.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Comment cannot be empty.")
    .bail()
    .isLength({ max: 1000 })
    .withMessage("Comment must not exceed 1000 characters."),
];
