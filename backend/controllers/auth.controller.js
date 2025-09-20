import bcrypt from "bcrypt";
import { User } from "../model/user.model.js";
import { generateOTP } from "../utils/generateOTP.js";
import { sendEmail } from "../utils/mailer.js";
import jwt from 'jsonwebtoken';
import { Otp } from "../model/otp.model.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

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
};

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

    const dbEmail = await Otp.findOne({email});
      if (!dbEmail || !dbEmail.verified) {
      return res.status(401).json({
        success: false,
        message: "Email is not verified",
      });
    }

    await Otp.findOneAndDelete({email});

    const saltRounds = parseInt(process.env.GEN_SALT) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const dbUser = await User.create({
      user_name,
      email,
      password: hashedPassword,
    });

    const accessToken = jwt.sign(
      {
        _id: dbUser._id,
      },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      {
        _id: dbUser._id,
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
      message: "Register successfully",
      accessToken,
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

    const dbEmail = await Otp.findOne({ email });
    if (!dbEmail) {
      return res.status(403).json({
        success: false,
        message: "Email not found",
      });
    }

    if (otp !== dbEmail.otp) {
      return res.status(403).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    
    const otpAge = Date.now() - new Date(dbEmail.otpCreatedAt).getTime();
    if (otpAge > 5 * 60 * 1000) {
      return res.status(403).json({
        success: false,
        message: "OTP expired, request a new one",
      });
    }
    
    dbEmail.otp = undefined;
    dbEmail.verified = true;
    await dbEmail.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });

  } catch (error) {
    console.error("Error in verifyOTP:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Refresh token missing",
      });
    }

    jwt.verify(token, process.env.JWT_REFRESH_SECRET, async (err, payload) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: "Invalid or expired refresh token",
        });
      }

      const user = await User.findById(payload._id);
      if (!user) {
        return res.status(403).json({
          success: false,
          message: "User no longer exists",
        });
      }

      const accessToken = jwt.sign(
        { _id: user._id },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: "15m" }
      );

      // Optional: rotate refresh token
      // const newRefreshToken = jwt.sign(
      //   { _id: user._id },
      //   process.env.JWT_REFRESH_SECRET,
      //   { expiresIn: "7d" }
      // );
      // res.cookie("refreshToken", newRefreshToken, {
      //   httpOnly: true,
      //   secure: process.env.NODE_ENV === "production",
      //   sameSite: "strict",
      //   maxAge: 30 * 24 * 60 * 60 * 1000,
      // });

      return res.status(200).json({
        success: true,
        message: "Access token refreshed",
        accessToken,
      });
    });

  } catch (error) {
    console.error("Error in refreshToken:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(403).json({
        success: false,
        message: "Email already exists",
      });
    }

    const OTP = generateOTP();
    await Otp.create({
      email,
      otp: OTP,
    });

    await sendEmail({ email, otp: OTP });

    return res.status(200).json({
      success: true,
      message: "OTP send to mail",
    });

  } catch (error) {
    console.error("Error in getOTP:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}