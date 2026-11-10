import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Mail, ArrowRight, RotateCw, CheckCircle2 } from 'lucide-react';
import { authService } from '../services/api';
import Button from '../components/Button';
import Input from '../components/Input';
import Alert from '../components/Alert';

export default function OTPVerify() {
  const location = useLocation();
  const navigate = useNavigate();

  // Read email from previous navigation state or allow manual input
  const initialEmail = location.state?.email || '';
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState('');

  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [cooldown, setCooldown] = useState(60);

  // 60-second cooldown countdown timer
  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Email address is required.');
      return;
    }

    const cleanOtp = otp.trim();
    if (!cleanOtp || cleanOtp.length !== 6 || !/^\d{6}$/.test(cleanOtp)) {
      setError('Please enter a valid 6-digit numeric OTP.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authService.verifyOTP({ email: email.trim(), otp: cleanOtp });
      if (response.status === 'success') {
        setSuccessMessage('Account verified successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login', {
            state: { verifiedEmail: email.trim() },
          });
        }, 1500);
      }
    } catch (err) {
      const message =
        err.response?.data?.message || 'Invalid or expired OTP. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || resendLoading) return;
    if (!email.trim()) {
      setError('Email address is required to resend OTP.');
      return;
    }

    setResendLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await authService.resendOTP(email.trim());
      if (response.status === 'success') {
        setSuccessMessage('A fresh 6-digit OTP has been dispatched to your email.');
        setCooldown(60); // Reset 60s cooldown
      }
    } catch (err) {
      const message =
        err.response?.data?.message || 'Failed to resend OTP. Please wait before retrying.';
      setError(message);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#030712] relative overflow-hidden">
      {/* Background Glow */}
      <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-purple-600/10 blur-[120px] rounded-full" />

      <div className="max-w-md w-full glass-panel border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-purple-500/10 text-purple-400 mb-3 border border-purple-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Verify Your Email
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Enter the 6-digit verification code sent to your registered email address. Valid for 10 minutes.
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6">
            <Alert type="error" message={error} onClose={() => setError('')} />
          </div>
        )}

        {successMessage && (
          <div className="mb-6">
            <Alert type="success" message={successMessage} />
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleVerify} className="space-y-5" noValidate>
          <Input
            label="Registered Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            icon={Mail}
            disabled={loading || Boolean(initialEmail)}
            helperText={initialEmail ? 'Pre-filled from signup session' : 'Enter your registered email address'}
          />

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              6-Digit Verification Code
            </label>
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="••••••"
              className="w-full text-center text-3xl font-mono font-bold tracking-[0.5em] py-3.5 px-4 rounded-xl bg-slate-900 border border-slate-800 text-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-smooth placeholder:tracking-normal placeholder:font-sans placeholder:text-slate-600"
              autoFocus
              disabled={loading}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            loading={loading}
          >
            <span>Verify & Activate Account</span>
            {!loading && <ArrowRight className="w-4 h-4 ml-1" />}
          </Button>
        </form>

        {/* Resend Cooldown Section */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-slate-400">Didn't receive the email?</span>
          <button
            type="button"
            onClick={handleResend}
            disabled={cooldown > 0 || resendLoading}
            className={`font-semibold transition-colors flex items-center gap-1 ${
              cooldown > 0
                ? 'text-slate-500 cursor-not-allowed'
                : 'text-indigo-400 hover:text-indigo-300 cursor-pointer'
            }`}
          >
            {resendLoading ? (
              <span>Sending...</span>
            ) : cooldown > 0 ? (
              <span>Resend in {cooldown}s</span>
            ) : (
              <>
                <RotateCw className="w-3.5 h-3.5" />
                <span>Resend Code</span>
              </>
            )}
          </button>
        </div>

        {/* Footer Link */}
        <div className="mt-4 text-center text-xs text-slate-500">
          Back to{' '}
          <Link to="/login" className="text-slate-400 hover:text-white transition-colors underline">
            Login Page
          </Link>
        </div>
      </div>
    </div>
  );
}

