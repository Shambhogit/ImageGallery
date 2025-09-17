
import nodemailer from "nodemailer";

export const sendEmail = async ({ email, otp}) => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
    });

    // Mail options
    const mailOptions = {
      from: `"Photo Gallery " <${process.env.EMAIL_USER}>`,
      to:email,
      subject:"Verification Mail",
      text:`Your OTP is ${otp}. It will expire in 5 minutes`
    };

    // Send mail
    const info = await transporter.sendMail(mailOptions);
    // console.log("Email sent:", info.messageId);

    return info;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
};
