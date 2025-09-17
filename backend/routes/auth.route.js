import express from 'express';
import { login, register, verifyOTP} from '../controllers/auth.controller.js';
import { registerValidation, otpValidation, loginValidation} from '../utils/validator.js';
import { validateAuthRequest } from '../middlewares/validateAuthRequest.js';

const router = express();

router.post('/login', loginValidation, login);
router.post('/register', registerValidation, validateAuthRequest, register);
router.post('/verify-otp', otpValidation, validateAuthRequest, verifyOTP);

export default router;