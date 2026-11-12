import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { generateOTP, hashOTP, verifyHashedOTP, OTP_EXPIRY_MS, OTP_COOLDOWN_MS } from '../utils/otp.js';
import { sendOTPEmail } from '../utils/email.js';

/**
 * @desc    Register a new user, issue 6-digit OTP, send verification email
 * @route   POST /api/auth/signup
 * @access  Public
 */
export const signup = async (req, res, next) => {
  try {
    const { fullName, email, password, confirmPassword } = req.body;

    // Field presence validation
    if (!fullName || !email || !password || !confirmPassword) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide all required fields: fullName, email, password, and confirmPassword.',
      });
    }

    // Password confirmation validation
    if (password !== confirmPassword) {
      return res.status(400).json({
        status: 'error',
        message: 'Passwords do not match.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        status: 'error',
        message: 'Password must be at least 6 characters long.',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(400).json({
          status: 'error',
          message: 'An account with this email address is already registered and verified.',
        });
      }

      // Existing unverified user: update details and generate new OTP
      const plainOtp = generateOTP();
      const hashedOtp = hashOTP(plainOtp);

      existingUser.fullName = fullName.trim();
      existingUser.password = password; // Will be hashed by pre-save hook
      existingUser.otp = hashedOtp;
      existingUser.otpExpiresAt = new Date(Date.now() + OTP_EXPIRY_MS);
      existingUser.lastOtpSentAt = new Date();
      existingUser.otpAttempts = 0;

      await existingUser.save();

      // Dispatch OTP email
      const emailResult = await sendOTPEmail({
        to: existingUser.email,
        recipientName: existingUser.fullName,
        otp: plainOtp,
      });

      if (!emailResult.success) {
        return res.status(500).json({
          status: 'error',
          message: `Failed to deliver verification email: ${emailResult.error || 'SMTP delivery failed'}. Please check your email settings or try again.`,
        });
      }

      return res.status(200).json({
        status: 'success',
        message: 'Verification code resent. Please verify your email with the 6-digit OTP.',
        email: existingUser.email,
        emailConfigured: emailResult.configured,
      });
    }

    // New user registration
    const plainOtp = generateOTP();
    const hashedOtp = hashOTP(plainOtp);

    const newUser = new User({
      fullName: fullName.trim(),
      email: normalizedEmail,
      password, // Pre-save hook will hash this password
      isVerified: false,
      otp: hashedOtp,
      otpExpiresAt: new Date(Date.now() + OTP_EXPIRY_MS),
      lastOtpSentAt: new Date(),
      otpAttempts: 0,
    });

    await newUser.save();

    // Dispatch OTP email
    const emailResult = await sendOTPEmail({
      to: newUser.email,
      recipientName: newUser.fullName,
      otp: plainOtp,
    });

    if (!emailResult.success) {
      return res.status(500).json({
        status: 'error',
        message: `Failed to deliver verification email: ${emailResult.error || 'SMTP delivery failed'}. Please check your email settings or try again.`,
      });
    }

    return res.status(201).json({
      status: 'success',
      message: 'Account created successfully. A 6-digit verification code has been sent to your email.',
      email: newUser.email,
      emailConfigured: emailResult.configured,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Verify 6-digit OTP and activate account
 * @route   POST /api/auth/verify-otp
 * @access  Public
 */
export const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        status: 'error',
        message: 'Email and 6-digit OTP are required.',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Account not found with the provided email address.',
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        status: 'error',
        message: 'Account is already verified. Please proceed to login.',
      });
    }

    // Check OTP expiration
    if (!user.otpExpiresAt || new Date() > user.otpExpiresAt) {
      return res.status(400).json({
        status: 'error',
        message: 'The verification code has expired. Please request a new OTP.',
      });
    }

    // Check maximum verification attempts (brute force protection)
    if (user.otpAttempts >= 5) {
      user.otp = null;
      user.otpExpiresAt = null;
      user.otpAttempts = 0;
      await user.save();
      return res.status(400).json({
        status: 'error',
        message: 'Maximum verification attempts exceeded. For your security, this OTP has been invalidated. Please request a new OTP.',
      });
    }

    // Secure timing-safe verification
    const isValid = verifyHashedOTP(otp.toString().trim(), user.otp);

    if (!isValid) {
      user.otpAttempts = (user.otpAttempts || 0) + 1;
      await user.save();
      const remaining = 5 - user.otpAttempts;
      return res.status(400).json({
        status: 'error',
        message: remaining > 0
          ? `Invalid verification code. ${remaining} attempt(s) remaining.`
          : 'Maximum verification attempts reached. Please request a new code.',
      });
    }

    // Activate account and invalidate OTP
    user.isVerified = true;
    user.otp = null;
    user.otpExpiresAt = null;
    user.otpAttempts = 0;
    await user.save();

    return res.status(200).json({
      status: 'success',
      message: 'Email verified successfully! You can now log in to your account.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Resend a new 6-digit OTP to unverified account with cooldown
 * @route   POST /api/auth/resend-otp
 * @access  Public
 */
export const resendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: 'error',
        message: 'Email address is required.',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Account not found with the provided email address.',
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        status: 'error',
        message: 'Account is already verified. No OTP verification required.',
      });
    }

    // Resend cooldown enforcement (60 seconds)
    if (user.lastOtpSentAt) {
      const elapsed = Date.now() - new Date(user.lastOtpSentAt).getTime();
      if (elapsed < OTP_COOLDOWN_MS) {
        const remainingSeconds = Math.ceil((OTP_COOLDOWN_MS - elapsed) / 1000);
        return res.status(429).json({
          status: 'error',
          message: `Please wait ${remainingSeconds} seconds before requesting another verification code.`,
        });
      }
    }

    // Generate new OTP and replace existing
    const plainOtp = generateOTP();
    const hashedOtp = hashOTP(plainOtp);

    user.otp = hashedOtp;
    user.otpExpiresAt = new Date(Date.now() + OTP_EXPIRY_MS);
    user.lastOtpSentAt = new Date();
    user.otpAttempts = 0;
    await user.save();

    const emailResult = await sendOTPEmail({
      to: user.email,
      recipientName: user.fullName,
      otp: plainOtp,
    });

    if (!emailResult.success) {
      return res.status(500).json({
        status: 'error',
        message: `Failed to deliver verification email: ${emailResult.error || 'SMTP delivery failed'}. Please check your email settings or try again.`,
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'A new 6-digit verification code has been dispatched to your email.',
      email: user.email,
      emailConfigured: emailResult.configured,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate user, verify password, issue JWT
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide both email and password.',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password.',
      });
    }

    // Account verification guard
    if (!user.isVerified) {
      return res.status(403).json({
        status: 'error',
        message: 'Account not verified. Please verify your email using the 6-digit OTP before logging in.',
      });
    }

    // Password comparison
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password.',
      });
    }

    // Sign JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return res.status(200).json({
      status: 'success',
      message: 'Login successful.',
      token,
      user: user.toSafeObject(),
    });
  } catch (error) {
    next(error);
  }
};

