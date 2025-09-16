import bcrypt from "bcrypt";
import { User } from "../model/user.model.js";
import { generateOTP } from "../utils/generateOTP.js";
import { sendEmail } from "../utils/mailer.js";
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
    res.status(200).json({
        message: 'Login route',
    })
}

export const register = async (req, res) => {
    try {
        const { user_name, email, password } = req.body;

        const existingUserName = await User.findOne({ user_name });
        if (existingUserName) {
            return res.status(403).json({
                success: false,
                message: "Username already exists",
            });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(403).json({
                success: false,
                message: "Email already exists",
            });
        }

        const saltRounds = parseInt(process.env.GEN_SALT) || 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const OTP = generateOTP();

        const dbUser = await User.create({
            user_name,
            email,
            password: hashedPassword,
            otp: OTP,
        });

        await sendEmail({ email, otp: OTP });

        return res.status(201).json({
            success: true,
            message: "Please verify your email. OTP sent.",
        });

    } catch (error) {
        console.error("Error in Register:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(403).json({
        success: false,
        message: "Email not found",
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email already verified",
      });
    }

    if (otp !== user.otp) {
      return res.status(403).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    const otpAge = Date.now() - new Date(user.otpCreatedAt).getTime();
    if (otpAge > 5 * 60 * 1000) {
      return res.status(403).json({
        success: false,
        message: "OTP expired, request a new one",
      });
    }

    user.isEmailVerified = true;
    user.otp = undefined;
    user.otpCreatedAt = undefined;
    await user.save();

    const token = jwt.sign(
      {
        _id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      success: true,
      message: "Account verified successfully",
      token,
    });

  } catch (error) {
    console.error("Error in verifyOTP:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};