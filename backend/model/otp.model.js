import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    verified:{
        type:Boolean,
        default:false,
    },
    otp: {
      type: String,
    },
    otpCreatedAt: {
      type: Date,
      default: Date.now,
      expires: 300,
    },
  },
);

export const Otp = mongoose.model("Otp", otpSchema);
