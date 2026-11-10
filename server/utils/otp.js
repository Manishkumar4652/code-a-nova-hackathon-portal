import crypto from 'crypto';

/**
 * OTP Validity Duration (10 minutes in milliseconds)
 */
export const OTP_EXPIRY_MS = 10 * 60 * 1000;

/**
 * OTP Resend Cooldown Duration (60 seconds in milliseconds)
 */
export const OTP_COOLDOWN_MS = 60 * 1000;

/**
 * Generate a cryptographically secure 6-digit OTP
 * @returns {string} 6-digit OTP string (100000 - 999999)
 */
export const generateOTP = () => {
  return crypto.randomInt(100000, 1000000).toString();
};

/**
 * Hash an OTP using SHA-256 for secure storage in database
 * @param {string} otp
 * @returns {string} SHA-256 hex digest
 */
export const hashOTP = (otp) => {
  return crypto.createHash('sha256').update(otp).digest('hex');
};

/**
 * Securely verify submitted plain OTP against stored hashed OTP
 * Uses timingSafeEqual to guard against timing attacks.
 * @param {string} submittedOtp
 * @param {string} storedHashedOtp
 * @returns {boolean}
 */
export const verifyHashedOTP = (submittedOtp, storedHashedOtp) => {
  if (!submittedOtp || !storedHashedOtp) return false;
  const submittedHash = hashOTP(submittedOtp);

  const bufA = Buffer.from(submittedHash, 'hex');
  const bufB = Buffer.from(storedHashedOtp, 'hex');

  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
};

