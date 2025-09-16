export const generateOTP = () => {
  const otp = Math.floor(10000000 + Math.random() * 90000000);
  return otp.toString();
};
