import express from 'express';
import { login, register, verifyOTP, refreshToken, getOTP} from '../controllers/auth.controller.js';
import { registerValidation, otpValidation, loginValidation, getOtpValidation} from '../utils/validator.js';
import { validateAuthRequest } from '../middlewares/validateAuthRequest.js';

const router = express();

router.post('/login', loginValidation, login);
router.post('/refresh', refreshToken);


router.post('/register', registerValidation, validateAuthRequest, register);
router.post('/verify-otp', otpValidation, validateAuthRequest, verifyOTP);
router.post('/get-otp', getOtpValidation, validateAuthRequest, getOTP)
export default router;