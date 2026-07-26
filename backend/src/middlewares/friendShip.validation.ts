import { body, param } from "express-validator";

export const sendFriendRequestValidation = [
  body()
    .custom((_, { req }) => {
      const allowedFields = ["receiver_id"];

      const receivedFields = Object.keys(req.body);

      const invalidFields = receivedFields.filter(
        (field) => !allowedFields.includes(field)
      );

      if (invalidFields.length > 0) {
        throw new Error(
          `Unknown field(s): ${invalidFields.join(", ")}`
        );
      }

      return true;
    }),

  body("receiver_id").isUUID().withMessage("Invalid receiver id"),
];


export const friendShipIdValidation = [
  param("id").isUUID().withMessage("Invalid friendship id"),
]