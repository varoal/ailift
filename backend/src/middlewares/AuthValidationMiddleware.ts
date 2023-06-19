import { body } from "express-validator";

export const registerValidationSchema = [
  body("username")
    .trim()
    .escape()
    .isString()
    .withMessage("Username must be a string")
    .notEmpty()
    .withMessage("Username is required"),
  body("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Email must be valid")
    .notEmpty()
    .withMessage("Email is required"),
  body("password")
    .exists()
    .withMessage("Password is required")
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
    .trim()
    .escape()
    .isString()
    .withMessage("Description must be a string"),
];

export const loginValidationSchema = [
  body("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Email must be valid")
    .notEmpty()
    .withMessage("Email is required"),
  body("password")
    .isString()
    .withMessage("Password must be a string")
    .notEmpty()
    .withMessage("Password is required"),
];

export const resetPasswordValidationSchema = [
  body("token")
    .exists()
    .withMessage("Token is required")
    .isLength({ min: 64, max: 64 })
    .withMessage("Invalid token"),

  body("newPassword")
    .exists()
    .withMessage("New password is required")
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
];
