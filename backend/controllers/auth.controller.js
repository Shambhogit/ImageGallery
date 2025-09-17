import bcrypt from "bcrypt";
import { User } from "../model/user.model.js";
import { generateOTP } from "../utils/generateOTP.js";
import { sendEmail } from "../utils/mailer.js";
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log(req.ip);

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });

    }

    const result = await bcrypt.compare(password, user.password);
    if (!result) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const accessToken = jwt.sign(
      {
        _id: user._id,
      },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      {
        _id: user._id,
      },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "30d" }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      accessToken,
    });

  } catch (error) {
    console.error("Error in login:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
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

    const accessToken = jwt.sign(
      {
        _id: user._id,
      },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      {
        _id: user._id,
      },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "30d" }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Account verified successfully",
      accessToken,
    });

  } catch (error) {
    console.error("Error in verifyOTP:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};