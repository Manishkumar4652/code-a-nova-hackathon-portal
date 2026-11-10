import { Router } from 'express';
import { signup, verifyOTP, resendOTP, login } from '../controllers/authController.js';
import { authLimiter, loginLimiter, otpLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/signup', authLimiter, signup);
router.post('/verify-otp', otpLimiter, verifyOTP);
router.post('/resend-otp', otpLimiter, resendOTP);
router.post('/login', loginLimiter, login);

export default router;
