import { body } from "express-validator";

export const updateUserValidationSchema = [
  body("username")
    .optional()
    .trim()
    .escape()
    .isString()
    .withMessage("Username must be a string"),

  body("email")
    .optional()
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Email must be valid"),

  body("password")
    .optional()
    .exists()
    .withMessage("Password cannot be empty")
    .isLength({ min: 8 })
    .withMessage("Password should be at least 8 characters")
    .matches(/(?=.*[0-9])/)
    .withMessage("Password should contain at least one number")
    .matches(/(?=.*[A-Z])/)
    .withMessage("Password should contain at least one uppercase letter")
    .matches(/(?=.*[a-z])/)
    .withMessage("Password should contain at least one lowercase letter")
    .matches(/(?=.*[!@#$%^&*?.])/)
    .withMessage("Password should contain at least one special character"),

  body("description")
    .optional()
    .isLength({ max: 30 })
    .trim()
    .escape()
    .isString()
    .withMessage("Description must be a string"),

];