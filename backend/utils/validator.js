import { body } from "express-validator";

export const registerValidation = [
  body("user_name")
    .trim()
    .isLength({ min: 5, max: 50 })
    .withMessage("Username must be between 5 and 50 characters"),

  body("email")
    .isEmail()
    .withMessage("Invalid email address")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

export const loginValidation = [
  body("email").isEmail().withMessage("Invalid email address"),
  body("password").notEmpty().withMessage("Password is required"),
];

export const otpValidation = [
  body("email").isEmail().withMessage("Invalid email address"),
  body("otp")
    .isLength({ min: 8, max: 8 })
    .withMessage("OTP must be 8 digits"),
];
